"use client"
import React, { createContext, useContext, useState, ReactNode } from "react"
import { Company } from "@/features/registration/types"

type RegistrationContextType = {
  data: Company
  updateData: (newData: Partial<Company>) => void
  resetData: () => void
}

const defaultData: Company = {
  company_name: "",
  owner_first_name: "",
  owner_second_name: "",
  email: "",
  company_phone: "",
  owner_phone: "",
  limited_liability: null,
  other_business_type: null,
  zip_code: "",
  state: undefined,
  city: "",
  employee_id: "",
  address: "",
  company_birth_date:null ,
  business_type: undefined,
  emergency_phone_number: "",
  exemot_payee_code: "",
  fatca_reporting_code: "",
  title:"",
  driver: {
    same_as_owner_address: false,
    address: "",
    city: "",
    state: "",
    zip_code: "",
    full_name: "",
    phone_number: "",
    license_number: "",
    license_state: "",
    license_type: "",
    license_expiration_date: "",
  },
  vehicle: {
    length: "",
    width: "",
    height: "",
    door_width: "",
    door_height: "",
    high_dock: "no",
    equipment_ids: [],
    make: "",
    model: "",
    payload: "",
    gvw: "",
    year: null,
  },
}

export const RegistrationContext = createContext<
  RegistrationContextType | undefined
>(undefined)

export const RegistrationProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<Company>(defaultData)

  const updateData = (newData: Partial<Company>) => {
    setData((prev) => ({ ...prev, ...newData }))
  }

  const resetData = () => setData(defaultData)

  return (
    <RegistrationContext.Provider value={{ data, updateData, resetData }}>
      {children}
    </RegistrationContext.Provider>
  )
}

export const useRegistration = () => {
  const context = useContext(RegistrationContext)
  if (!context) {
    throw new Error("useRegistration must be used within RegistrationProvider")
  }
  return context
}
