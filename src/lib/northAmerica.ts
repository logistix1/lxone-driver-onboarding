export type Country = "US" | "CA"

export const canadianProvinces = [
  ["AB", "Alberta"], ["BC", "British Columbia"], ["MB", "Manitoba"],
  ["NB", "New Brunswick"], ["NL", "Newfoundland and Labrador"],
  ["NS", "Nova Scotia"], ["NT", "Northwest Territories"], ["NU", "Nunavut"],
  ["ON", "Ontario"], ["PE", "Prince Edward Island"], ["QC", "Quebec"],
  ["SK", "Saskatchewan"], ["YT", "Yukon"],
].map(([short_name, name], index) => ({ id: 1000 + index, short_name, name }))

export function regionOptions(country: Country | null | undefined, us: { id: number; short_name: string; name: string }[] | undefined) {
  return country === "CA" ? canadianProvinces : us
}

export function normalizePostal(value: string, country: Country) {
  const postal = value.trim().toUpperCase()
  if (country === "US") {
    if (!/^[0-9]{5}(-[0-9]{4})?$/.test(postal)) throw new Error("Enter a valid US ZIP code")
    return postal
  }
  if (!/^[ABCEGHJ-NPRSTVXY][0-9][ABCEGHJ-NPRSTV-Z] ?[0-9][ABCEGHJ-NPRSTV-Z][0-9]$/.test(postal)) {
    throw new Error("Enter a complete Canadian postal code")
  }
  const compact = postal.replace(" ", "")
  return compact.slice(0, 3) + " " + compact.slice(3)
}

/** A country change must not carry a previous country's address into submission. */
export function changeAddressCountry(country: Country) {
  return { country, state: "", zip_code: "" }
}
