export interface CreateCustomerOutputDto {
  id: string;
  email: string;
  fullName: string;
  address: string | null;
  city: string | null;
  createdAt: Date;
}
