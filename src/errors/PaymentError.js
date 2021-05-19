export class PaymentError extends Error {
  constructor(message) {
    super();
    this.name = "PaymentError";
    this.status = 500;
    this.message = message;
  }
}
