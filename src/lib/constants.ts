export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "T-Shirts";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION || "An E-Comeerce store for T-Shirts";

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
  ? process.env.PAYMENT_METHODS.split(", ")
  : ["Stripe", "Наложен платеж"];

export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD || "Stripe";

export const signInDefaultValues = {
  email: "",
  password: "",
};

export const signUpDefaultValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const shippingAddressDefaultValues = {
  fullName: "",
  streetAddress: "",
  city: "",
  postalCode: "",
  country: "",
};

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 3;
