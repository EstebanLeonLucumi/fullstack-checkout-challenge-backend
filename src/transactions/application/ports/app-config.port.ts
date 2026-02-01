export interface AppConfigPort {
  getCurrency(): string;
  getBaseFee(): number;
  getDeliveryFee(): number;
}

export const APP_CONFIG = Symbol('APP_CONFIG');
