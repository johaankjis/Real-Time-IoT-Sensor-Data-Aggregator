"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUp, ArrowDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string | number
  unit?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  description?: string
  status?: "success" | "warning" | "error" | "info"
}

export function MetricCard({ title, value, unit, trend, trendValue, description, status }: MetricCardProps) {
  const TrendIcon = trend === "up" ? ArrowUp : trend === "down" ? ArrowDown : Minus

  const statusColors = {
    success: "text-success",
    warning: "text-warning",
    error: "text-destructive",
    info: "text-info",
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className={cn("text-3xl font-bold", status && statusColors[status])}>{value}</span>
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
        {(trend || description) && (
          <div className="mt-2 flex items-center gap-2 text-xs">
            {trend && trendValue && (
              <div
                className={cn(
                  "flex items-center gap-1",
                  trend === "up" && "text-success",
                  trend === "down" && "text-destructive",
                  trend === "neutral" && "text-muted-foreground",
                )}
              >
                <TrendIcon className="h-3 w-3" />
                <span>{trendValue}</span>
              </div>
            )}
            {description && <span className="text-muted-foreground">{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
