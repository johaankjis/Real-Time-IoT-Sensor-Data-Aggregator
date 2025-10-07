"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Thermometer, Gauge, Droplets, Activity } from "lucide-react"
import type { SensorType } from "@/lib/types"
import { cn } from "@/lib/utils"

interface SensorCardProps {
  sensorType: SensorType
  value: number
  deviceId: string
  timestamp: number
  status?: "normal" | "warning" | "critical"
}

const sensorConfig = {
  temperature: {
    icon: Thermometer,
    label: "Temperature",
    unit: "°C",
    color: "text-chart-3",
    getStatus: (value: number) => {
      if (value < 18 || value > 32) return "critical"
      if (value < 20 || value > 30) return "warning"
      return "normal"
    },
  },
  accelerometer: {
    icon: Activity,
    label: "Accelerometer",
    unit: "m/s²",
    color: "text-chart-1",
    getStatus: (value: number) => {
      if (Math.abs(value) > 8) return "critical"
      if (Math.abs(value) > 5) return "warning"
      return "normal"
    },
  },
  pressure: {
    icon: Gauge,
    label: "Pressure",
    unit: "hPa",
    color: "text-chart-5",
    getStatus: (value: number) => {
      if (value < 990 || value > 1030) return "critical"
      if (value < 1000 || value > 1020) return "warning"
      return "normal"
    },
  },
  humidity: {
    icon: Droplets,
    label: "Humidity",
    unit: "%",
    color: "text-chart-2",
    getStatus: (value: number) => {
      if (value < 35 || value > 75) return "critical"
      if (value < 40 || value > 70) return "warning"
      return "normal"
    },
  },
}

export function SensorCard({ sensorType, value, deviceId, timestamp, status }: SensorCardProps) {
  const config = sensorConfig[sensorType]
  const Icon = config.icon
  const computedStatus = status || config.getStatus(value)

  const statusColors = {
    normal: "border-success/50 bg-success/5",
    warning: "border-warning/50 bg-warning/5",
    critical: "border-destructive/50 bg-destructive/5",
  }

  const timeAgo = Math.floor((Date.now() - timestamp) / 1000)
  const timeDisplay = timeAgo < 60 ? `${timeAgo}s ago` : `${Math.floor(timeAgo / 60)}m ago`

  return (
    <Card className={cn("border-2 transition-colors", statusColors[computedStatus])}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{config.label}</CardTitle>
          <Icon className={cn("h-4 w-4", config.color)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className={cn("text-2xl font-bold", config.color)}>{value.toFixed(2)}</span>
            <span className="text-sm text-muted-foreground">{config.unit}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-mono">{deviceId}</span>
            <span>{timeDisplay}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
