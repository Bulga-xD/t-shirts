import { hashSync } from "bcrypt-ts-edge";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

const sampleData = {
  users: [
    {
      name: "John",
      email: "admin@example.com",
      password: hashSync("123456", 10),
      role: Role.admin,
      paymentMethod: "Наложен платеж",
    },
    {
      name: "Jane",
      email: "jane@example.com",
      password: hashSync("123456", 10),
      role: Role.user,
      paymentMethod: "Наложен платеж",
    },
  ],
  // products: [
  //   {
  //     name: "LOOSE FIT PIQUE JOGGER SWEATSHIRT",
  //     slug: "loose-fit-pique-jogger-sweatshirt",
  //     category: "Men's Sweatshirts",
  //     images: ["/assets/images/p1-1.jpeg", "/assets/images/p1-2.jpeg"],
  //     price: "59.99",
  //     brand: "Nike",
  //     rating: "4.5",
  //     numReviews: 10,
  //     productVariants: [
  //       {
  //         size: {
  //           id: 1,
  //           name: "S",
  //         },
  //         color: {
  //           id: 1,
  //           name: "Black",
  //         },
  //         stock: 10,
  //       },
  //     ],
  //     description:
  //       "Lacoste sporting elegance with an urban twist. Fall in love with this loose, cozy sweatshirt in super-comfortable double-face piqué.",
  //     isFeatured: true,
  //     banner: "/assets/images/banner-1.jpeg",
  //   },
  //   {
  //     name: "LACOSTE TENNIS X NOVAK DJOKOVIC SPORTSUIT JACKET",
  //     slug: "lacoste-tennis-x-novak-djokovic-sportsuit-jacket",
  //     category: "Men's Sweatshirts",
  //     images: ["/assets/images/p2-1.jpeg", "/assets/images/p2-2.jpeg"],
  //     price: "199.90",
  //     brand: "Lacoste",
  //     rating: "4.2",
  //     numReviews: 8,
  //     productVariants: [
  //       {
  //         size: {
  //           id: 1,
  //           name: "S",
  //         },
  //         color: {
  //           id: 1,
  //           name: "Black",
  //         },
  //         stock: 10,
  //       },
  //     ],
  //     description:
  //       "Hit the courts like Novak Djokovic with this seamless stretch jacket, made to move your way.",
  //     isFeatured: true,
  //     banner: "/assets/images/banner-2.jpeg",
  //   },
  //   {
  //     name: "SHOWERPROOF SPORTSUIT TRACK PANTS",
  //     slug: "showerproof-sportsuit-track-pants",
  //     category: "Track Pants",
  //     images: ["/assets/images/p3-1.jpeg", "/assets/images/p3-2.jpeg"],

  //     price: "149.95",
  //     brand: "Nike",
  //     rating: "4.9",
  //     numReviews: 3,
  //     productVariants: [
  //       {
  //         size: {
  //           id: 1,
  //           name: "S",
  //         },
  //         color: {
  //           id: 1,
  //           name: "Black",
  //         },
  //         stock: 10,
  //       },
  //     ],
  //     description:
  //       "Stay stylish, whatever the weather. These showerproof track pants are here to protect you from the rain. ",
  //   },
  //   {
  //     name: "MEN'S LACOSTE SPORT FRENCH CAPSULE TRACKSUIT PANTS",
  //     slug: "mens-lacoste-sport-french-capsule-tracksuit-pants",
  //     category: "Track Pants",
  //     images: ["/assets/images/p4-1.jpeg", "/assets/images/p4-2.jpeg"],
  //     price: "125.95",
  //     brand: "Lacoste",
  //     rating: "3.6",
  //     numReviews: 5,
  //     productVariants: [
  //       {
  //         size: {
  //           id: 1,
  //           name: "S",
  //         },
  //         color: {
  //           id: 1,
  //           name: "Black",
  //         },
  //         stock: 10,
  //       },
  //     ],
  //     description:
  //       "A tricolour design brings a distinctive edge to these lightweight tracksuit pants made of diamond taffeta. ",
  //   },
  // ],
};

export const reviews = [
  {
    fullName: "Иван Иванов",
    city: "София",
    title: "Страхотен продукт",
    rating: 5,
    text: "Много съм доволен от покупката си. Препоръчвам на всеки, който търси качество и добра цена.",
  },
  {
    fullName: "Мария Петрова",
    city: "Пловдив",
    title: "Добро качество, но бавно обслужване",
    rating: 4,
    text: "Продуктът е добър, но доставката отне повече време, отколкото очаквах. Все пак съм доволна от качеството.",
  },
  {
    fullName: "Георги Димитров",
    city: "Варна",
    title: "Не отговаря на очакванията",
    rating: 2,
    text: "Имах високи очаквания, но продуктът не отговори на тях. Качеството не е толкова добро, колкото е описано.",
  },
  {
    fullName: "Десислава Николова",
    city: "Бургас",
    title: "Отлично обслужване и продукт",
    rating: 5,
    text: "Обслужването беше бързо и професионално. Продуктът надмина очакванията ми. Определено бих поръчала отново.",
  },
  {
    fullName: "Стоян Колев",
    city: "Русе",
    title: "Среден опит",
    rating: 3,
    text: "Продуктът е на приемливо ниво, но има какво да се подобри. Цената е справедлива за качеството, което получих.",
  },
];

export default sampleData;

async function main() {
  // Seed users
  prisma.user.deleteMany();
  prisma.product.deleteMany();

  for (const review of reviews) {
    await prisma.userReview.create({
      data: review,
    });
  }

  for (const user of sampleData.users) {
    await prisma.user.create({
      data: user,
    });
  }

  // Seed products
  // for (const product of sampleData.products) {
  //   await prisma.product.create({
  //     data: {
  //       ...product,
  //       price: Number(product.price),
  //       rating: Number(product.rating),
  //     },
  //   });
  // }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
