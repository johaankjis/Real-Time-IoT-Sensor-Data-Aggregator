"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { SensorEvent } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

interface EventLogProps {
  events: SensorEvent[]
  maxHeight?: number
}

export function EventLog({ events, maxHeight = 400 }: EventLogProps) {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  const getSensorColor = (type: string) => {
    const colors: Record<string, string> = {
      temperature: "bg-chart-3/20 text-chart-3 border-chart-3/50",
      accelerometer: "bg-chart-1/20 text-chart-1 border-chart-1/50",
      pressure: "bg-chart-5/20 text-chart-5 border-chart-5/50",
      humidity: "bg-chart-2/20 text-chart-2 border-chart-2/50",
    }
    return colors[type] || "bg-muted text-muted-foreground"
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-base">Event Stream</CardTitle>
        <CardDescription>Real-time sensor events</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="pr-4" style={{ height: maxHeight }}>
          <div className="space-y-2">
            {events.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                No events yet. Start the simulator to see data.
              </div>
            ) : (
              events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={getSensorColor(event.sensorType)}>
                      {event.sensorType}
                    </Badge>
                    <span className="font-mono text-muted-foreground">{event.deviceId}</span>
                    <span className="font-semibold">{event.value.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    {event.ingestLatency && <span>{event.ingestLatency}ms</span>}
                    <span>{formatTime(event.timestamp)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
