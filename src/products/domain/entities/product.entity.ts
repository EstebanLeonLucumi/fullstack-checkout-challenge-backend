import { Money } from '../value-objects/money.vo';

export class Product {
  constructor(
    private readonly id: string | null,
    private readonly name: string,
    private readonly description: string,
    private readonly price: Money,
    private readonly image: string,
    private readonly stock: number,
    private readonly createdAt: Date = new Date(),
    private readonly updatedAt: Date = new Date(),
  ) {}

  static create(
    name: string,
    description: string,
    price: Money,
    image: string,
    stock: number,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ): Product {

    if (!name?.trim())
      throw new Error('El nombre del producto no puede estar vacío');

    if (!description?.trim())
      throw new Error('La descripción del producto no puede estar vacío');

    if (!image?.trim())
      throw new Error('La imagen del producto no puede estar vacío');

    if (stock < 0)
      throw new Error('El stock del producto no puede ser negativo');

    return new Product(
      null,
      name,
      description,
      price,
      image,
      stock,
      createdAt,
      updatedAt,
    );
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getPrice(): Money {
    return this.price;
  }

  getImage(): string {
    return this.image;
  }

  getStock(): number {
    return this.stock;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  increaseStock(amount: number): Product {
    if (amount < 0)
      throw new Error('La cantidad a incrementar debe ser mayor a cero');

    return new Product(
      this.id,
      this.name,
      this.description,
      this.price,
      this.image,
      this.stock + amount,
      this.createdAt,
      this.updatedAt,
    );
  }

  decreaseStock(amount: number): Product {
    if (amount < 0)
      throw new Error('La cantidad a decrementar no puede ser negativa');

    if (this.stock - amount < 0) {
      throw new Error('No hay stock suficiente para decrementar esa cantidad');
    }

    return new Product(
      this.id,
      this.name,
      this.description,
      this.price,
      this.image,
      this.stock - amount,
      this.createdAt,
      new Date(),
    );
  }
}
