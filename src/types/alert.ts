export type AlertSeverity = 'critical' | 'warning' | 'attention' | 'camera' | 'healthy';

export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  timestamp: string;
  readStatus: boolean;
  category?: string;
}
