export type SensorType = "temperature" | "accelerometer" | "pressure" | "humidity"

export interface SensorEvent {
  id: string
  deviceId: string
  sensorType: SensorType
  value: number
  timestamp: number
  processedAt?: number
  ingestLatency?: number
}

export interface MetricsSnapshot {
  timestamp: number
  eventsReceived: number
  eventsProcessed: number
  eventsFailed: number
  avgLatency: number
  p95Latency: number
  throughput: number
}

export interface SystemHealth {
  status: "healthy" | "degraded" | "critical"
  uptime: number
  availability: number
  errorRate: number
}
