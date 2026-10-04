"use client"
import { Button } from "@/components/Button"
import { CountrySelect } from "@/components/CountrySelect"
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import MaskedInput from "@/components/MaskedInput"
import { MultiSelect } from "@/components/MultiSelect"
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select"
import { HIGH_DOCK_OPTIONS } from "@/constants/constants"
import { useRegistration } from "@/context/RegisterationContext"
import { useCreateRegisteration } from "@/features/registration/hooks/useCreateRegisteration"
import { useHrVehicleTools } from "@/features/registration/hooks/useHrVehicleTools"
import { Select } from "@radix-ui/react-select"
import dayjs from "dayjs"
import { useRouter } from "next/navigation"
import React from "react"
import DatePicker from "react-datepicker"

export default function StepTwoPage({ token }: { token: string }) {
  const router = useRouter()
  const { data, updateData } = useRegistration()
  const { vehicleTools } = useHrVehicleTools()
  const { mutate, isPending } = useCreateRegisteration()
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isPending || !e.currentTarget.reportValidity()) return
    mutate(
      { item: data, token },
      {
        onSuccess: () => {
          router.push(`/step-three?token=${encodeURIComponent(token)}`)
        },
      },
    )
  }

  return (
    <main className="mx-auto p-3 pt-20">
      <form onSubmit={handleSubmit} className="mt-4">
        <section className="mb-6">
          <h2 className="mb-4 text-lg font-semibold dark:text-gray-400">Driver information</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <CountrySelect label="License country" value={data.driver.license_country}
              onChange={(license_country) => updateData({ driver: { ...data.driver, license_country, license_state: "" } })} />
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={data.driver.same_as_owner_address === true}
                onChange={(e) => updateData({ driver: { ...data.driver, same_as_owner_address: e.target.checked } })} />
              Driver address is the same as owner address
            </label>
            {data.driver.same_as_owner_address === false && <>
              <CountrySelect label="Driver address country" value={data.driver.country}
                onChange={(country) => updateData({ driver: { ...data.driver, country, state: "", zip_code: "" } })} />
              {([ ["address", "Driver street address"], ["city", "Driver city"],
                ["state", "Driver state / province"], ["zip_code", "Driver ZIP / postal code"] ] as const).map(([field, label]) =>
                <div key={field}>
                  <Label htmlFor={`driver-${field}`} required>{label}</Label>
                  <Input id={`driver-${field}`} required value={data.driver[field] || ""}
                    onChange={(e) => updateData({ driver: { ...data.driver, [field]: e.target.value } })} />
                </div>)}
            </>}
            <div>
              <Label htmlFor="driver-name" required>Driver full name</Label>
              <Input id="driver-name" required value={data.driver.full_name}
                onChange={(e) => updateData({ driver: { ...data.driver, full_name: e.target.value } })} />
            </div>
            <div>
              <Label htmlFor="driver-phone" required>Driver phone</Label>
              <MaskedInput id="driver-phone" required mask="+1 (000) 000-0000"
                pattern={"\\+1 ?\\(?[0-9]{3}\\)? ?[0-9]{3}-?[0-9]{4}"} value={data.driver.phone_number}
                onChange={(value) => updateData({ driver: { ...data.driver, phone_number: value } })} />
            </div>
            <div>
              <Label htmlFor="license-number" required>License number</Label>
              <Input id="license-number" required value={data.driver.license_number}
                onChange={(e) => updateData({ driver: { ...data.driver, license_number: e.target.value } })} />
            </div>
            <div>
              <Label htmlFor="license-state" required>License state / province</Label>
              <Input id="license-state" required value={data.driver.license_state}
                onChange={(e) => updateData({ driver: { ...data.driver, license_state: e.target.value } })} />
            </div>
            <div>
              <Label htmlFor="license-type" required>License class</Label>
              <Input id="license-type" required value={data.driver.license_type}
                onChange={(e) => updateData({ driver: { ...data.driver, license_type: e.target.value } })} />
            </div>
            <div>
              <Label htmlFor="license-expiry" required>License expiration date</Label>
              <Input id="license-expiry" required type="date" value={data.driver.license_expiration_date}
                onChange={(e) => updateData({ driver: { ...data.driver, license_expiration_date: e.target.value } })} />
            </div>
            <div>
              <Label htmlFor="owner-phone" required>Owner phone</Label>
              <MaskedInput id="owner-phone" required mask="+1 (000) 000-0000" value={data.owner_phone}
                onChange={(value) => updateData({ owner_phone: value })} />
            </div>
            <div>
              <Label htmlFor="emergency-phone">Emergency contact phone</Label>
              <MaskedInput id="emergency-phone" required={false} mask="+1 (000) 000-0000"
                value={data.emergency_phone_number} onChange={(value) => updateData({ emergency_phone_number: value })} />
            </div>
          </div>
        </section>
        <div>
          <h2 className="mb-4 text-lg font-semibold dark:text-gray-400">
            Vehicle info
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <CountrySelect label="Registration country" value={data.vehicle.registration_country}
              onChange={(registration_country) => updateData({ vehicle: { ...data.vehicle, registration_country } })} />
            <div>
              <Label required>Make and Model</Label>
              <Input
                value={data.vehicle.make}
                onChange={(e) => {
                  updateData({
                    vehicle: { ...data.vehicle, make: e.target.value },
                  })
                }}
                required
                type="text"
                placeholder="Make"
              />
            </div>

            <div>
              <Label className="mb-1 block text-sm font-medium text-gray-700">
                &nbsp;
              </Label>
              <Input
                required
                type="text"
                placeholder="Model"
                value={data.vehicle.model}
                onChange={(e) => {
                  updateData({
                    vehicle: { ...data.vehicle, model: e.target.value },
                  })
                }}
              />
            </div>

            <div>
              <Label
                required
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Door Dimensions
              </Label>
              <Input
                value={data.vehicle.door_width}
                onChange={(e) => {
                  updateData({
                    vehicle: { ...data.vehicle, door_width: e.target.value },
                  })
                }}
                min={0}
                required
                type="number"
                placeholder="Width"
              />
            </div>

            <div>
              <Label className="mb-1 block text-sm font-medium text-gray-700">
                &nbsp;
              </Label>
              <Input
                value={data.vehicle.door_height}
                onChange={(e) => {
                  updateData({
                    vehicle: { ...data.vehicle, door_height: e.target.value },
                  })
                }}
                required
                min={0}
                type="number"
                placeholder="Height"
              />
            </div>

            <div className="relative">
              <Label
                required
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Equipment & Dock Height
              </Label>
              <MultiSelect
                options={(vehicleTools || []).map(
                  (item: { id: string; name: string }) => ({
                    label: item.name,
                    value: item.id.toString(),
                  }),
                )}
                value={data.vehicle.equipment_ids}
                onValueChange={(e) =>
                  updateData({ vehicle: { ...data.vehicle, equipment_ids: e } })
                }
                placeholder="Select equipment"
                // disabled={isLoading || isPending || !vehicleTools?.length}
              />
            </div>
            <div className="relative">
              <Label className="mb-1 block text-sm font-medium text-gray-700">
                &nbsp;
              </Label>
              <Select
                // key={`high_dock_${formData.high_dock}`}
                value={data.vehicle.high_dock || ""}
                onValueChange={(value) =>
                  updateData({ vehicle: { ...data.vehicle, high_dock: value } })
                }
                // disabled={isLoading || isPending}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Dock Height/Ramps" />
                </SelectTrigger>
                <SelectContent>
                  {HIGH_DOCK_OPTIONS.map(
                    (option: { value: string; label: string }) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <Label
                required
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Useful Cargo Dimensions (Inches)
              </Label>
              <Input
                value={data.vehicle.length}
                onChange={(e) => {
                  updateData({
                    vehicle: { ...data.vehicle, length: e.target.value },
                  })
                }}
                required
                min={0}
                type="number"
                placeholder="Length"
              />
            </div>
            <div>
              <Label className="mb-1 block text-sm font-medium text-gray-700">
                &nbsp;
              </Label>
              <Input
                value={data.vehicle.width}
                onChange={(e) => {
                  updateData({
                    vehicle: { ...data.vehicle, width: e.target.value },
                  })
                }}
                required
                min={0}
                type="number"
                placeholder="Width "
              />
            </div>
            <div>
              <Label className="mb-1 block text-sm font-medium text-gray-700">
                &nbsp;
              </Label>
              <Input
                value={data.vehicle.height}
                onChange={(e) => {
                  updateData({
                    vehicle: { ...data.vehicle, height: e.target.value },
                  })
                }}
                required
                min={0}
                type="number"
                placeholder="Height"
              />
            </div>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label
                required
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Payload and GVW
              </Label>
              <Input
                value={data.vehicle.payload}
                onChange={(e) => {
                  updateData({
                    vehicle: { ...data.vehicle, payload: e.target.value },
                  })
                }}
                required
                min={0}
                type="number"
                placeholder="Payload (lbs)"
              />
            </div>
            <div>
              <Label className="mb-1 block text-sm font-medium text-gray-700">
                &nbsp;
              </Label>
              <Input
                value={data.vehicle.gvw}
                min={0}
                onChange={(e) => {
                  updateData({
                    vehicle: { ...data.vehicle, gvw: e.target.value },
                  })
                }}
                required
                type="number"
                placeholder="GVW (lbs) "
              />
            </div>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="relative">
              <Label
                required
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Year
              </Label>
              <DatePicker
                locale="en-GB"
                wrapperClassName="w-full"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-normal shadow-sm outline-none focus:border-blue-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-500/40"
                calendarClassName="rounded-xl shadow-lg text-sm bg-white dark:bg-gray-900 dark:text-gray-100"
                selected={
                  data.vehicle.year ? dayjs(data.vehicle.year).toDate() : null
                }
                onChange={(date) => {
                  if (date) {
                    updateData({
                      vehicle: {
                        ...data.vehicle,
                        year: dayjs(date).format("YYYY"),
                      },
                    })
                  }
                }}
                dateFormat="yyyy"
                placeholderText="Select date"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <Button
            className="mt-4 w-full disabled:bg-gray-200 disabled:text-gray-500"
            type="submit"
            aria-disabled={isPending}
            disabled={isPending}
            isLoading={isPending}
          >
            {isPending ? "Submitting..." : "Continue"}
          </Button>
        </div>
      </form>
    </main>
  )
}
