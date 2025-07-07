import { useState } from "react"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { generateRandomCode } from "./utils/utils"
import { toast } from "sonner"
import client from "../api/client"
import { useAuth } from "../auth/tokenContext"

export function TelegramConnect() {
  const [code] = useState(generateRandomCode())
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState("")
  const { token } = useAuth()

  const handleVerify = async () => {
    if (!token) {
      toast.error("You must be logged in")
      return
    }

    setVerifying(true)
    try {
      const res = await client.post(`/auth/link-telegram?code=${code}`, {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        })

      if (res.status === 200) {
        toast.success("Telegram linked successfully!")
      } else {
        const data = await res.data
        toast.error(data.detail || "Verification failed")
        setError(data.detail || "Verification failed")
      }
    } catch (error: any) {
      toast.error("An error occurred")
      console.error(error)
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="space-y-4 border p-4 rounded-md bg-slate-50">
      <h2 className="text-lg font-semibold">Link Telegram</h2>
      <p>
        1. Open{" "}
        <a
          href="https://t.me/YOUR_BOT_USERNAME"
          className="text-blue-600 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Telegram Bot
        </a>
      </p>
      <p>2. Send this code to the bot:</p>
      <Input value={code} readOnly className="font-mono" />
      <Button onClick={handleVerify} disabled={verifying}>
        {verifying ? "Verifying..." : "I've sent the code"}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}
