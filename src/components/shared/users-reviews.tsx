"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardTitle } from "../ui/card";
import Rating from "./product/rating";
import { Button } from "../ui/button";
import { useState } from "react";

export const reviews = [
  {
    id: 1,
    fullName: "Иван Иванов",
    city: "София",
    title: "Страхотен продукт",
    rating: 5,
    text: "Много съм доволен от покупката си. Препоръчвам на всеки, който търси качество и добра цена.",
  },
  {
    id: 2,
    fullName: "Мария Петрова",
    city: "Пловдив",
    title: "Добро качество, но бавно обслужване",
    rating: 4,
    text: "Продуктът е добър, но доставката отне повече време, отколкото очаквах. Все пак съм доволна от качеството.",
  },
  {
    id: 3,
    fullName: "Георги Димитров",
    city: "Варна",
    title: "Не отговаря на очакванията",
    rating: 2,
    text: "Имах високи очаквания, но продуктът не отговори на тях. Качеството не е толкова добро, колкото е описано.",
  },
  {
    id: 4,
    fullName: "Десислава Николова",
    city: "Бургас",
    title: "Отлично обслужване и продукт",
    rating: 5,
    text: "Обслужването беше бързо и професионално. Продуктът надмина очакванията ми. Определено бих поръчала отново.",
  },
  {
    id: 5,
    fullName: "Стоян Колев",
    city: "Русе",
    title: "Среден опит",
    rating: 3,
    text: "Продуктът е на приемливо ниво, но има какво да се подобри. Цената е справедлива за качеството, което получих.",
  },
];

const UserReviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const maxReviews = 3;

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 < reviews.length - maxReviews + 1 ? prevIndex + 1 : 0
    );
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 1 >= 0 ? prevIndex - 1 : reviews.length - maxReviews
    );
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex justify-between mb-10">
        <h2 className="text-3xl font-bold">
          Над 30,000+ Доволни Клиенти избрали VANDALL!
        </h2>
        <div>
          <Button variant="outline" onClick={handlePrevious}>
            <ChevronLeft />
          </Button>

          <Button variant="outline" onClick={handleNext}>
            <ChevronRight />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          className="w-full py-4 px-0.5 grid grid-flow-col transition-transform duration-500 ease-in-out gap-4"
          style={{
            transform: `translateX(-${
              (currentIndex * 100) / (reviews.length - 2)
            }%)`,
            gridAutoColumns: "calc((100% / 3) - 12px)",
          }}
        >
          {reviews.map((review) => (
            <div key={review.id} className="w-[calc(100% / 3)]">
              <UserReview
                fullName={review.fullName}
                city={review.city}
                title={review.title}
                rating={review.rating}
                text={review.text}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const UserReview = ({
  fullName,
  city,
  title,
  rating,
  text,
}: {
  fullName: string;
  city: string;
  title: string;
  rating: number;
  text: string;
}) => {
  return (
    <Card className="p-4 hover:shadow-md transform transition-transform duration-300 hover:-translate-y-2 h-full">
      <CardTitle className="text-base my-1">
        {fullName} - {city}
      </CardTitle>
      <Rating value={rating} />
      <h3 className="text-sm font-bold my-1">{title}</h3>
      <CardContent className="p-0">
        <p className="text-sm text-muted-foreground">&rdquo;{text}&rdquo;</p>
      </CardContent>
    </Card>
  );
};

export default UserReviews;
