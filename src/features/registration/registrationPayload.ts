import type { Company } from "./types"

function optionalNumber(value: string | null) {
  if (value == null || value.trim() === "") return null
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < 0) throw new Error("Enter a valid non-negative vehicle measurement")
  return parsed
}

export function registrationPayload(data: Company) {
  const canadian = data.country === "CA"
  return {
    ...data,
    employee_id: canadian ? null : data.employee_id,
    business_type: canadian ? null : Number(data.business_type),
    limited_liability: canadian ? null : data.limited_liability || null,
    canadian_business_number: data.canadian_business_number || null,
    canadian_tax_id: data.canadian_tax_id || null,
    canadian_business_type: data.canadian_business_type || null,
    vehicle: {
      ...data.vehicle,
      length: optionalNumber(data.vehicle.length), width: optionalNumber(data.vehicle.width),
      height: optionalNumber(data.vehicle.height), door_width: optionalNumber(data.vehicle.door_width),
      door_height: optionalNumber(data.vehicle.door_height), payload: optionalNumber(data.vehicle.payload),
      gvw: optionalNumber(data.vehicle.gvw), year: optionalNumber(data.vehicle.year),
    },
  }
}

const memoryKeys = new Map<string, string>()

/** Only a digest and opaque UUID are retained, never the submitted profile. */
export async function registrationRequestKey(token: string, payload: ReturnType<typeof registrationPayload>) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify([token, payload])))
  const storageKey = "lx1-registration:" + Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("")
  let key = memoryKeys.get(storageKey)
  try { key ||= sessionStorage.getItem(storageKey) || undefined } catch { /* Storage can be disabled. */ }
  key ||= crypto.randomUUID()
  if (memoryKeys.size >= 25) memoryKeys.delete(memoryKeys.keys().next().value!)
  memoryKeys.set(storageKey, key)
  try { sessionStorage.setItem(storageKey, key) } catch { /* In-memory retries remain protected. */ }
  return key
}
