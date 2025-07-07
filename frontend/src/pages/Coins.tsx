import React, { useEffect, useState } from 'react'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { BellPlus, Newspaper, Bookmark } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
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


type FilterType = {
  minMarketCap?: number | null
  maxMarketCap?: number | null
  minPriceChange?: number | null
  maxPriceChange?: number | null
  minVol24H?: number | null
  maxVol24H?: number | null
  minVolChange24H?: number | null
  maxVolChange24H?: number | null
  topXbyMarketCap?: 'top20' | 'top50' | 'top100' | null
}

function Coins() {
  const [coins, setCoins] = useState<Coin[]>([])
  const [numResults, setNumResults] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [source, setSource] = useState('')
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<FilterType>({})
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>([])

  const totalPages = Math.ceil(filteredCoins.length / numResults)
  const paginatedCoins = filteredCoins.slice(
    (currentPage - 1) * numResults,
    currentPage * numResults
  )

  useEffect(() => {
    const filtered = coins.filter((coin) => {
      const nameMatch =
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())

      const withinTopX = filters.topXbyMarketCap
        ? coin.market_cap_rank <= parseInt(filters.topXbyMarketCap.replace('top', ''))
        : true

      return (
        nameMatch &&
        withinTopX &&
        (filters.minMarketCap === undefined || coin.total_volume >= (filters.minMarketCap || 0)) &&
        (filters.maxMarketCap === undefined || coin.total_volume <= (filters.maxMarketCap || Infinity)) &&
        (filters.minPriceChange === undefined || coin.price_change_percentage_24h >= (filters.minPriceChange || -Infinity)) &&
        (filters.maxPriceChange === undefined || coin.price_change_percentage_24h <= (filters.maxPriceChange || Infinity)) &&
        (filters.minVol24H === undefined || coin.total_volume >= (filters.minVol24H || 0)) &&
        (filters.maxVol24H === undefined || coin.total_volume <= (filters.maxVol24H || Infinity))
      )
    })
    setFilteredCoins(filtered)
    setCurrentPage(1) // Reset to first page when filters/search change
  }, [coins, search, filters])

  const fetchData = async () => {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`
    )
    const data = await response.json()
    console.log('Fetched coins:', data)
    setCoins(data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>
      <Card className="flex flex-col p-4">
        <h3 className="text-lg font-semibold mb-2">Source</h3>
        <Select value={source} onValueChange={setSource} disabled>
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

        <div className="flex flex-wrap items-center justify-between mt-6 gap-4">
          <h3 className="text-xl font-semibold">Live Coins</h3>
          <div className="flex gap-2 items-center flex-wrap">
            <Select
              value={numResults.toString()}
              onValueChange={(value) => setNumResults(parseInt(value))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Results" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Input
              className="max-w-xs"
              placeholder="Search coin..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-slate-100 text-gray-700 font-semibold">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">24h Change</th>
                <th className="px-4 py-3">High / Low (24H)</th>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Volume</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginatedCoins.map((coin) => (
                <tr key={coin.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 font-medium">
                    {coin.name}{' '}
                    <span className="text-gray-500">({coin.symbol.toUpperCase()})</span>
                  </td>
                  <td className="px-4 py-3">${coin.current_price.toLocaleString()}</td>
                  <td
                    className={`px-4 py-3 ${coin.price_change_percentage_24h >= 0
                        ? 'text-green-600'
                        : 'text-red-500'
                      }`}
                  >
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    <div>High: ${coin.high_24h.toLocaleString()}</div>
                    <div>Low: ${coin.low_24h.toLocaleString()}</div>
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
                    <Button size="icon" variant="secondary" title="Watchlist">
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

          {filteredCoins.length > 0 && (
            <div className="flex flex-col md:flex-row items-center justify-between mt-4 px-4">
              <p className="text-sm text-gray-500 mb-2 md:mb-0">
                Showing {(currentPage - 1) * numResults + 1} –{' '}
                {Math.min(currentPage * numResults, filteredCoins.length)} of{' '}
                {filteredCoins.length}
              </p>
              <div className="flex items-center gap-2 flex-wrap justify-center md:justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  ← Prev
                </Button>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <Button
                    key={idx}
                    variant={currentPage === idx + 1 ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(idx + 1)}
                    className="w-8 p-0"
                  >
                    {idx + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next →
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default Coins
