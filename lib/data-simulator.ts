import type { SensorEvent, SensorType } from "./types"

const SENSOR_TYPES: SensorType[] = ["temperature", "accelerometer", "pressure", "humidity"]
const DEVICE_COUNT = 50

export class DataSimulator {
  private deviceIds: string[]
  private isRunning = false
  private intervalId: NodeJS.Timeout | null = null

  constructor() {
    this.deviceIds = Array.from({ length: DEVICE_COUNT }, (_, i) => `device-${String(i + 1).padStart(3, "0")}`)
  }

  generateEvent(): SensorEvent {
    const deviceId = this.deviceIds[Math.floor(Math.random() * this.deviceIds.length)]
    const sensorType = SENSOR_TYPES[Math.floor(Math.random() * SENSOR_TYPES.length)]

    let value: number
    switch (sensorType) {
      case "temperature":
        value = 15 + Math.random() * 20 // 15-35°C
        break
      case "accelerometer":
        value = -10 + Math.random() * 20 // -10 to 10 m/s²
        break
      case "pressure":
        value = 980 + Math.random() * 60 // 980-1040 hPa
        break
      case "humidity":
        value = 30 + Math.random() * 50 // 30-80%
        break
    }

    return {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      deviceId,
      sensorType,
      value: Math.round(value * 100) / 100,
      timestamp: Date.now(),
    }
  }

  start(callback: (event: SensorEvent) => void, eventsPerSecond = 12) {
    if (this.isRunning) return

    this.isRunning = true
    const interval = 1000 / eventsPerSecond

    this.intervalId = setInterval(() => {
      const event = this.generateEvent()
      callback(event)
    }, interval)
  }

  burst(callback: (event: SensorEvent) => void, count = 100) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const event = this.generateEvent()
        callback(event)
      }, Math.random() * 1000)
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.isRunning = false
  }
}
