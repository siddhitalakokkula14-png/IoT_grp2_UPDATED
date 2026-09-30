import {
  TelemetryPayload,
  StatusResponse,
  ConnectionTestResult,
  CameraTelemetry
} from '../types/agri';

// ======================================================
// DEFAULT RASPBERRY PI API URL
// ======================================================

const DEFAULT_API_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://192.168.137.240:5000';

// ======================================================
// API SERVICE
// ======================================================

export class ApiService {

  private customBaseUrl: string | null = null;

  // ====================================================
  // CONSTRUCTOR
  // ====================================================

  constructor() {

    const saved =
      localStorage.getItem('AGRI_API_BASE_URL') ||
      localStorage.getItem('VITE_API_BASE_URL');

    if (saved) {

      const sanitized =
        this.sanitizeUrl(saved);

      if (sanitized === DEFAULT_API_URL) {

        this.customBaseUrl =
          sanitized;

      } else {

        localStorage.removeItem(
          'AGRI_API_BASE_URL'
        );

        localStorage.removeItem(
          'VITE_API_BASE_URL'
        );

        this.customBaseUrl = null;
      }
    }
  }

  // ====================================================
  // SANITIZE URL
  // ====================================================

  public sanitizeUrl(
    url: string
  ): string {

    let clean =
      url.trim();

    if (!clean) {
      return DEFAULT_API_URL;
    }

    if (
      !clean.startsWith('http://') &&
      !clean.startsWith('https://')
    ) {
      clean =
        'http://' + clean;
    }

    return clean.replace(/\/+$/, '');
  }

  // ====================================================
  // GET API BASE URL
  // ====================================================

  public getApiBaseUrl(): string {

    return (
      this.customBaseUrl ||
      DEFAULT_API_URL
    );
  }

  // ====================================================
  // SET API BASE URL
  // ====================================================

  public setApiBaseUrl(
    url: string
  ): string {

    const sanitized =
      this.sanitizeUrl(url);

    this.customBaseUrl =
      sanitized;

    localStorage.setItem(
      'AGRI_API_BASE_URL',
      sanitized
    );

    localStorage.setItem(
      'VITE_API_BASE_URL',
      sanitized
    );

    return sanitized;
  }

  // ====================================================
  // RESET API BASE URL
  // ====================================================

  public resetApiBaseUrl(): string {

    localStorage.removeItem(
      'AGRI_API_BASE_URL'
    );

    localStorage.removeItem(
      'VITE_API_BASE_URL'
    );

    this.customBaseUrl = null;

    return this.getApiBaseUrl();
  }

  // ====================================================
  // SEND SMS ALERT THROUGH RASPBERRY PI BACKEND
  // Twilio credentials never reach the browser.
  // ====================================================

