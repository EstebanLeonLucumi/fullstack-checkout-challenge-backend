export interface CreateCustomerInputDto {
  email: string;
  fullName: string;
  address?: string | null;
  city?: string | null;
}
