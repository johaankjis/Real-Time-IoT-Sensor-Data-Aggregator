"use client"

import { useEffect, useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { MetricCard } from "@/components/metric-card"
import { TimeSeriesChart } from "@/components/time-series-chart"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { DataSimulator } from "@/lib/data-simulator"
import { MetricsCollector } from "@/lib/metrics-collector"
import type { MetricsSnapshot } from "@/lib/types"
import { Play, Pause, Zap, RefreshCw } from "lucide-react"

const simulator = new DataSimulator()
const collector = new MetricsCollector()

export default function OverviewPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [metrics, setMetrics] = useState<MetricsSnapshot | null>(null)
  const [metricsHistory, setMetricsHistory] = useState<MetricsSnapshot[]>([])
  const [systemHealth, setSystemHealth] = useState(collector.getSystemHealth())

  useEffect(() => {
    const interval = setInterval(() => {
      const snapshot = collector.getSnapshot()
      setMetrics(snapshot)
      setSystemHealth(collector.getSystemHealth())

      setMetricsHistory((prev) => {
        const updated = [...prev, snapshot]
        return updated.slice(-60) // Keep last 60 snapshots (1 minute at 1s intervals)
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleStart = () => {
    simulator.start((event) => {
      // Simulate 99.5% success rate
      const success = Math.random() > 0.005
      collector.recordEvent(event, success)
    }, 12)
    setIsRunning(true)
  }

  const handleStop = () => {
    simulator.stop()
    setIsRunning(false)
  }

  const handleBurst = () => {
    simulator.burst((event) => {
      const success = Math.random() > 0.005
      collector.recordEvent(event, success)
    }, 500)
  }

  const handleReset = () => {
    collector.reset()
    setMetricsHistory([])
    setMetrics(null)
    setSystemHealth(collector.getSystemHealth())
  }

  const throughputData = metricsHistory.map((m) => ({
    timestamp: m.timestamp,
    throughput: m.throughput,
  }))

  const latencyData = metricsHistory.map((m) => ({
    timestamp: m.timestamp,
    avg: m.avgLatency,
    p95: m.p95Latency,
  }))

  const eventsData = metricsHistory.map((m) => ({
    timestamp: m.timestamp,
    processed: m.eventsProcessed,
    failed: m.eventsFailed,
  }))

  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <main className="ml-64 flex-1">
        <div className="border-b border-border bg-background">
          <div className="flex h-16 items-center justify-between px-8">
            <div>
              <h1 className="text-2xl font-semibold">Observability</h1>
            </div>
            <div className="flex items-center gap-4">
              <StatusBadge status={systemHealth.status} />
              <div className="flex items-center gap-2">
                <Button
                  onClick={isRunning ? handleStop : handleStart}
                  variant={isRunning ? "destructive" : "default"}
                  size="sm"
                >
                  {isRunning ? (
                    <>
                      <Pause className="mr-2 h-4 w-4" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Start
                    </>
                  )}
                </Button>
                <Button onClick={handleBurst} variant="outline" size="sm" disabled={!isRunning}>
                  <Zap className="mr-2 h-4 w-4" />
                  Burst
                </Button>
                <Button onClick={handleReset} variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Events Received"
              value={metrics?.eventsReceived.toLocaleString() || "0"}
              trend="up"
              trendValue={`${metrics?.throughput || 0}/s`}
              description="Total ingested"
              status="info"
            />
            <MetricCard
              title="P95 Latency"
              value={metrics?.p95Latency || 0}
              unit="ms"
              status={!metrics || metrics.p95Latency < 200 ? "success" : metrics.p95Latency < 500 ? "warning" : "error"}
              description="Target: < 200ms"
            />
            <MetricCard
              title="Throughput"
              value={metrics?.throughput || 0}
              unit="events/s"
              description="Current rate"
              status="info"
            />
            <MetricCard
              title="Availability"
              value={systemHealth.availability}
              unit="%"
              status={
                systemHealth.availability >= 99 ? "success" : systemHealth.availability >= 95 ? "warning" : "error"
              }
              description="Target: ≥ 99%"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <TimeSeriesChart
              title="Throughput"
              description="Events processed per second"
              data={throughputData}
              dataKeys={[{ key: "throughput", color: "hsl(var(--chart-1))", label: "Events/sec" }]}
              yAxisLabel="Events/s"
            />

            <TimeSeriesChart
              title="Latency Distribution"
              description="Average and P95 latency over time"
              data={latencyData}
              dataKeys={[
                { key: "avg", color: "hsl(var(--chart-2))", label: "Average" },
                { key: "p95", color: "hsl(var(--chart-3))", label: "P95" },
              ]}
              yAxisLabel="ms"
            />

            <TimeSeriesChart
              title="Event Processing"
              description="Processed vs failed events"
              data={eventsData}
              dataKeys={[
                { key: "processed", color: "hsl(var(--chart-2))", label: "Processed" },
                { key: "failed", color: "hsl(var(--chart-4))", label: "Failed" },
              ]}
              yAxisLabel="Count"
            />

            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4 text-base font-semibold">System Health</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <StatusBadge status={systemHealth.status} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Uptime</span>
                  <span className="text-sm font-medium">
                    {Math.floor(systemHealth.uptime / 60000)}m {Math.floor((systemHealth.uptime % 60000) / 1000)}s
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Availability</span>
                  <span className="text-sm font-medium">{systemHealth.availability}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Error Rate</span>
                  <span className="text-sm font-medium">{systemHealth.errorRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Events</span>
                  <span className="text-sm font-medium">{metrics?.eventsReceived.toLocaleString() || "0"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Failed Events</span>
                  <span className="text-sm font-medium">{metrics?.eventsFailed.toLocaleString() || "0"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
