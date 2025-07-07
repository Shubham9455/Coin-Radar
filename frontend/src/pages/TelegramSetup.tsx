// TelegramConnect.tsx
import { useState } from "react"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { generateRandomCode } from "./utils/utils"

export function TelegramConnect() {
  const [code] = useState(generateRandomCode())
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState("")

  const handleVerify = async () => {
    setVerifying(true)
    const res = await fetch("/api/telegram/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })

    const data = await res.json()
    if (res.ok) {
      // onLinked()
    } else {
      setError(data.detail || "Verification failed")
    }
    setVerifying(false)
  }

  return (
    <div className="space-y-4 border p-4 rounded-md bg-slate-50">
      <h2 className="text-lg font-semibold">Link Telegram</h2>
      <p>1. Open <a href="https://t.me/YOUR_BOT_USERNAME" className="text-blue-600 underline">Telegram Bot</a></p>
      <p>2. Send this code to the bot:</p>
      <Input value={code} readOnly className="font-mono" />
      <Button onClick={handleVerify} disabled={verifying}>
        {verifying ? "Verifying..." : "I've sent the code"}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}
