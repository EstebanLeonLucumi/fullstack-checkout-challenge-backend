export class Customer {
  constructor(
    private readonly id: string,
    private readonly email: string,
    private readonly fullName: string,
    private readonly createdAt: Date,
  ) {}

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
}
