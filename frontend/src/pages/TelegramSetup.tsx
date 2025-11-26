import { useState } from "react"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { generateRandomCode } from "./utils/utils"
import { toast } from "sonner"
import client from "../api/client"
import { useAuth } from "../auth/tokenContext"
import { CopyIcon } from "lucide-react"
import { Card } from "../components/ui/card"

export function TelegramConnect() {
  const [code] = useState(generateRandomCode())
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState("")
  const { token, user, validateToken } = useAuth()

  const handleVerify = async () => {
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
        validateToken() // Refresh user data after linking
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
  const handleUnlink = async () => {
    try {
      const res = await client.post(`/auth/unlink-telegram`, {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        })
      if (res.status === 200) {
        toast.success("Telegram unlinked successfully!")
        validateToken() // Refresh user data after unlinking
      } else {
        const data = await res.data
        toast.error(data.detail || "Unlinking failed")
        setError(data.detail || "Unlinking failed")
      }
    } catch (error: any) {
      toast.error("An error occurred while unlinking")
      console.error(error)
    }
  }


  return (
    <>
      <Card className="my-8 mx-12 space-y-4 border p-4 rounded-md bg-slate-50">
        {user?.telegram_linked && (
          <div className="flex-col">
            <p className="text-green-600">
              You have already linked your Telegram account.
            </p>
            <p className="text-sm text-muted-foreground">
              If you want to unlink it, click the button below.
            </p>
            <Button
              onClick={handleUnlink}
              className="mt-2"
            >
              Unlink Telegram
            </Button>
          </div>
        )}
        {!user?.telegram_linked && (
          <>
            <h2 className="text-lg font-semibold">Link Telegram</h2>
            <p className="text-sm text-muted-foreground">
              To link your Telegram account, please follow these steps:
            </p>
            <p>
              1. Open{" "}
              <a
                href="https://t.me/coinradar1155_bot"
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Telegram Bot
              </a>
            </p>
            <p>2. Send this code to the bot:</p>
            <div className="flex max-w-[360px]" >
              <Input value={code} readOnly className="font-mono" />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(code)
                  toast.success("Code copied to clipboard")
                }}
                className="ml-2 cursor-pointer"
              >
                <CopyIcon className="w-4 h-4" />
              </Button>
            </div>
            <Button onClick={handleVerify} disabled={verifying}>
              {verifying ? "Verifying..." : "I've sent the code"}
            </Button>
            {error && <p className="text-red-500">{error}</p>}
          </>
        )}
      </Card>
      <Card className="my-8 mx-12 flex-grow">
        
      </Card>
    </>
  )
}