  public async sendSmsAlert(
    type: 'soil' | 'water',
    value: number
  ): Promise<{ sent: boolean; configured?: boolean; message?: string }> {
    try {
      const { response } = await this.fetchWithTimeout(
        '/api/alerts/sms',
        { method: 'POST', body: JSON.stringify({ type, value }) },
        5000
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || `SMS request failed (${response.status})`);
      }
      return data;
    } catch (error) {
      console.warn('[SMS] Alert could not be sent:', error);
      return { sent: false, configured: false, message: error instanceof Error ? error.message : 'SMS service unavailable' };
    }
  }

  // ====================================================
  // FETCH WITH TIMEOUT
  // ====================================================

  private async fetchWithTimeout(
    endpoint: string,
    options: RequestInit = {},
    timeoutMs: number = 4000,
    overrideBaseUrl?: string
  ): Promise<{
    response: Response;
    latencyMs: number;
  }> {

    const baseUrl =
      overrideBaseUrl
        ? this.sanitizeUrl(
            overrideBaseUrl
          )
        : this.getApiBaseUrl();

    const fullUrl =
      `${baseUrl}${
        endpoint.startsWith('/')
          ? ''
          : '/'
      }${endpoint}`;

    console.log(
      '[API] Request:',
      options.method || 'GET',
      fullUrl
    );

    const controller =
      new AbortController();

    const timeoutId =
      setTimeout(
        () => controller.abort(),
        timeoutMs
      );

    const startTime =
      performance.now();

    try {

      const response =
        await fetch(
          fullUrl,
          {
            ...options,
            signal:
              controller.signal,

            headers: {
              Accept:
                'application/json',

              'Content-Type':
                'application/json',

              'Cache-Control':
                'no-cache',

              ...(options.headers || {})
            }
          }
        );

      const endTime =
        performance.now();

      clearTimeout(
        timeoutId
      );

      console.log(
        '[API] Response:',
        response.status,
        fullUrl
      );

      return {
        response,
        latencyMs:
          Math.round(
            endTime -
            startTime
          )
      };

    } catch (err: any) {

      clearTimeout(
        timeoutId
      );

      if (
        err.name ===
        'AbortError'
      ) {

        throw new Error(
          `Network timeout after ${timeoutMs}ms connecting to ${baseUrl}`
        );
      }

      console.error(
        '[API] Network error:',
        err
      );

      throw err;
    }
  }

  // ====================================================
  // GET STATUS
  // ====================================================

  public async getStatus(
    customUrl?: string
  ): Promise<ConnectionTestResult> {

    const targetUrl =
      customUrl
        ? this.sanitizeUrl(
            customUrl
          )
        : this.getApiBaseUrl();

    const timestamp =
      new Date().toISOString();

    try {

      const {
        response,
        latencyMs
      } =
        await this.fetchWithTimeout(
          '/api/status',
          {
            method: 'GET'
          },
          4000,
          targetUrl
        );

      if (!response.ok) {

        return {
          success: false,
          timestamp,
          url: targetUrl,
          latencyMs,
          error:
            `HTTP ${response.status} ${response.statusText}`
        };
      }

      const data:
        StatusResponse =
        await response.json();

      return {
        success: true,
        timestamp,
        url: targetUrl,
        latencyMs,
        data
      };

    } catch (err: any) {

      return {
        success: false,
        timestamp,
        url: targetUrl,
        error:
          err.message ||
          'Unable to connect to Raspberry Pi API'
      };
    }
  }

  // ====================================================
  // GET TELEMETRY
  // ====================================================

  public async getTelemetry(): Promise<{
    data: TelemetryPayload;
    latencyMs: number;
  }> {

    const {
      response,
      latencyMs
    } =
      await this.fetchWithTimeout(
        '/api/telemetry',
        {
          method: 'GET'
        },
        4000
      );

    if (!response.ok) {

      throw new Error(
        `Telemetry request failed with status ${response.status}`
      );
    }

    const data:
      TelemetryPayload =
      await response.json();

    return {
      data,
      latencyMs
    };
  }

  // ====================================================
  // GET CAMERA INFORMATION
  // ====================================================

  public async getCameraInfo(): Promise<CameraTelemetry> {

    const {
      response
    } =
      await this.fetchWithTimeout(
        '/api/camera/latest',
        {
          method: 'GET'
        },
        4000
      );

    if (!response.ok) {

      throw new Error(
        `Camera info request failed with status ${response.status}`
      );
    }

    return await response.json();
  }

  // ====================================================
  // CAMERA IMAGE URL
  // ====================================================

  public getCameraImageUrl(
    timestampSuffix?: string
  ): string {

    const baseUrl =
      this.getApiBaseUrl();

    const t =
      timestampSuffix ||
      Date.now().toString();

    return `${baseUrl}/api/camera/image?t=${t}`;
  }

  // ====================================================
  // GET PUMP STATUS
  // ====================================================

  public async getPumpStatus(): Promise<{
    pump: string;
    relay: string;
    on?: boolean;
    status?: string;
  }> {

    const {
      response
    } =
      await this.fetchWithTimeout(
        '/api/pump',
        {
          method: 'GET'
        },
        4000
      );

    if (!response.ok) {

      throw new Error(
        `Pump status failed with status ${response.status}`
      );
    }

    return await response.json();
  }

  // ====================================================
  // CONTROL WATER PUMP
  // ====================================================

  public async controlPump(
    state: 'ON' | 'OFF'
  ): Promise<{
    success: boolean;
    pump: string;
    relay: string;
    status?: string;
    on?: boolean;
    message?: string;
  }> {

    console.log(
      `[WEB] Sending pump command: ${state}`
    );

    const {
      response
    } =
      await this.fetchWithTimeout(
        '/api/pump',
        {
          method: 'POST',

          body: JSON.stringify({
            state: state
          })
        },
        6000
      );

    let data: any;

    try {

      data =
        await response.json();

    } catch {

      throw new Error(
        `Invalid JSON response from pump API (HTTP ${response.status})`
      );
    }

    console.log(
      '[WEB] Pump API response:',
      data
    );

    if (
      !response.ok ||
      data.success === false
    ) {

      throw new Error(
        data.error ||
        data.message ||
        `Pump control failed (HTTP ${response.status})`
      );
    }

    if (
      data.pump !== 'ON' &&
      data.pump !== 'OFF'
    ) {

      throw new Error(
        `Invalid pump state returned by API: ${data.pump}`
      );
    }

    return data;
  }

  // ====================================================
  // AUTO IRRIGATION
  // ====================================================

  public async updateAutoIrrigation(
    enabled: boolean,
    threshold: number
  ): Promise<any> {

    const {
      response
    } =
      await this.fetchWithTimeout(
        '/api/auto-irrigation',
        {
          method: 'POST',

          body: JSON.stringify({
            enabled,
            threshold
          })
        },
        5000
      );

    if (!response.ok) {

      throw new Error(
        `Failed to update auto-irrigation config (HTTP ${response.status})`
      );
    }

    return await response.json();
  }
}

// ======================================================
// SINGLE API SERVICE INSTANCE
// ======================================================

export const apiService =
  new ApiService();