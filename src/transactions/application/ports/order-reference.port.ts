export interface OrderReferencePort {
  getNextReference(): Promise<string>;
}

export const ORDER_REFERENCE = Symbol('ORDER_REFERENCE');
