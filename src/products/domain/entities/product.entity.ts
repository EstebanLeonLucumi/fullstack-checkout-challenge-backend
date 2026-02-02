import { Messages } from 'src/common/utils/messages';
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
      throw new Error(Messages.PRODUCT_NAME_REQUIRED);

    if (!description?.trim())
      throw new Error(Messages.PRODUCT_DESCRIPTION_REQUIRED);

    if (!image?.trim())
      throw new Error(Messages.PRODUCT_IMAGE_REQUIRED);

    if (stock < 0)
      throw new Error(Messages.PRODUCT_STOCK_NON_NEGATIVE);

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
      throw new Error(Messages.PRODUCT_DECREMENT_NON_NEGATIVE);

    if (this.stock - amount < 0) {
      throw new Error(Messages.PRODUCT_INSUFFICIENT_STOCK);
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
