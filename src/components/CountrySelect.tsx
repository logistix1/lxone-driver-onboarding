"use client"

import { Label } from "@/components/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select"
import type { Country } from "@/lib/northAmerica"
import { useId } from "react"

export function CountrySelect({ label, value, onChange }: {
  label: string
  value?: Country | null
  onChange: (value: Country) => void
}) {
  const id = useId()
  return <div>
    <Label htmlFor={id} className="text-xs">{label}</Label>
    <Select value={value ?? ""} onValueChange={(value) => {
      if (value === "US" || value === "CA") onChange(value)
    }}>
      <SelectTrigger id={id}><SelectValue placeholder="Select country" /></SelectTrigger>
      <SelectContent>
        <SelectItem value="US">United States</SelectItem>
        <SelectItem value="CA">Canada</SelectItem>
      </SelectContent>
    </Select>
  </div>
}
