import React, {
  useState,
  useEffect,
  useCallback,
  useRef
} from 'react';

import { Navbar } from './components/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { SoilHealthPage } from './pages/SoilHealthPage';
import { IrrigationPage } from './pages/IrrigationPage';
import { CameraPage } from './pages/CameraPage';
import { SettingsPage } from './pages/SettingsPage';
import { BackendDocsPage } from './pages/BackendDocsPage';
import { Bell, Droplets, Sprout, X } from 'lucide-react';

import { apiService } from './services/apiService';

import {
  ConnectionStatus,
  TelemetryPayload,
  StatusResponse,
  SoilReadingHistoryPoint
} from './types/agri';

export const App: React.FC = () => {

  // ==================================================
  // ACTIVE PAGE
  // ==================================================

  const [activeTab, setActiveTab] =
    useState<string>('dashboard');


  // ==================================================
  // NETWORK & TELEMETRY STATES
  // ==================================================

  const [apiUrl, setApiUrl] =
    useState<string>(
      apiService.getApiBaseUrl()
    );

  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('CONNECTING');

  const [telemetry, setTelemetry] =
    useState<TelemetryPayload | null>(null);

  const [statusInfo, setStatusInfo] =
    useState<StatusResponse | null>(null);

  const [latencyMs, setLatencyMs] =
    useState<number | null>(null);

  const [lastUpdated, setLastUpdated] =
    useState<Date | null>(null);

  const [isStale, setIsStale] =
    useState<boolean>(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  // Threshold notification shown directly on the website.
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(
    typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
  );

  const [thresholdNotices, setThresholdNotices] = useState<Array<{
    id: string;
    type: 'soil' | 'water';
    value: number;
    message: string;
  }>>([]);

  const previousThresholdValues = useRef<{
    soilMoisture: number | null;
    waterLevel: number | null;
  }>({
    soilMoisture: null,
    waterLevel: null
  });


  // ==================================================
  // SOIL HISTORY
  // ==================================================

  const [history, setHistory] =
    useState<SoilReadingHistoryPoint[]>([]);


  // ==================================================
  // POLLING
  // ==================================================

  const [pollingInterval, setPollingInterval] =
    useState<number>(1000);

  const isPollingRef =
    useRef<boolean>(false);


  // ==================================================
  // FETCH TELEMETRY
  // ==================================================

  const fetchTelemetry = useCallback(async () => {

    if (isPollingRef.current) {
      return;
    }

    isPollingRef.current = true;

    try {

      console.log('[WEB] Fetching telemetry...');

      const {
        data,
        latencyMs: ping
      } = await apiService.getTelemetry();


      // ----------------------------------------------
      // TELEMETRY
      // ----------------------------------------------

      setTelemetry(data);


      // ----------------------------------------------
      // LATENCY
      // ----------------------------------------------

      setLatencyMs(ping);


      // ----------------------------------------------
      // TIME
      // ----------------------------------------------

      const now = new Date();

      setLastUpdated(now);


      // ----------------------------------------------
      // CONNECTION
      // ----------------------------------------------

      setConnectionStatus('ONLINE');

      setIsStale(false);

      setErrorMessage(null);


      // ----------------------------------------------
      // SOIL HISTORY
      // ----------------------------------------------

      if (
        data.soilStatus !== 'unavailable' &&
        data.soilMoisture !== null &&
        data.soilMoisture !== undefined
      ) {

        const timeFormatted =
          now.toLocaleTimeString(
            [],
            {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            }
          );


        setHistory((prev) => {

          const lastPoint =
            prev[prev.length - 1];


          if (
            lastPoint &&
            lastPoint.timeFormatted === timeFormatted
          ) {
            return prev;
          }


          const newPoint: SoilReadingHistoryPoint = {

            timestamp:
              now.toISOString(),

            timeFormatted,

            moisture:
              Number(
                data.soilMoisture
              ),

            raw:
              Number(
                data.soilRaw ?? 0
              ),

            voltage:
              Number(
                data.soilVoltage ?? 0
              )

          };


          return [
            ...prev.slice(-49),
            newPoint
          ];

        });

      }

    } catch (err: any) {

      console.error(
        '[WEB] Telemetry error:',
        err
      );


      setConnectionStatus(
        'OFFLINE'
      );


      setErrorMessage(
        err?.message ||
        'API OFFLINE — unable to receive live data from Raspberry Pi.'
      );

    } finally {

      isPollingRef.current = false;

    }

  }, []);


  // ==================================================
  // FETCH STATUS
  // ==================================================

  const fetchStatusInfo = useCallback(async () => {

    try {

      const res =
        await apiService.getStatus();


      if (
        res.success &&
        res.data
      ) {

        setStatusInfo(
          res.data
        );

      }

    } catch (error) {

      console.error(
        '[WEB] Status request failed:',
        error
      );

    }

  }, []);


  // ==================================================
  // SETUP POLLING
  // ==================================================

  useEffect(() => {

    fetchTelemetry();

    fetchStatusInfo();


    const intervalId =
      setInterval(
        () => {
          fetchTelemetry();
        },
        pollingInterval
      );


    return () => {
      clearInterval(intervalId);
    };

  }, [
    fetchTelemetry,
    fetchStatusInfo,
    pollingInterval,
    apiUrl
  ]);


  // ==================================================
  // CHECK STALE DATA
  // ==================================================

  useEffect(() => {

    const staleChecker =
      setInterval(() => {

        if (!lastUpdated) {
          return;
        }


        const diffMs =
          Date.now() -
          lastUpdated.getTime();


        if (diffMs > 10000) {

          setIsStale(true);

        }

      }, 2000);


    return () => {
      clearInterval(staleChecker);
    };

  }, [lastUpdated]);


  // ==================================================
  // BROWSER NOTIFICATIONS
  // ==================================================

  const enableNotifications = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setNotificationsEnabled(false);
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
    } catch (error) {
      console.warn('[Notifications] Permission request failed:', error);
      setNotificationsEnabled(false);
    }
  }, []);

  // ==================================================
  // LIVE THRESHOLD NOTIFICATIONS
  // Soil <45% and Water <40%
  // ==================================================

  useEffect(() => {
    if (!telemetry) return;

    const soil = telemetry.soilMoisture;
    const water = telemetry.waterLevel ?? null;
    const previous = previousThresholdValues.current;

    // Notify when a sensor first becomes unsafe OR crosses into the unsafe range.
    // We intentionally do not repeat the same alert on every 1-second poll.
    const soilBecameLow =
      soil !== null &&
      soil < 45 &&
      (previous.soilMoisture === null || previous.soilMoisture >= 45);

    const waterBecameLow =
      water !== null &&
      water < 40 &&
      (previous.waterLevel === null || previous.waterLevel >= 40);

    const newNotices: Array<{
      id: string;
      type: 'soil' | 'water';
      value: number;
      message: string;
    }> = [];

    if (soilBecameLow) {
      newNotices.push({
        id: `soil-${Date.now()}`,
        type: 'soil',
        value: soil,
        message: `Soil moisture is below 45%. Current level: ${soil}%.`
      });
    }

    if (waterBecameLow) {
      newNotices.push({
        id: `water-${Date.now()}`,
        type: 'water',
        value: water,
        message: `Water level is below 40%. Current level: ${water}%.`
      });
    }

    if (newNotices.length > 0) {
      setThresholdNotices((current) => [...current, ...newNotices].slice(-4));

      // Also send an operating-system/browser notification when permission has been granted.
      // This does not control the motor and does not require Twilio or an SMS account.
      if (notificationsEnabled && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        newNotices.forEach((notice) => {
          const title = notice.type === 'soil'
            ? '🌱 SmartAgri — Soil Moisture Alert'
            : '💧 SmartAgri — Water Level Alert';

          try {
            new Notification(title, {
              body: notice.message,
              tag: `smartagri-${notice.type}`,
              requireInteraction: true
            });
          } catch (error) {
            console.warn('[Notifications] Could not show system notification:', error);
          }
        });
      }
    }

    previousThresholdValues.current = {
      soilMoisture: soil,
      waterLevel: water
    };
  }, [telemetry?.soilMoisture, telemetry?.waterLevel, notificationsEnabled]);

  useEffect(() => {
    if (thresholdNotices.length === 0) return;

    const timer = window.setTimeout(() => {
      setThresholdNotices((current) => current.slice(1));
    }, 10000);

    return () => window.clearTimeout(timer);
  }, [thresholdNotices]);

  // ==================================================
  // PUMP CONTROL
  return (

    <div
      className="
        min-h-screen
        bg-[#090d16]
        text-slate-100
        flex
        flex-col
        justify-between
        selection:bg-emerald-500/30
        selection:text-emerald-200
      "
    >

      {/* ==================================================
          NAVBAR
      ================================================== */}

      <Navbar

        activeTab={
          activeTab
        }

        setActiveTab={
          setActiveTab
        }

        connectionStatus={
          connectionStatus
        }

        telemetry={
          telemetry
        }

        latencyMs={
          latencyMs
        }

        isStale={
          isStale
        }

        apiUrl={
          apiUrl
        }

      />


      <div className="fixed right-4 top-20 z-40">
        <button
          type="button"
          onClick={enableNotifications}
          disabled={notificationsEnabled}
          className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-xl backdrop-blur-xl transition ${
            notificationsEnabled
              ? 'cursor-default border-emerald-400/30 bg-emerald-950/80 text-emerald-200'
              : 'border-white/10 bg-slate-900/95 text-white hover:bg-slate-800'
          }`}
        >
          <Bell className="h-4 w-4" />
          {notificationsEnabled ? 'Notifications Enabled' : 'Enable Notifications'}
        </button>
      </div>

      {thresholdNotices.length > 0 && (
        <div className="fixed right-4 top-36 z-50 w-[min(420px,calc(100vw-2rem))] space-y-3">
          {thresholdNotices.map((notice) => (
            <div key={notice.id} className="animate-fade-up">
              <div className={`rounded-2xl border p-4 shadow-2xl backdrop-blur-xl ${
                notice.type === 'soil'
                  ? 'bg-rose-950/95 border-rose-400/40'
                  : 'bg-amber-950/95 border-amber-400/40'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl ${
                    notice.type === 'soil'
                      ? 'bg-rose-500/20 text-rose-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {notice.type === 'soil'
                      ? <Sprout className="w-5 h-5" />
                      : <Droplets className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-white" />
                      <p className="font-bold text-white">
                        {notice.type === 'soil' ? 'Soil Moisture Alert' : 'Water Level Alert'}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-slate-200">{notice.message}</p>
                    <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      {notice.type === 'soil' ? 'Threshold: below 45%' : 'Threshold: below 40%'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setThresholdNotices((current) => current.filter((item) => item.id !== notice.id))}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                    aria-label="Dismiss notification"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main
        className="
          max-w-7xl
          w-full
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          py-8
          flex-1
          animate-fade-up
        "
      >

        {/* ==================================================
            DASHBOARD
        ================================================== */}

        {activeTab === 'dashboard' && (

          <DashboardPage

            connectionStatus={
              connectionStatus
            }

            telemetry={
              telemetry
            }

            statusInfo={
              statusInfo
            }

            latencyMs={
              latencyMs
            }

            apiUrl={
              apiUrl
            }

            lastUpdated={
              lastUpdated
            }

            isStale={
              isStale
            }

            errorMessage={
              errorMessage
            }

            history={
              history
            }


            onOpenSettings={() =>
              setActiveTab(
                'settings'
              )
            }

            onManualRefresh={
              fetchTelemetry
            }

          />

        )}


        {/* ==================================================
            SOIL HEALTH
        ================================================== */}

        {activeTab === 'soil' && (

          <SoilHealthPage

            telemetry={
              telemetry
            }

            isApiOffline={
              connectionStatus ===
              'OFFLINE'
            }

            history={
              history
            }

          />

        )}


        {/* ==================================================
            IRRIGATION
        ================================================== */}

        {activeTab === 'irrigation' && (

          <IrrigationPage

            telemetry={
              telemetry
            }

            isApiOffline={
              connectionStatus ===
              'OFFLINE'
            }


            onRefresh={
              fetchTelemetry
            }

          />

        )}


        {/* ==================================================
            CAMERA
        ================================================== */}

        {activeTab === 'camera' && (

          <CameraPage

            telemetry={
              telemetry
            }

            isApiOffline={
              connectionStatus ===
              'OFFLINE'
            }

          />

        )}


        {/* ==================================================
            SETTINGS
        ================================================== */}

        {activeTab === 'settings' && (

          <SettingsPage

            currentApiUrl={
              apiUrl
            }

            connectionStatus={
              connectionStatus
            }

            pollingInterval={
              pollingInterval
            }

            setPollingInterval={
              setPollingInterval
            }

            onUpdateApiUrl={
              handleUpdateApiUrl
            }

            telemetry={
              telemetry
            }

            lastUpdated={
              lastUpdated
            }

          />

        )}


        {/* ==================================================
            BACKEND DOCUMENTATION
        ================================================== */}

        {activeTab === 'docs' && (

          <BackendDocsPage />

        )}

      </main>


      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer
        className="
          border-t
          border-slate-800/80
          py-4
          bg-[#090d16]/80
          text-xs
          text-slate-500
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            sm:px-6
            lg:px-8
            flex
            flex-col
            sm:flex-row
            items-center
            justify-between
            gap-2
          "
        >

          <span>
            Smart Agriculture Monitoring & Irrigation System
            — Raspberry Pi 4
          </span>


          <span className="font-mono">

            API Base:
            {' '}

            {apiUrl}

          </span>

        </div>

      </footer>

    </div>

  );

};