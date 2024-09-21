import {
  ChartColumnBig,
  Handshake,
  Images,
  ListOrdered,
  MessageCircleHeart,
  Shirt,
  UsersRound,
  Palette,
  Ruler,
} from "lucide-react";

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
  sizes: [],
  colors: [],
  discoint: 0,
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
  rating: undefined,
};

export const MonthlyDealDefaultValues = {
  image: "",
  endDate: new Date(),
  text: "",
};

export const HeroSectionDefaultValues = {
  image: "",
  text: "",
};

export const links = [
  {
    title: "Прглед",
    href: "/admin/overview",
    icon: ChartColumnBig,
  },
  {
    title: "Продукти",
    href: "/admin/products",
    icon: Shirt,
  },
  {
    title: "Поръчки",
    href: "/admin/orders",
    icon: ListOrdered,
  },
  {
    title: "Потребители",
    href: "/admin/users",
    icon: UsersRound,
  },
  {
    title: "Пормоции",
    href: "/admin/monthly-deals",
    icon: Handshake,
  },
  {
    title: "Ревюта",
    href: "/admin/user-reviews",
    icon: MessageCircleHeart,
  },
  {
    title: "Главна секция",
    href: "/admin/hero-section",
    icon: Images,
  },
  {
    title: "Цветове",
    href: "/admin/colors",
    icon: Palette,
  },
  {
    title: "Размери",
    href: "/admin/sizes",
    icon: Ruler,
  },
];

export const ColorDefaultValues = {
  label: "",
};

export const SizeDefaultValues = {
  label: "",
};
