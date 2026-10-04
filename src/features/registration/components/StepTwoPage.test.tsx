import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import StepTwoPage from "./StepTwoPage"

const mocks = vi.hoisted(() => ({ push: vi.fn(), mutate: vi.fn(), updateData: vi.fn(),
  data: { company_name: "Carrier LLC", company_phone: "+12025550100", owner_phone: "+12025550101",
    emergency_phone_number: "+12025550102", driver: { full_name: "Actual Driver", phone_number: "+14165550100",
      license_number: "D123", license_state: "ON", license_type: "G", license_expiration_date: "2030-10-04",
      same_as_owner_address: true },
    vehicle: { make: "Ford", model: "Transit", length: "144", width: "50", height: "60", door_width: "50",
      door_height: "60", payload: "3000", gvw: "9000", high_dock: "no", equipment_ids: [], year: "2025" } },
}))
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: mocks.push }) }))
vi.mock("@/context/RegisterationContext", () => ({ useRegistration: () => ({ data: mocks.data, updateData: mocks.updateData }) }))
vi.mock("@/features/registration/hooks/useCreateRegisteration", () => ({ useCreateRegisteration: () => ({ mutate: mocks.mutate, isPending: false }) }))
vi.mock("@/features/registration/hooks/useHrVehicleTools", () => ({ useHrVehicleTools: () => ({ vehicleTools: [] }) }))
vi.mock("react-datepicker", () => ({ default: () => <input aria-label="Vehicle year" defaultValue="2025" /> }))
vi.mock("@/components/MultiSelect", () => ({ MultiSelect: () => null }))
vi.mock("@/components/MaskedInput", () => ({ default: ({ mask, onChange, ...props }: any) =>
  <input {...props} onChange={(e) => onChange(e.target.value)} /> }))

afterEach(cleanup)
beforeEach(() => vi.clearAllMocks())

describe("registration completion", () => {
  it("requires an independent address when copying is not selected", () => {
    mocks.data.driver.same_as_owner_address = false
    render(<StepTwoPage token="test-token" />)
    fireEvent.submit(screen.getByRole("button", { name: "Continue" }).closest("form")!)
    expect(mocks.mutate).not.toHaveBeenCalled()
    expect(screen.getByLabelText(/Driver street address/)).toBeTruthy()
    mocks.data.driver.same_as_owner_address = true
  })
  it("sends actual driver/license/contact data and advances only on server success", () => {
    mocks.mutate.mockImplementation((_input, options) => options.onSuccess())
    render(<StepTwoPage token="test-token" />)
    fireEvent.submit(screen.getByRole("button", { name: "Continue" }).closest("form")!)
    expect(mocks.mutate).toHaveBeenCalledWith({ item: mocks.data, token: "test-token" }, expect.any(Object))
    expect(mocks.data.driver.full_name).not.toBe(mocks.data.company_name)
    expect(mocks.push).toHaveBeenCalledWith("/step-three?token=test-token")
  })

  it("does not advance or clear inputs on validation/network/server failure", () => {
    mocks.mutate.mockImplementation((_input, options) => options.onError?.(new Error("422")))
    render(<StepTwoPage token="test-token" />)
    fireEvent.submit(screen.getByRole("button", { name: "Continue" }).closest("form")!)
    expect(mocks.mutate).toHaveBeenCalledOnce()
    expect(mocks.push).not.toHaveBeenCalled()
    expect((screen.getByLabelText(/Driver full name/) as HTMLInputElement).value).toBe("Actual Driver")
  })

  it("does not send an incomplete driver profile", () => {
    render(<StepTwoPage token="test-token" />)
    const name = screen.getByLabelText(/Driver full name/) as HTMLInputElement
    name.value = ""
    fireEvent.submit(screen.getByRole("button", { name: "Continue" }).closest("form")!)
    expect(mocks.mutate).not.toHaveBeenCalled()
    expect(mocks.push).not.toHaveBeenCalled()
  })
})
