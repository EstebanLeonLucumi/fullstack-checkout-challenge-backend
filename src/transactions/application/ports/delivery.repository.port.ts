export interface CreateDeliveryResult {
  id: string;
}

export interface DeliveryRepositoryPort {
  create(
    customerId: string,
    address: string,
    city: string,
  ): Promise<CreateDeliveryResult>;
}

export const DELIVERY_REPOSITORY = Symbol('DELIVERY_REPOSITORY');
