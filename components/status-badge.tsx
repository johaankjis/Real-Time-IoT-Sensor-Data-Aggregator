import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "healthy" | "degraded" | "critical" | "online" | "offline"
  label?: string
  showDot?: boolean
}

export function StatusBadge({ status, label, showDot = true }: StatusBadgeProps) {
  const statusConfig = {
    healthy: { color: "bg-success text-success", label: label || "Healthy" },
    degraded: { color: "bg-warning text-warning", label: label || "Degraded" },
    critical: { color: "bg-destructive text-destructive", label: label || "Critical" },
    online: { color: "bg-success text-success", label: label || "Online" },
    offline: { color: "bg-muted-foreground text-muted-foreground", label: label || "Offline" },
  }

  const config = statusConfig[status]

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium">
      {showDot && <div className={cn("h-2 w-2 rounded-full animate-pulse", config.color.split(" ")[0])} />}
      <span className="text-foreground">{config.label}</span>
    </div>
  )
}
