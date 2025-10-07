import type { SensorEvent, MetricsSnapshot } from "./types"

export class MetricsCollector {
  private events: SensorEvent[] = []
  private latencies: number[] = []
  private failedCount = 0
  private startTime = Date.now()
  private readonly maxHistorySize = 1000

  recordEvent(event: SensorEvent, success = true) {
    const processedAt = Date.now()
    const latency = processedAt - event.timestamp

    const processedEvent = {
      ...event,
      processedAt,
      ingestLatency: latency,
    }

    this.events.push(processedEvent)
    this.latencies.push(latency)

    if (!success) {
      this.failedCount++
    }

    // Keep only recent events
    if (this.events.length > this.maxHistorySize) {
      this.events.shift()
    }
    if (this.latencies.length > this.maxHistorySize) {
      this.latencies.shift()
    }
  }

  getSnapshot(): MetricsSnapshot {
    const now = Date.now()
    const recentEvents = this.events.filter((e) => now - e.timestamp < 60000) // Last minute
    const recentLatencies = this.latencies.slice(-100)

    const avgLatency =
      recentLatencies.length > 0 ? recentLatencies.reduce((a, b) => a + b, 0) / recentLatencies.length : 0

    const p95Latency = this.calculateP95(recentLatencies)
    const throughput = recentEvents.length / 60 // events per second

    return {
      timestamp: now,
      eventsReceived: this.events.length,
      eventsProcessed: this.events.length - this.failedCount,
      eventsFailed: this.failedCount,
      avgLatency: Math.round(avgLatency),
      p95Latency: Math.round(p95Latency),
      throughput: Math.round(throughput * 10) / 10,
    }
  }

  private calculateP95(values: number[]): number {
    if (values.length === 0) return 0
    const sorted = [...values].sort((a, b) => a - b)
    const index = Math.ceil(sorted.length * 0.95) - 1
    return sorted[index] || 0
  }

  getRecentEvents(limit = 100): SensorEvent[] {
    return this.events.slice(-limit).reverse()
  }

  getEventsBySensor(sensorType: string, limit = 50): SensorEvent[] {
    return this.events
      .filter((e) => e.sensorType === sensorType)
      .slice(-limit)
      .reverse()
  }

  getSystemHealth() {
    const uptime = Date.now() - this.startTime
    const errorRate = this.events.length > 0 ? this.failedCount / this.events.length : 0
    const availability = 1 - errorRate

    let status: "healthy" | "degraded" | "critical"
    if (availability >= 0.99) status = "healthy"
    else if (availability >= 0.95) status = "degraded"
    else status = "critical"

    return {
      status,
      uptime,
      availability: Math.round(availability * 10000) / 100,
      errorRate: Math.round(errorRate * 10000) / 100,
    }
  }

  reset() {
    this.events = []
    this.latencies = []
    this.failedCount = 0
    this.startTime = Date.now()
  }
}
