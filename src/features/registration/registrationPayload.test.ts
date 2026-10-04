import { beforeEach, describe, expect, it, vi } from "vitest"
import { webcrypto } from "node:crypto"
import { registrationPayload, registrationRequestKey } from "./registrationPayload"
import type { Company } from "./types"

const data: Company = {
  country: "CA", company_name: "Test", owner_first_name: "A", owner_second_name: "B",
  email: "test@example.com", company_phone: "+14165550100", owner_phone: "+14165550101",
  limited_liability: null, other_business_type: null, zip_code: "M5V 2T6", state: "ON", city: "Toronto",
  employee_id: "", address: "Street", company_birth_date: null, business_type: undefined,
  emergency_phone_number: "", exemot_payee_code: "", fatca_reporting_code: "", title: "Owner",
  driver: { full_name: "Driver", phone_number: "+14165550102", license_number: "TEST", license_state: "ON",
    license_type: "G", license_expiration_date: "2030-01-01", same_as_owner_address: true },
  vehicle: { length: "144", width: "", height: "60", door_width: "", door_height: "", high_dock: "no",
    equipment_ids: [], make: "Test", model: "Van", payload: "0", gvw: "9000", year: null },
}

beforeEach(() => { vi.stubGlobal("crypto", webcrypto); sessionStorage.clear() })

describe("registration payload and retry identity", () => {
  it("sends Canadian records without US placeholders and preserves zero", () => {
    const payload = registrationPayload(data)
    expect(payload.employee_id).toBeNull()
    expect(payload.business_type).toBeNull()
    expect(payload.canadian_business_type).toBeNull()
    expect(payload.vehicle.width).toBeNull()
    expect(payload.vehicle.payload).toBe(0)
    expect(payload.driver.same_as_owner_address).toBe(true)
  })
  it("retains US tax fields and rejects invalid vehicle values", () => {
    expect(registrationPayload({ ...data, country: "US", employee_id: "123", business_type: "1" }))
      .toMatchObject({ employee_id: "123", business_type: 1 })
    expect(() => registrationPayload({ ...data, vehicle: { ...data.vehicle, length: "no" } })).toThrow()
  })
  it("reuses keys for retries and isolates different payloads and links", async () => {
    const payload = registrationPayload(data)
    const key = await registrationRequestKey("invite-one", payload)
    expect(await registrationRequestKey("invite-one", payload)).toBe(key)
    expect(await registrationRequestKey("invite-two", payload)).not.toBe(key)
    expect(await registrationRequestKey("invite-one", { ...payload, company_name: "Changed" })).not.toBe(key)
    expect(JSON.stringify(sessionStorage)).not.toContain("test@example.com")
  })
})
