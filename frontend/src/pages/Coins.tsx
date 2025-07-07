import React from 'react'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { BellPlus, Newspaper, Bookmark } from 'lucide-react'
import { useState } from 'react'
import { 
Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue
} from '../components/ui/select'
type Coin = {
  id: string
  name: string
  symbol: string
  current_price: number
  price_change_percentage_24h: number
  high_24h: number
  low_24h: number
  market_cap_rank: number
  total_volume: number
}

const dummyCoinData: Coin[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    current_price: 67000,
    price_change_percentage_24h: 2.5,
    high_24h: 68000,
    low_24h: 66000,
    market_cap_rank: 1,
    total_volume: 35000000000,
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    current_price: 3500,
    price_change_percentage_24h: -1.2,
    high_24h: 3600,
    low_24h: 3400,
    market_cap_rank: 2,
    total_volume: 18000000000,
  },
  // Add more dummy coins as needed
]


type FilterType = {
  minMarketCap?: number | null
  maxMarketCap?: number | null
  minPriceChange?: number | null
  maxPriceChange?: number | null
  minVol24H?: number | null
  maxVol24H?: number | null
  minVolChange24H?: number | null
  maxVolChange24H?: number | null
  topXbyMarketCap?: "top20" | "top50" | "top100" | null
}

function Coins() {
  const [source, setSource] = useState('')
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<FilterType>({})
  const [customFilterScript, setCustomFilterScript] = useState('');

  // validate the custom filter script
  // TODO: Implement validation logic
  // script can use only provided filter variables
  // and should only contain +-*/()^ '>=' '<=' '>' '<' '==' '!='
  const validateScript = (script: string): boolean => {
    const allowedChars = /^[\d\s+\-*/().<>=!&|a-zA-Z_]+$/
    return allowedChars.test(script)
  }



  const filteredCoins = dummyCoinData.filter(coin => {
    const nameMatch =
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())

    // Example: Market cap rank filter
    const withinTopX = filters.topXbyMarketCap
      ? coin.market_cap_rank <= parseInt(filters.topXbyMarketCap.replace('top', ''))
      : true

    return nameMatch && withinTopX
  })

  // Future API fetch (not implemented yet)
  const fetchData = async () => {
    // const response = await fetch(`/api/coins?source=${source}`)
    // const data = await response.json()
    // ...
  }

  return (
    <div>
      <Card className="col-span-5 md:col-span-4 flex flex-col p-4">
        <h3>Source</h3>
        <Select
          value={source}
          onValueChange={setSource}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Data Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="coingecko">CoinGecko</SelectItem>
              <SelectItem value="coinmarketcap">CoinMarketCap</SelectItem>
              <SelectItem value="binance">Binance (Live Prices)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Live Coins</h3>
          <Input
            className="max-w-xs"
            placeholder="Search coin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex-grow overflow-auto">
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-slate-100 text-gray-700 font-semibold">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">24h Change</th>
                  <th className="px-4 py-3">High / Low</th>
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Volume</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">

                {filteredCoins.map((coin) => (
                  <tr key={coin.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-medium">
                      {coin.name} <span className="text-gray-500">({coin.symbol})</span>
                    </td>
                    <td className="px-4 py-3">${coin.current_price.toLocaleString()}</td>
                    <td
                      className={`px-4 py-3 ${coin.price_change_percentage_24h >= 0
                        ? "text-green-600"
                        : "text-red-500"
                        }`}
                    >
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3">
                      <span className="block text-xs text-gray-500">High: ${coin.high_24h.toLocaleString()}</span>
                      <span className="block text-xs text-gray-500">Low: ${coin.low_24h.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3 text-center">{coin.market_cap_rank}</td>
                    <td className="px-4 py-3">${Math.floor(coin.total_volume / 1e6)}M</td>
                    <td className="px-4 py-3 flex gap-2 justify-center flex-wrap">
                      <Button size="icon" variant="default" title="Add Alert">
                        <BellPlus className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline" title="News">
                        <Newspaper className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="secondary" title="Add to Watchlist">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCoins.length === 0 && (
              <div className="text-center text-gray-500 py-4">No coins match your filter</div>
            )}
          </div>
        </div>

      </Card>
    </div>
  )
}

export default Coins
