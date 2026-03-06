"use client"
import { Button } from "@/components/Button"
import { Label } from "@/components/Label"
import SignaturePad from "@/components/SignaturePad"
import React from "react"



interface CheckedItems {
  [categoryId: string]: boolean
}

export default function Products() {
  const [checkedItems, setCheckedItems] = React.useState<CheckedItems>({})
  const [loading, setLoading] = React.useState(false)

  const isAnyItemChecked = Object.values(checkedItems).some(Boolean)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      console.log("Form submitted:", checkedItems)
      // router.push("/registration/employees")
    }, 400)
  }

  return (
    <main className="mx-auto p-3 pt-0">
      <form onSubmit={handleSubmit} className="mt-4" noValidate>
        <div>
          <Label
            required
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Read the documents and sign
          </Label>
          <SignaturePad />
        </div>
        <Button
          className="mt-4 w-full disabled:bg-gray-200 disabled:text-gray-500"
          type="submit"
          aria-disabled={!isAnyItemChecked || loading}
          isLoading={loading}
        >
          {loading ? "Submitting..." : "Continue"}
        </Button>
      </form>
    </main>
  )
}
