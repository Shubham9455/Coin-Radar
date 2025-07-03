import { useAuth } from "../auth/tokenContext"
import { Button } from "../components/ui/button"
import { useNavigate } from "react-router-dom"
import { Card } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { useState } from "react"
import {
  BadgeCheck,
  BellPlus,
  Bookmark,
  Clock3,
  Newspaper,
  Save,
  SaveIcon,
  Star,
} from "lucide-react"



const tempAlerts = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    condition: 'Price crosses upper limit',
    upper_trigger: 101000,
    lower_trigger: 90000,
    current_price: 98000,
    last_triggered: '2025-07-01T13:20:00Z',
    created_at: '2025-06-28T09:45:00Z',
    is_active: true,
    notify_email: true,
    notify_popup: true,
    exchange: 'Binance',
    note: 'Breakout expected after CPI report',
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    condition: 'Price drops below lower limit',
    upper_trigger: 3700,
    lower_trigger: 3300,
    current_price: 3450,
    last_triggered: null,
    created_at: '2025-07-02T11:00:00Z',
    is_active: false,
    notify_email: false,
    notify_popup: true,
    exchange: 'Coinbase',
    note: '',
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    condition: 'Price crosses upper limit',
    upper_trigger: 170,
    lower_trigger: 140,
    current_price: 172,
    last_triggered: '2025-07-03T08:15:00Z',
    created_at: '2025-06-29T18:00:00Z',
    is_active: true,
    notify_email: true,
    notify_popup: false,
    exchange: 'Kraken',
    note: 'Watch for pump before listing',
  },
]

export default function Dashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState("")

  const handleLogout = () => {
    logout()
    navigate("/")
  }



  return (
    <main className="flex flex-col flex-grow min-h-0 p-6">
      {/* Welcome Card */}
      <Card className="w-full p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-2">Welcome to CoinRadar</h2>
        <p className="text-muted-foreground">
          Track your favorite cryptocurrencies and get notified with alerts.
        </p>
      </Card>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 flex-grow min-h-0">

        {/* Alerts */}
        <Card className="col-span-5 md:col-span-5 flex flex-col p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Price Alerts</h3>
            <Button size="sm">+ Add Alert</Button>
          </div>
          <div className="flex-grow overflow-auto space-y-4">
            {tempAlerts.map((alert, index) => (
              <Card key={index} className="p-4 border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-lg font-semibold text-gray-800">
                    {alert.name} ({alert.symbol})
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={alert.is_active}
                      readOnly
                      className="accent-green-600 h-4 w-4"
                      title={alert.is_active ? "Active" : "Inactive"}
                    />
                    <span className={`text-xs font-medium ${alert.is_active ? "text-green-700" : "text-gray-400"}`}>
                      {alert.is_active ? "Active" : "Inactive"}
                    </span>
                  </label>
                </div>

                <div className="text-sm text-gray-600 mb-1">
                  <strong>Exchange:</strong> {alert.exchange}
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  <strong>Condition:</strong> {alert.condition}
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  <strong>Current Price:</strong> ${alert.current_price.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  <strong>Trigger Range:</strong> ${alert.lower_trigger.toLocaleString()} – ${alert.upper_trigger.toLocaleString()}
                </div>
                {alert.last_triggered && (
                  <div className="text-sm text-gray-600 mb-1">
                    <strong>Last Triggered:</strong> {new Date(alert.last_triggered).toLocaleString()}
                  </div>
                )}
                <div className="text-sm text-gray-600 mb-1">
                  <strong>Created:</strong> {new Date(alert.created_at).toLocaleDateString()}
                </div>
                {alert.note && (
                  <div className="text-sm italic text-gray-500 mb-2">
                    “{alert.note}”
                  </div>
                )}
                <div className="flex gap-2">
                  {alert.notify_email && (
                    <span className="text-xs text-blue-600">📧 Email</span>
                  )}
                  {alert.notify_popup && (
                    <span className="text-xs text-amber-600">🔔 Popup</span>
                  )}
                </div>
              </Card>
            ))}
          </div>

        </Card>
      </div>
    </main>
  )
}
