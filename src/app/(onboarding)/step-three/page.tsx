"use client"
import { Button } from "@/components/Button"
import { Label } from "@/components/Label"
import { useBusinessType } from "@/features/registration/hooks/useBusinessType"
import { useStates } from "@/features/registration/hooks/useState"

import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import React, { useState } from "react"

const RegistrationDocuments = dynamic(
  () =>
    import("../../../features/registration/components/RegistrationDocuments"),
  {
    ssr: false,
  },
)

interface Category {
  id: string
  title: string
  subcategories: string[]
}

interface CheckedItems {
  [categoryId: string]: boolean
}

export default function Products() {
  const [checkedItems, setCheckedItems] = React.useState<CheckedItems>({})
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()
  const { states, isLoadingState } = useStates()
  const [step, setStep] = useState(1)
  const [taxExempt, setTaxExempt] = useState(false)
  const { businessTypes } = useBusinessType()
  const [businessType, setBusinessType] = useState("")

  const isAnyItemChecked = Object.values(checkedItems).some(Boolean)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      console.log("Form submitted:", checkedItems)
      router.push("/registration/step-foure")
    }, 400)
  }

  return (
    <main className="mx-auto p-3 pt-0">
      <form onSubmit={handleSubmit} className="mt-4" noValidate>
        <div>
          <h2 className="mb-2 text-lg font-semibold dark:text-gray-400">
            Company
          </h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <Label className="block text-sm font-medium text-gray-700">
                Void Check
              </Label>
              <RegistrationDocuments
                data={[]}
                onChangeDocuments={() => {
                  console.log("test")
                }}
              />
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700">
                MC and USDOT (optional)
              </Label>
              <RegistrationDocuments
                data={[]}
                onChangeDocuments={() => {
                  console.log("test")
                }}
              />
            </div>
          </div>
          <h2 className="mb-2 text-lg font-semibold dark:text-gray-400">
            Driver
          </h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <Label className="mb-1 block text-sm font-medium text-gray-700">
                Driver License
              </Label>
              <RegistrationDocuments
                data={[]}
                onChangeDocuments={() => {
                  console.log("test")
                }}
              />
            </div>

            <div>
              <Label className="mb-1 block text-sm font-medium text-gray-700">
                Driving Record
              </Label>
              <RegistrationDocuments
                data={[]}
                onChangeDocuments={() => {
                  console.log("test")
                }}
              />
            </div>
          </div>
          <h2 className="mb-2 text-lg font-semibold dark:text-gray-400">
            Vehicle
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <div>
              <Label className="mb-1 block text-sm font-medium text-gray-700">
                Insurance
              </Label>
              <RegistrationDocuments
                data={[]}
                onChangeDocuments={() => {
                  console.log("test")
                }}
              />
            </div>
            <div>
              <Label className="mb-1 block text-sm font-medium text-gray-700">
                Vehicle Registration
              </Label>
              <RegistrationDocuments
                data={[]}
                onChangeDocuments={() => {
                  console.log("test")
                }}
              />
            </div>
            <div>
              <Label className="mb-1 block text-sm font-medium text-gray-700">
                Green card & Passport
              </Label>
              <RegistrationDocuments
                data={[]}
                onChangeDocuments={() => {
                  console.log("test")
                }}
              />
            </div>
          </div>
          <h2 className="mb-2 text-lg font-semibold dark:text-gray-400">
            Upload your vehicle photos
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <div>
              <Label className="mb-1 block text-sm font-medium text-gray-700">
                Photo Left Side
              </Label>
              <RegistrationDocuments
                data={[]}
                onChangeDocuments={() => {
                  console.log("test")
                }}
              />
            </div>
            <div>
              <Label className="mb-1 block text-sm font-medium text-gray-700">
                Photo Right Side
              </Label>
              <RegistrationDocuments
                data={[]}
                onChangeDocuments={() => {
                  console.log("test")
                }}
              />
            </div>
            <div>
              <Label className="mb-1 block text-sm font-medium text-gray-700">
                Cargo space photo
              </Label>
              <RegistrationDocuments
                data={[]}
                onChangeDocuments={() => {
                  console.log("test")
                }}
              />
            </div>
          </div>
          <hr />
          <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <div>
              <Label className="mb-1 block text-sm font-medium text-gray-700">
                Extra attachments file
              </Label>
              <RegistrationDocuments
                data={[]}
                onChangeDocuments={() => {
                  console.log("test")
                }}
              />
            </div>
          </div>
        </div>

        <Button
          className="mt-4 w-full disabled:bg-gray-200 disabled:text-gray-500"
          type="submit"
          // disabled={!isAnyItemChecked || loading}
          aria-disabled={!isAnyItemChecked || loading}
          isLoading={loading}
        >
          {loading ? "Submitting..." : "Continue"}
        </Button>
      </form>
    </main>
  )
}
