import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogOverlay
} from './ui/dialog'
import { Input } from './ui/input'


import { Button } from './ui/button'
import { useState } from 'react'

interface CreateAlertModalProps {
  open: boolean
  setOpen: (open: boolean) => void
}


function CreateAlertModal({ open, setOpen }: CreateAlertModalProps) {
  const [alertData, setAlertData] = useState({
    coinId: '',
    price: 0,
    condition: 'above'
  })
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Alert</DialogTitle>
              <DialogDescription>
                Set a price alert for your favorite cryptocurrencies.
              </DialogDescription>
            </DialogHeader>
            <DialogContent>
            <div>
              <form action="">
                  <Input
                    type="text"
                    placeholder="Coin ID"
                    value={alertData.coinId}
                    onChange={(e) => setAlertData({ ...alertData, coinId: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Price"
                    value={alertData.price}
                    onChange={(e) => setAlertData({ ...alertData, price: parseFloat(e.target.value) })}
                  />
                  <select
                    value={alertData.condition}
                    onChange={(e) => setAlertData({ ...alertData, condition: e.target.value })}
                  >
                    <option value="above">Above</option>
                    <option value="below">Below</option>
                  </select>
              </form>
            </div>
            </DialogContent>
            <DialogFooter>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={() => {}}>Create Alert</Button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  )
}

export default CreateAlertModal
