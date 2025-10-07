"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface TimeSeriesChartProps {
  title: string
  description?: string
  data: Array<{ timestamp: number; [key: string]: number }>
  dataKeys: Array<{ key: string; color: string; label: string }>
  yAxisLabel?: string
}

export function TimeSeriesChart({ title, description, data, dataKeys, yAxisLabel }: TimeSeriesChartProps) {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              {dataKeys.map((dk) => (
                <linearGradient key={dk.key} id={`gradient-${dk.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={dk.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={dk.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatTime}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} label={{ value: yAxisLabel }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              labelFormatter={(value) => formatTime(value as number)}
            />
            {dataKeys.map((dk) => (
              <Area
                key={dk.key}
                type="monotone"
                dataKey={dk.key}
                stroke={dk.color}
                strokeWidth={2}
                fill={`url(#gradient-${dk.key})`}
                name={dk.label}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
