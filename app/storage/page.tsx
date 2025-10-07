"use client"

import { useEffect, useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataSimulator } from "@/lib/data-simulator"
import { MetricsCollector } from "@/lib/metrics-collector"
import { Play, Pause, Database, HardDrive, Clock, Zap } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const simulator = new DataSimulator()
const collector = new MetricsCollector()

export default function StoragePage() {
  const [isRunning, setIsRunning] = useState(false)
  const [metrics, setMetrics] = useState(collector.getSnapshot())

  useEffect(() => {
    const interval = setInterval(() => {
      const snapshot = collector.getSnapshot()
      setMetrics(snapshot)
    }, 1000)

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

  // Simulated storage metrics
  const storageUsed = (metrics.eventsReceived * 0.5) / 1024 // KB to MB
  const storageCapacity = 10000 // 10GB in MB
  const storagePercent = (storageUsed / storageCapacity) * 100

  const writeOps = metrics.throughput * 60 // per minute
  const avgWriteLatency = metrics.avgLatency

  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <main className="ml-64 flex-1">
        <div className="border-b border-border bg-background">
          <div className="flex h-16 items-center justify-between px-8">
            <div>
              <h1 className="text-2xl font-semibold">Storage</h1>
              <p className="text-sm text-muted-foreground">Database metrics and performance</p>
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
          <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-chart-1" />
                  <span className="text-3xl font-bold">{metrics.eventsReceived.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Storage Used</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-chart-2" />
                  <span className="text-3xl font-bold">{storageUsed.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">MB</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Write Ops/min</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-chart-3" />
                  <span className="text-3xl font-bold">{writeOps.toFixed(0)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg Write Latency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-chart-5" />
                  <span className="text-3xl font-bold">{avgWriteLatency}</span>
                  <span className="text-sm text-muted-foreground">ms</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Storage Capacity</CardTitle>
                <CardDescription>Current usage vs total capacity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Used</span>
                    <span className="font-medium">
                      {storageUsed.toFixed(2)} MB / {storageCapacity.toLocaleString()} MB
                    </span>
                  </div>
                  <Progress value={storagePercent} className="h-2" />
                  <p className="text-xs text-muted-foreground">{storagePercent.toFixed(2)}% utilized</p>
                </div>

                <div className="space-y-2 border-t border-border pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Events per MB</span>
                    <span className="font-medium">
                      {storageUsed > 0 ? (metrics.eventsReceived / storageUsed).toFixed(0) : 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Estimated capacity</span>
                    <span className="font-medium">
                      {storageUsed > 0 ? ((storageCapacity / storageUsed) * metrics.eventsReceived).toFixed(0) : "∞"}{" "}
                      events
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Database Performance</CardTitle>
                <CardDescription>Write operations and latency</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
                    <div>
                      <p className="text-sm font-medium">Batch Write Success</p>
                      <p className="text-xs text-muted-foreground">Events written successfully</p>
                    </div>
                    <span className="text-2xl font-bold text-success">
                      {((metrics.eventsProcessed / metrics.eventsReceived) * 100 || 0).toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
                    <div>
                      <p className="text-sm font-medium">Failed Writes</p>
                      <p className="text-xs text-muted-foreground">Events that failed to persist</p>
                    </div>
                    <span className="text-2xl font-bold text-destructive">{metrics.eventsFailed}</span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
                    <div>
                      <p className="text-sm font-medium">P95 Write Latency</p>
                      <p className="text-xs text-muted-foreground">95th percentile</p>
                    </div>
                    <span className="text-2xl font-bold text-info">{metrics.p95Latency}ms</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Table Schema</CardTitle>
                <CardDescription>DynamoDB sensor_events table structure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="pb-2 text-left font-medium text-muted-foreground">Attribute</th>
                        <th className="pb-2 text-left font-medium text-muted-foreground">Type</th>
                        <th className="pb-2 text-left font-medium text-muted-foreground">Key</th>
                        <th className="pb-2 text-left font-medium text-muted-foreground">Description</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono text-xs">
                      <tr className="border-b border-border">
                        <td className="py-2">pk</td>
                        <td className="py-2 text-muted-foreground">String</td>
                        <td className="py-2">
                          <span className="rounded bg-primary/20 px-2 py-0.5 text-primary">HASH</span>
                        </td>
                        <td className="py-2 text-muted-foreground">Partition key (sensor_hash#device_id)</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2">sk</td>
                        <td className="py-2 text-muted-foreground">Number</td>
                        <td className="py-2">
                          <span className="rounded bg-chart-2/20 px-2 py-0.5 text-chart-2">RANGE</span>
                        </td>
                        <td className="py-2 text-muted-foreground">Sort key (timestamp)</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2">device_id</td>
                        <td className="py-2 text-muted-foreground">String</td>
                        <td className="py-2">-</td>
                        <td className="py-2 text-muted-foreground">Device identifier</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2">sensor_type</td>
                        <td className="py-2 text-muted-foreground">String</td>
                        <td className="py-2">
                          <span className="rounded bg-chart-3/20 px-2 py-0.5 text-chart-3">GSI</span>
                        </td>
                        <td className="py-2 text-muted-foreground">Sensor type (temperature, etc.)</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2">value</td>
                        <td className="py-2 text-muted-foreground">Number</td>
                        <td className="py-2">-</td>
                        <td className="py-2 text-muted-foreground">Sensor reading value</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-2">processed_at</td>
                        <td className="py-2 text-muted-foreground">Number</td>
                        <td className="py-2">-</td>
                        <td className="py-2 text-muted-foreground">Processing timestamp</td>
                      </tr>
                      <tr>
                        <td className="py-2">ttl</td>
                        <td className="py-2 text-muted-foreground">Number</td>
                        <td className="py-2">-</td>
                        <td className="py-2 text-muted-foreground">Time-to-live for auto-expunge</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
