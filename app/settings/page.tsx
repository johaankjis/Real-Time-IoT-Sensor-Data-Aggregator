"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <main className="ml-64 flex-1">
        <div className="border-b border-border bg-background">
          <div className="flex h-16 items-center px-8">
            <div>
              <h1 className="text-2xl font-semibold">Settings</h1>
              <p className="text-sm text-muted-foreground">Configure system parameters</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Data Ingestion</CardTitle>
                <CardDescription>Configure data collection parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="throughput">Target Throughput (events/sec)</Label>
                  <Input id="throughput" type="number" defaultValue="12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batch-size">Batch Size</Label>
                  <Input id="batch-size" type="number" defaultValue="100" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-scaling">Enable Auto-scaling</Label>
                  <Switch id="auto-scaling" defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Alerting</CardTitle>
                <CardDescription>Configure alert thresholds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="latency-threshold">P95 Latency Threshold (ms)</Label>
                  <Input id="latency-threshold" type="number" defaultValue="200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availability-threshold">Availability Target (%)</Label>
                  <Input id="availability-threshold" type="number" defaultValue="99" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-alerts">Email Alerts</Label>
                  <Switch id="email-alerts" defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Storage</CardTitle>
                <CardDescription>Database and retention settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="retention">Data Retention (days)</Label>
                  <Input id="retention" type="number" defaultValue="30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="archive">Archive to S3 after (days)</Label>
                  <Input id="archive" type="number" defaultValue="7" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="compression">Enable Compression</Label>
                  <Switch id="compression" defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Monitoring</CardTitle>
                <CardDescription>Observability configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metrics-interval">Metrics Collection Interval (sec)</Label>
                  <Input id="metrics-interval" type="number" defaultValue="1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="history-size">History Buffer Size</Label>
                  <Input id="history-size" type="number" defaultValue="1000" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="debug-mode">Debug Mode</Label>
                  <Switch id="debug-mode" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline">Reset to Defaults</Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </main>
    </div>
  )
}
