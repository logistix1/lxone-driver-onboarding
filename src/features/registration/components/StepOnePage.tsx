"use client"
import { Button } from "@/components/Button"
import { Checkbox } from "@/components/Checkbox"
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import MaskedInput from "@/components/MaskedInput"
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select"
import { LIMITED_LIABILITY } from "@/constants/constants"
import { useRegistration } from "@/context/RegisterationContext"
import { ModalRegistration } from "@/features/registration/components/ModalRegistration"
import ZipCodeSelect from "@/features/registration/components/ZipCodeSelect"
import { useBusinessType } from "@/features/registration/hooks/useBusinessType"
import { useStates } from "@/features/registration/hooks/useState"
import { Select } from "@radix-ui/react-select"
import { InfoIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import DatePicker from "react-datepicker"
import dayjs from "dayjs"

interface CheckedItems {
  [categoryId: string]: boolean
}

const PRIVACY_POLICY_URL = "https://www.logistix.one/privacy-policy"

export default function StepOnePage({token}:{token:string}) {
  const [checkedItems] = React.useState<CheckedItems>({})
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()
  const { states, isLoadingState } = useStates()
  const [taxExempt, setTaxExempt] = useState(false)
  const { businessTypes } = useBusinessType()
  const isAnyItemChecked = Object.values(checkedItems).some(Boolean)
  const { data, updateData } = useRegistration()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      router.push(`/step-two?token=${token}`)
    }, 400)
  }

  const openPrivacyPolicyPopup = () => {
    const popup = window.open(
      PRIVACY_POLICY_URL,
      "lx1-privacy-policy",
      "popup=yes,width=980,height=760,resizable=yes,scrollbars=yes",
    )

    if (popup) {
      popup.focus()
      return
    }

    window.open(PRIVACY_POLICY_URL, "_blank", "noopener,noreferrer")
  }

  return (
    <main className="mx-auto p-3 pt-20">
      <form onSubmit={handleSubmit} className="w-full" noValidate>
        <div>
          <h2 className="mb-4 flex flex-wrap items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            <InfoIcon className="size-5 shrink-0 text-blue-500" />
            <span>Registration conditions,</span>
            <ModalRegistration>
              <span className="cursor-pointer font-semibold text-blue-600 underline underline-offset-2">
                click here
              </span>
            </ModalRegistration>
          </h2>
          <h2 className="mb-4 text-lg font-semibold dark:text-gray-400">
            Company info
          </h2>
          <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <Label
                className="mb-1 block text-sm font-medium text-gray-700"
                required
                // className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Company name
              </Label>
              <Input
                value={data.company_name}
                onChange={(e) => {
                  updateData({ company_name: e.target.value })
                }}
                required
                type="text"
                placeholder="Company name"
              />
            </div>
            <div>
              <Label
                required
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Phone number
              </Label>
              <MaskedInput
                value={data.company_phone}
                mask="+1 (000) 000-0000"
                placeholder="+1 (123) 456-7890"
                required
                onChange={(value) =>
                  updateData({
                    company_phone: value,
                  })
                }
              />
            </div>
            <div>
              <Label
                required
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Company birth date
              </Label>
              <DatePicker
                locale="en-GB"
                wrapperClassName="w-full"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-normal shadow-sm outline-none focus:border-blue-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/40"
                calendarClassName="rounded-xl shadow-lg text-sm bg-white dark:bg-gray-900 dark:text-gray-100"
                selected={
                  data.company_birth_date
                    ? dayjs(data.company_birth_date).toDate()
                    : null
                }
                onChange={(date) => {
                  if (date) {
                    updateData({
                      company_birth_date: dayjs(date).format("YYYY-MM-DD"),
                    })
                  }
                }}
                dateFormat="MMMM d, yyyy"
                placeholderText="Select date"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mt-5">
            <div>
              <Label
                required
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Doing business as:
              </Label>
              <Input
                value={data.title}
                onChange={(e) => updateData({ title: e.target.value })}
                required
                type="text"
                placeholder="Business name"
              />
            </div>

            {/* Employer ID */}
            <div>
              <Label className="mb-1 block text-sm font-medium text-gray-700">
                Employer ID number
              </Label>
              <MaskedInput
                value={data.employee_id}
                onChange={(e) =>
                  updateData({
                    employee_id: e,
                  })
                }
                mask="00-0000000"
                placeholder="xx-xxxxxxx"
                required
              />
            </div>

            <div className="relative">
              <Label
                required
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Business type
              </Label>
              <Select
                required
                value={data.business_type?data.business_type.toString():undefined}
                onValueChange={(e: string) =>
                  updateData({
                    business_type: e as unknown as string,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Business Type" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes?.map(
                    (option: { id: number; label: string }) => (
                      <SelectItem key={option.id} value={option.id.toString()}>
                        {option.label}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* ZIP Code */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <Label
                  required
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  ZIP code
                </Label>
                <ZipCodeSelect
                  value={data.zip_code}
                  onSelect={(item) => {
                    updateData({
                      state: item.state,
                      zip_code: item.zip,
                      city: item.city,
                    })
                  }}
                />
              </div>

              {/* State */}
              <div className="relative">
                <Label
                  required
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  State
                </Label>
                <Select
                  required
                  value={data.state}
                  onValueChange={(e: string) =>
                    updateData({
                      state: e,
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {isLoadingState ? (
                      <div className="p-2 text-center text-gray-500">
                        Loading...
                      </div>
                    ) : (
                      states?.results?.map(
                        (option: {
                          id: number
                          short_name: string
                          name: string
                        }) => (
                          <SelectItem key={option.id} value={option.name}>
                            {option.name}
                          </SelectItem>
                        ),
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-1">
            {data.business_type == "6" && (
              <div className="mb-4">
                <Label
                  className="mb-1 block text-sm font-medium text-gray-700"
                  required
                >
                  Limited Liability Company
                </Label>

                <Select
                  value={data.limited_liability||""}
                  onValueChange={(value) =>
                    updateData({
                      limited_liability: value,
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Liability Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {LIMITED_LIABILITY?.map(
                      (option: { value: string; label: string }) => (
                        <SelectItem key={option.label} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
            {data.business_type == "7" && (
              <div className="mb-4">
                <Label
                  className="mb-1 block text-sm font-medium text-gray-700"
                  required
                >
                  Other
                </Label>
                <Input
                  name="other_business_type"
                  placeholder="Other"
                  value={data.other_business_type||""}
                  onChange={(e) =>
                    updateData({
                      other_business_type: e.target.value,
                    })
                  }
                />
              </div>
            )}
          </div>
          <div className="mt-0 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* City */}
            <div>
              <Label
                required
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                City
              </Label>
              <Input
                value={data.city}
                onChange={(e) =>
                  updateData({
                    city: e.target.value,
                  })
                }
                required
                type="text"
                placeholder="City"
              />
            </div>

            {/* Address */}
            <div>
              <Label
                required
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Address
              </Label>
              <Input
                value={data.address}
                onChange={(e) =>
                  updateData({
                    address: e.target.value,
                  })
                }
                required
                type="text"
                placeholder="Address"
              />
            </div>

            {/* First Name */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <Label
                  required
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  First name
                </Label>
                <Input
                  value={data.owner_first_name}
                  onChange={(e) =>
                    updateData({
                      owner_first_name: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="First name"
                  required
                />
              </div>

              {/* Last Name */}
              <div>
                <Label
                  required
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Last name
                </Label>
                <Input
                  value={data.owner_second_name}
                  onChange={(e) =>
                    updateData({
                      owner_second_name: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <Label
                required
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <Input
                value={data.email}
                onChange={(e) =>
                  updateData({
                    email: e.target.value,
                  })
                }
                type="email"
                required
                placeholder="youremail@service.com"
              />
            </div>
          </div>
        </div>
        <div className="space-y-2 mt-5">
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-400">
            <Checkbox
              className="h-4 w-4 cursor-pointer"
              checked={taxExempt}
              onCheckedChange={(checked: boolean) => {
                setTaxExempt(checked)
              }}
            />
            Tax exempt?
          </label>
          {taxExempt && (
            <div className="mt-4">
              <h2 className="font-semibold dark:text-gray-400">Exemptions</h2>
              <p className="text-sm text-gray-500">
                (codes apply only to certain entities, not individuals;{" "}
                <a
                  href="#"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  {" "}
                  <br />
                  see instructions on page 3
                </a>
                )
              </p>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="mb-1 block text-sm font-medium">
                    Exempt payee code (if any)
                  </Label>
                  <Input
                    value={data.exemot_payee_code}
                    onChange={(e) =>
                      updateData({ exemot_payee_code: e.target.value })
                    }
                    type="text"
                    placeholder="Code"
                  />
                </div>

                <div>
                  <Label className="mb-1 block text-sm font-medium">
                    Exemption from FATCA reporting code (if any)
                  </Label>
                  <Input
                    value={data.fatca_reporting_code}
                    onChange={(e) =>
                      updateData({ fatca_reporting_code: e.target.value })
                    }
                    type="text"
                    placeholder="Code"
                  />
                </div>
              </div>
            </div>
          )}

          <label className="flex items-center gap-2 pt-3 text-sm text-gray-700">
            <Checkbox className="h-4 w-4" />
            <span className="text-sm dark:text-gray-400">
              I agree to messaging from for customer care at the phone number
              provided above. I understand I will receive messages, data rates
              may apply, reply stop to opt-out, reply yes to opt-in
            </span>
          </label>

          <Label
            required
            className="flex items-center gap-2 pt-3 text-sm text-gray-700"
          >
            <Checkbox className="h-4 w-4 rounded border-gray-300" required />
            <span className="text-sm dark:text-gray-400">
              I have read and agree to the{" "}
              <Link
                href={PRIVACY_POLICY_URL}
                className="text-blue-500"
                onClick={(e) => {
                  e.preventDefault()
                  openPrivacyPolicyPopup()
                }}
              >
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href={"/terms"} className="text-blue-500">
                Terms & Conditions.
              </Link>{" "}
              Also consent to the collection, use, and processing of my personal
              data as described therein
            </span>
          </Label>
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
