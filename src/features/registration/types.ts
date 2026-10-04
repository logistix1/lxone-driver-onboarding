export type Driver = {
  same_as_owner_address?: boolean;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: "US" | "CA" | null;
  license_country?: "US" | "CA" | null;
  full_name: string;
  phone_number: string;
  license_number: string;
  license_state: string;
  license_type: string;
  license_expiration_date: string;
};

export type Vehicle = {
  registration_country?: "US" | "CA" | null;
  length: string;
  width: string;
  height: string;
  door_width: string;
  door_height: string;
  high_dock:  | string;
  equipment_ids: string[];
  make: string;
  model: string;
  payload: string;
  gvw: string;
  year: string|null;
};

export type Company = {
  canadian_business_number?: string;
  canadian_tax_id?: string;
  canadian_business_type?: "sole_proprietor" | "corporation" | "partnership" | "other";
  country?: "US" | "CA" | null;
  company_name: string;
  owner_first_name: string;
  owner_second_name: string;
  email: string;
  company_phone: string;
  owner_phone: string;
  limited_liability: string|null;
  other_business_type: string|null;
  zip_code: string;
  state: string|undefined;
  city: string;
  employee_id: string;
  address: string;
  company_birth_date: string|null;
  business_type: string|undefined;
  emergency_phone_number: string;
  driver: Driver;
  vehicle: Vehicle;
  exemot_payee_code:string
  fatca_reporting_code:string
  title:string
};
