/**
 * Centralized application messages (English).
 * Used for API responses, validation, exceptions, and logs.
 */
export const Messages = {
  // Success / operations
  PRODUCT_CREATED: 'Product created successfully',
  PRODUCT_UPDATED: 'Product updated successfully',
  PRODUCT_DELETED: 'Product deleted successfully',
  PRODUCT_FOUND: 'Product found successfully',
  PRODUCTS_FOUND: 'Products found successfully',
  CUSTOMER_CREATED: 'Customer created successfully',
  CUSTOMER_FOUND: 'Customer found successfully',
  TRANSACTION_CREATED: 'Transaction created successfully',
  TRANSACTION_FOUND: 'Transaction found successfully',
  CHECKOUT_SUCCESS: 'Checkout successful',
  STOCK_UPDATED: 'Stock updated successfully',

  // Not found
  PRODUCT_NOT_FOUND: 'Product not found',
  CUSTOMER_NOT_FOUND: 'Customer not found',
  PRODUCT_NOT_FOUND_CANNOT_UPDATE: 'Product not found. Cannot update.',
  PRODUCT_NOT_FOUND_CANNOT_UPDATE_STOCK: 'Product not found. Cannot update stock.',
  PRODUCT_NOT_FOUND_ID: (id: string) => `Product not found: ${id}`,

  // Conflict
  EMAIL_ALREADY_EXISTS: 'Email is already registered',

  // Bad request / validation
  VALIDATION_FAILED: 'Validation failed',
  QUANTITY_MUST_BE_POSITIVE: 'Quantity must be a positive integer',
  CUSTOMER_NOT_FOUND_BAD_REQUEST: 'Customer not found',
  CUSTOMER_NOT_FOUND_FOR_DELIVERY: 'Customer not found to create delivery',
  ADDRESS_AND_CITY_REQUIRED: 'Customer must have address and city registered to complete delivery',

  // Internal / server
  TRANSACTION_COULD_NOT_BE_UPDATED: 'Transaction could not be updated. Please contact support.',
  ORDER_REFERENCE_UNAVAILABLE: 'Order reference service is not available. Please try again later.',
  PAYMENT_COULD_NOT_BE_PROCESSED: 'Payment could not be processed. Please check your data and try again.',
  INTERNAL_ERROR: 'An unexpected error occurred. Please try again later.',

  // HTTP default (filter)
  BAD_REQUEST: 'Bad request',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Resource not found',
  CONFLICT: 'Conflict',
  UNPROCESSABLE_ENTITY: 'Unprocessable entity',

  // Validation (DTOs)
  VALIDATION_EMAIL_INVALID: 'Invalid email format',
  VALIDATION_EMAIL_REQUIRED: 'Email is required',
  VALIDATION_FULL_NAME_REQUIRED: 'Full name is required',
  VALIDATION_FULL_NAME_MIN: 'Full name must be at least 2 characters',
  VALIDATION_FULL_NAME_MAX: 'Full name cannot exceed 200 characters',
  VALIDATION_ADDRESS_MAX: 'Address cannot exceed 500 characters',
  VALIDATION_CITY_MAX: 'City cannot exceed 100 characters',

  // Generic / interceptor
  REQUEST_PROCESSED: 'Request processed',

  // Domain / entity (product)
  PRODUCT_NAME_REQUIRED: 'Product name cannot be empty',
  PRODUCT_DESCRIPTION_REQUIRED: 'Product description cannot be empty',
  PRODUCT_IMAGE_REQUIRED: 'Product image cannot be empty',
  PRODUCT_STOCK_NON_NEGATIVE: 'Product stock cannot be negative',
  PRODUCT_INCREMENT_MUST_BE_POSITIVE: 'Increment amount must be greater than zero',
  PRODUCT_DECREMENT_NON_NEGATIVE: 'Decrement amount cannot be negative',
  PRODUCT_INSUFFICIENT_STOCK: 'Insufficient stock for this quantity',

  // Domain / entity (customer)
  CUSTOMER_EMAIL_REQUIRED: 'Email is required',
  CUSTOMER_FULL_NAME_REQUIRED: 'Full name is required',

  // Domain / entity (transaction)
  TRANSACTION_CUSTOMER_ID_REQUIRED: 'Customer id is required',
  TRANSACTION_ID_REQUIRED: 'Transaction id is required',
  TRANSACTION_AT_LEAST_ONE_ITEM: 'Transaction must have at least one item (TransactionProduct)',

  // Domain / entity (transaction-product)
  TRANSACTION_PRODUCT_ID_REQUIRED: 'productId is required',
  TRANSACTION_PRODUCT_UNIT_PRICE_REQUIRED: 'unitPrice is required',
  TRANSACTION_PRODUCT_QUANTITY_POSITIVE: 'quantity must be a positive integer',
  TRANSACTION_PRODUCT_TOTAL_AMOUNT_NON_NEGATIVE: 'totalAmount cannot be negative',

  // Domain / value objects
  MONEY_AMOUNT_NON_NEGATIVE: 'Amount cannot be negative',
  MONEY_CURRENCY_REQUIRED: 'Currency code cannot be empty',
  TRANSACTION_SAME_CURRENCY: 'All products must have the same currency',
  CURRENCY_INVALID: (currency: string) => `Invalid currency: ${currency}`,
} as const;

export type MessageKey = keyof typeof Messages;
