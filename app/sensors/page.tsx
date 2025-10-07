"use client"

import { CardContent } from "@/components/ui/card"

import { CardTitle } from "@/components/ui/card"

import { CardHeader } from "@/components/ui/card"

import { Card } from "@/components/ui/card"

import { useEffect, useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { SensorCard } from "@/components/sensor-card"
import { SensorHistoryChart } from "@/components/sensor-history-chart"
import { EventLog } from "@/components/event-log"
import { Button } from "@/components/ui/button"
import { DataSimulator } from "@/lib/data-simulator"
import { MetricsCollector } from "@/lib/metrics-collector"
import type { SensorEvent, SensorType } from "@/lib/types"
import { Play, Pause } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const simulator = new DataSimulator()
const collector = new MetricsCollector()

export default function SensorsPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [recentEvents, setRecentEvents] = useState<SensorEvent[]>([])
  const [latestBySensor, setLatestBySensor] = useState<Record<string, SensorEvent>>({})

  useEffect(() => {
    const interval = setInterval(() => {
      const events = collector.getRecentEvents(50)
      setRecentEvents(events)

      // Get latest event for each sensor type
      const latest: Record<string, SensorEvent> = {}
      events.forEach((event) => {
        if (!latest[event.sensorType] || event.timestamp > latest[event.sensorType].timestamp) {
          latest[event.sensorType] = event
        }
      })
      setLatestBySensor(latest)
    }, 500)

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

  const sensorTypes: SensorType[] = ["temperature", "accelerometer", "pressure", "humidity"]

  const sensorColors: Record<SensorType, string> = {
    temperature: "hsl(var(--chart-3))",
    accelerometer: "hsl(var(--chart-1))",
    pressure: "hsl(var(--chart-5))",
    humidity: "hsl(var(--chart-2))",
  }

  const sensorUnits: Record<SensorType, string> = {
    temperature: "°C",
    accelerometer: "m/s²",
    pressure: "hPa",
    humidity: "%",
  }

  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <main className="ml-64 flex-1">
        <div className="border-b border-border bg-background">
          <div className="flex h-16 items-center justify-between px-8">
            <div>
              <h1 className="text-2xl font-semibold">Sensor Data</h1>
              <p className="text-sm text-muted-foreground">Real-time IoT sensor readings</p>
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
            {sensorTypes.map((type) => {
              const latest = latestBySensor[type]
              return latest ? (
                <SensorCard
                  key={type}
                  sensorType={type}
                  value={latest.value}
                  deviceId={latest.deviceId}
                  timestamp={latest.timestamp}
                />
              ) : (
                <Card key={type} className="border-2 border-dashed border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex h-16 items-center justify-center text-sm text-muted-foreground">
                      No data yet
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All Sensors</TabsTrigger>
              <TabsTrigger value="temperature">Temperature</TabsTrigger>
              <TabsTrigger value="accelerometer">Accelerometer</TabsTrigger>
              <TabsTrigger value="pressure">Pressure</TabsTrigger>
              <TabsTrigger value="humidity">Humidity</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {sensorTypes.map((type) => {
                  const sensorEvents = collector.getEventsBySensor(type, 30)
                  return (
                    <SensorHistoryChart
                      key={type}
                      title={`${type.charAt(0).toUpperCase() + type.slice(1)} History`}
                      data={sensorEvents}
                      color={sensorColors[type]}
                      unit={sensorUnits[type]}
                    />
                  )
                })}
              </div>
              <EventLog events={recentEvents} />
            </TabsContent>

            {sensorTypes.map((type) => (
              <TabsContent key={type} value={type} className="space-y-6">
                <SensorHistoryChart
                  title={`${type.charAt(0).toUpperCase() + type.slice(1)} History`}
                  data={collector.getEventsBySensor(type, 50)}
                  color={sensorColors[type]}
                  unit={sensorUnits[type]}
                />
                <EventLog events={collector.getEventsBySensor(type, 100)} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  )
}
