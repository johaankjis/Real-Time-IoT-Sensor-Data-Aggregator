"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import type { SensorEvent } from "@/lib/types"

interface SensorHistoryChartProps {
  title: string
  data: SensorEvent[]
  color: string
  unit: string
}

export function SensorHistoryChart({ title, data, color, unit }: SensorHistoryChartProps) {
  const chartData = data.map((event) => ({
    timestamp: event.timestamp,
    value: event.value,
  }))

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>Last {data.length} readings</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatTime}
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickLine={false}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} unit={unit} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelFormatter={(value) => formatTime(value as number)}
              formatter={(value: number) => [`${value.toFixed(2)} ${unit}`, "Value"]}
            />
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
