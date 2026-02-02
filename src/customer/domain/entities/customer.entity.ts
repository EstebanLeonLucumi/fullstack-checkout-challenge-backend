import { Messages } from 'src/common/utils/messages';

export class Customer {
  constructor(
    private readonly id: string,
    private readonly email: string,
    private readonly fullName: string,
    private readonly createdAt: Date,
    private readonly address: string | null = null,
    private readonly city: string | null = null,
  ) {}

  static create(
    email: string,
    fullName: string,
    address: string | null = null,
    city: string | null = null,
  ): Customer {
    const trimmedEmail = email?.trim().toLowerCase();
    if (!trimmedEmail) throw new Error(Messages.CUSTOMER_EMAIL_REQUIRED);
    if (!fullName?.trim()) throw new Error(Messages.CUSTOMER_FULL_NAME_REQUIRED);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail))
      throw new Error(Messages.VALIDATION_EMAIL_INVALID);
    return new Customer(
      '',
      trimmedEmail,
      fullName.trim(),
      new Date(),
      address?.trim() || null,
      city?.trim() || null,
    );
  }

  getId(): string {
    return this.id;
  }

  getEmail(): string {
    return this.email;
  }

  getFullName(): string {
    return this.fullName;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getAddress(): string | null {
    return this.address;
  }

  getCity(): string | null {
    return this.city;
  }
}
