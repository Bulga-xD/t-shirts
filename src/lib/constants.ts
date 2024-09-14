export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "VANDALL";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION || "An E-Comeerce store for T-Shirts";

export const PAYMENT_METHOD = "Наложен платеж";

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

export const productDefaultValues = {
  name: "",
  slug: "",
  category: "",
  images: [],
  brand: "",
  description: "",
  price: 0,
  stock: 0,
  rating: 0,
  numReviews: 0,
  isFeatured: false,
};

export const USER_ROLES = process.env.USER_ROLES
  ? process.env.USER_ROLES.split(", ")
  : ["admin", "user"];

export const reviewFormDefaultValues = {
  title: "",
  comment: "",
  rating: 0,
};

export const SENDER_EMAIL = process.env.SENDER_EMAIL || "onboarding@resend.dev";

export const UserReviewDefaultValues = {
  name: "",
  title: "",
  text: "",
  rating: 0,
};
