"use client"

import { useEffect, useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataSimulator } from "@/lib/data-simulator"
import { MetricsCollector } from "@/lib/metrics-collector"
import { Play, Pause, AlertTriangle, CheckCircle2, XCircle } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { StatusBadge } from "@/components/status-badge"

const simulator = new DataSimulator()
const collector = new MetricsCollector()

interface Alert {
  id: string
  severity: "critical" | "warning" | "info"
  message: string
  timestamp: number
  metric: string
}

export default function MetricsPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [metrics, setMetrics] = useState(collector.getSnapshot())
  const [systemHealth, setSystemHealth] = useState(collector.getSystemHealth())

  useEffect(() => {
    const interval = setInterval(() => {
      const snapshot = collector.getSnapshot()
      const health = collector.getSystemHealth()
      setMetrics(snapshot)
      setSystemHealth(health)

      // Generate alerts based on metrics
      const newAlerts: Alert[] = []

      if (snapshot.p95Latency > 500) {
        newAlerts.push({
          id: `alert-${Date.now()}-1`,
          severity: "critical",
          message: `P95 latency exceeded 500ms: ${snapshot.p95Latency}ms`,
          timestamp: Date.now(),
          metric: "latency",
        })
      } else if (snapshot.p95Latency > 200) {
        newAlerts.push({
          id: `alert-${Date.now()}-2`,
          severity: "warning",
          message: `P95 latency above target: ${snapshot.p95Latency}ms (target: <200ms)`,
          timestamp: Date.now(),
          metric: "latency",
        })
      }

      if (health.availability < 95) {
        newAlerts.push({
          id: `alert-${Date.now()}-3`,
          severity: "critical",
          message: `Availability below 95%: ${health.availability}%`,
          timestamp: Date.now(),
          metric: "availability",
        })
      } else if (health.availability < 99) {
        newAlerts.push({
          id: `alert-${Date.now()}-4`,
          severity: "warning",
          message: `Availability below target: ${health.availability}% (target: ≥99%)`,
          timestamp: Date.now(),
          metric: "availability",
        })
      }

      if (snapshot.throughput > 100) {
        newAlerts.push({
          id: `alert-${Date.now()}-5`,
          severity: "info",
          message: `High throughput detected: ${snapshot.throughput} events/s`,
          timestamp: Date.now(),
          metric: "throughput",
        })
      }

      if (newAlerts.length > 0) {
        setAlerts((prev) => [...newAlerts, ...prev].slice(0, 50))
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const handleStart = () => {
    simulator.start((event) => {
      const success = Math.random() > 0.005
      collector.recordEvent(event, success)
    }, 12)
    setIsRunning(true)
  }

  const handleStop = () => {
    simulator.stop()
    setIsRunning(false)
  }

  const sloData = [
    {
      name: "P95 Latency",
      current: metrics.p95Latency,
      target: 200,
      unit: "ms",
      status: metrics.p95Latency < 200 ? "success" : metrics.p95Latency < 500 ? "warning" : "error",
    },
    {
      name: "Availability",
      current: systemHealth.availability,
      target: 99,
      unit: "%",
      status: systemHealth.availability >= 99 ? "success" : systemHealth.availability >= 95 ? "warning" : "error",
    },
    {
      name: "Throughput",
      current: metrics.throughput,
      target: 12,
      unit: "evt/s",
      status: "success",
    },
    {
      name: "Error Rate",
      current: systemHealth.errorRate,
      target: 1,
      unit: "%",
      status: systemHealth.errorRate < 1 ? "success" : systemHealth.errorRate < 5 ? "warning" : "error",
    },
  ]

  const chartData = [
    { metric: "Latency", value: metrics.p95Latency, target: 200 },
    { metric: "Availability", value: systemHealth.availability, target: 99 },
    { metric: "Throughput", value: metrics.throughput, target: 12 },
  ]

  const activeAlerts = alerts.filter((a) => Date.now() - a.timestamp < 60000)
  const criticalCount = activeAlerts.filter((a) => a.severity === "critical").length
  const warningCount = activeAlerts.filter((a) => a.severity === "warning").length

  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <main className="ml-64 flex-1">
        <div className="border-b border-border bg-background">
          <div className="flex h-16 items-center justify-between px-8">
            <div>
              <h1 className="text-2xl font-semibold">Metrics & Monitoring</h1>
              <p className="text-sm text-muted-foreground">SLO tracking and alerting</p>
            </div>
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
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <Card className="border-2 border-destructive/50 bg-destructive/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Critical Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-destructive" />
                  <span className="text-3xl font-bold text-destructive">{criticalCount}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-warning/50 bg-warning/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Warnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <span className="text-3xl font-bold text-warning">{warningCount}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-success/50 bg-success/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <StatusBadge status={systemHealth.status} showDot={false} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6 grid gap-6 lg:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">SLO Compliance</CardTitle>
                <CardDescription>Current metrics vs targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sloData.map((slo) => (
                    <div key={slo.name} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{slo.name}</span>
                        <div className="flex items-center gap-2">
                          <span
                            className={
                              slo.status === "success"
                                ? "text-success"
                                : slo.status === "warning"
                                  ? "text-warning"
                                  : "text-destructive"
                            }
                          >
                            {slo.current.toFixed(1)} {slo.unit}
                          </span>
                          <span className="text-muted-foreground">
                            / {slo.target} {slo.unit}
                          </span>
                        </div>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                          className={`h-full transition-all ${
                            slo.status === "success"
                              ? "bg-success"
                              : slo.status === "warning"
                                ? "bg-warning"
                                : "bg-destructive"
                          }`}
                          style={{
                            width: `${Math.min((slo.current / slo.target) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Performance Overview</CardTitle>
                <CardDescription>Current vs target metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="metric" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Current" />
                    <Bar dataKey="target" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Target" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base">Alert History</CardTitle>
              <CardDescription>Recent system alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {alerts.length === 0 ? (
                  <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                    No alerts yet. System is operating normally.
                  </div>
                ) : (
                  alerts.slice(0, 20).map((alert) => {
                    const Icon =
                      alert.severity === "critical"
                        ? XCircle
                        : alert.severity === "warning"
                          ? AlertTriangle
                          : CheckCircle2
                    const color =
                      alert.severity === "critical"
                        ? "text-destructive"
                        : alert.severity === "warning"
                          ? "text-warning"
                          : "text-info"

                    const timeAgo = Math.floor((Date.now() - alert.timestamp) / 1000)
                    const timeDisplay = timeAgo < 60 ? `${timeAgo}s ago` : `${Math.floor(timeAgo / 60)}m ago`

                    return (
                      <div
                        key={alert.id}
                        className="flex items-start gap-3 rounded-lg border border-border bg-secondary/50 p-3"
                      >
                        <Icon className={`mt-0.5 h-4 w-4 ${color}`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{alert.message}</p>
                          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="capitalize">{alert.severity}</span>
                            <span>•</span>
                            <span>{alert.metric}</span>
                            <span>•</span>
                            <span>{timeDisplay}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
