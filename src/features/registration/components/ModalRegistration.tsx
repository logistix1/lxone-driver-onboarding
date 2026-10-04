"use client"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/Dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Button } from "@/components/Button"

export type ModalAddUserProps = {
  children: React.ReactNode
}

export function ModalRegistration({ children }: ModalAddUserProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div onClick={() => setOpen(true)}>{children}</div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl p-6">
        {/* Accessibility uchun title */}
        <DialogTitle>
          <VisuallyHidden>Contract Requirements</VisuallyHidden>
        </DialogTitle>

        <h2 className="text-2xl font-bold mb-4">
          To finish the contract request make sure you have following documents.
        </h2>

        <ul className="list-disc space-y-3 text-gray-800 font-medium ml-2 pl-2" style={{listStyleType:"disc"}}>
          <li>Driving license</li>
          <li>Vehicle registration</li>
          <li>Voided check</li>
          <li>Driving record</li>
          <li>D3 pictures of your truck</li>
          <li>Insurance certificate</li>
        </ul>

        <h3 className=" mt-6 mb-2 text-2xl font-bold">
          Insurance requirements
        </h3>

        <ul className="list-disc  space-y-3 text-gray-800 font-medium ml-2 pl-2" style={{listStyleType:"disc"}}>
          <li>$1,000,000 Primary Liability Commercial Auto CSL</li>
          <li>$100,000 Broad Form Cargo with $1,000 deductible max.</li>
          <li>Unlimited Radius of Operations</li>
          <li>
            Certificates must also show listed Vehicles (Year, Make, VIN#) as
            well as all listed drivers.
          </li>
          <li>
            Shall be listed as additional insured and certificate holder
          </li>
        </ul>

        <div className="mt-6 flex justify-center">
          <DialogClose asChild>
            <Button variant="destructive" className="px-8 w-full">
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
