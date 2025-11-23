import { useAuth } from "../auth/tokenContext"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { useState } from "react"

import {
  Flame,
  Gauge,
  Newspaper,
  Signal,
} from "lucide-react"
import CreateAlertModal from "../components/CreateAlertModal"

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
  const [createAlertOpen, setCreateAlertOpen] = useState(false)
  const { user } = useAuth()
  // const navigate = useNavigate()
  // const [search, setSearch] = useState("")

  // const handleLogout = () => {
  //   logout()
  //   navigate("/")
  // }

  const kpiData = [
    {
      icon: <Flame className="text-red-500 w-[56px] h-[56px]" />,
      value: 5,
      label: "Active Alerts",
    },
    {
      icon: <Gauge className="text-blue-500 w-[56px] h-[56px]" />,
      value: 3,
      label: "Total Exchanges",
    },
    {
      icon: <Signal className="text-green-500 w-[56px] h-[56px]" />,
      value: 2,
      label: "Triggered Today",
    },
    {
      icon: <Newspaper className="text-yellow-500 w-[56px] h-[56px]" />,
      value: 4,
      label: "News Alerts",
    },
  ]

  return (
    <main className="flex flex-col flex-grow p-6 md:p-10">
      <h2 className="text-2xl font-semibold mb-4">
        Hi {user?.email.split("@")[0] || "there"} 👋
      </h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {kpiData.map((item, i) => (
          <Card key={i} className="min-h-[120px] flex flex-row items-center justify-center py-6 px-4 text-center shadow-sm">
            <div className="mb-2">{item.icon}</div>
            <h3 className="text-5xl font-bold text-gray-800">{item.value}</h3>
            <p className="text-sm text-gray-500">{item.label}</p>
          </Card>
        ))}
      </div>

      {/* Alerts Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-grow">
        <Card className="col-span-12 md:col-span-9 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">📈 Price Alerts</h3>
            <Button size="sm" onClick={() => setCreateAlertOpen(true)}>+ Add Alert</Button>
            
          </div>
          <CreateAlertModal open={createAlertOpen} setOpen={setCreateAlertOpen} />
          <div className="overflow-auto rounded-lg border border-gray-200">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 font-semibold text-xs md:text-sm">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Exchange</th>
                  <th className="px-4 py-3">Condition</th>
                  <th className="px-4 py-3">Trigger Range</th>
                  <th className="px-4 py-3">Current Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Last Triggered</th>
                  <th className="px-4 py-3">Note</th>
                  <th className="px-4 py-3">Notify</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {tempAlerts.map((alert, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {alert.name}
                      <span className="text-gray-500 text-xs"> ({alert.symbol})</span>
                    </td>
                    <td className="px-4 py-3">{alert.exchange}</td>
                    <td className="px-4 py-3 capitalize">{alert.condition}</td>
                    <td className="px-4 py-3">
                      ${alert.lower_trigger.toLocaleString()} – ${alert.upper_trigger.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">${alert.current_price.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${alert.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-500"
                        }`}>
                        {alert.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {new Date(alert.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {alert.last_triggered
                        ? new Date(alert.last_triggered).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs italic text-gray-600 max-w-[160px] truncate">
                      {alert.note || "—"}
                    </td>
                    <td className="px-4 py-3 text-xs space-x-1">
                      {alert.notify_email && <span title="Email" className="text-blue-600">📧</span>}
                      {alert.notify_popup && <span title="Popup" className="text-yellow-600">🔔</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* News Section */}
        <Card className="col-span-12 md:col-span-3 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">📰 News Alerts</h3>
            <Button size="sm">+ Add Alert</Button>
          </div>
          <div className="text-sm text-gray-500 italic">
            No recent news alerts. Add new alert to stay informed.
          </div>
        </Card>
      </div>
    </main>
  )
}
