import { describe, expect, it } from "vitest"
import { changeAddressCountry, normalizePostal, regionOptions } from "./northAmerica"

describe("North American address contracts", () => {
  it.each([["k1a0b1", "K1A 0B1"], ["H2X 1Y4", "H2X 1Y4"]])("normalizes %s", (raw, expected) => {
    expect(normalizePostal(raw, "CA")).toBe(expected)
  })
  it.each(["K1A", "90210", "D1A 0B1", "K1A-0B1", "K١A 0B1"])("rejects %s", (raw) => {
    expect(() => normalizePostal(raw, "CA")).toThrow()
  })
  it("preserves US leading zeros, legacy options and resets dependent inputs", () => {
    expect(normalizePostal("00501", "US")).toBe("00501")
    const us = [{ id: 1, name: "California", short_name: "CA" }]
    expect(regionOptions(undefined, us)).toBe(us)
    expect(regionOptions("CA", us)).toHaveLength(13)
    expect(changeAddressCountry("CA")).toEqual({ country: "CA", state: "", zip_code: "" })
  })
})
