"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardTitle } from "../ui/card";
import Rating from "./product/rating";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { UserReview as UserReviewType } from "@/types";

const UserReviews = ({ reviews }: { reviews: UserReviewType[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  const maxReviews = isMobile ? 1 : 3;
  const cardWidth = isMobile ? 100 : 100 / maxReviews;

  const updateIsMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };

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
    <section id="reviews" className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row justify-between mb-10">
        <h2 className="text-3xl font-bold">
          Над 30,000+ Доволни Клиенти избрали VANDALL!
        </h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={handlePrevious}>
            <ChevronLeft />
          </Button>
          <Button variant="outline" onClick={handleNext}>
            <ChevronRight />
          </Button>
        </div>
      </div>
      {reviews.length > 0 ? (
        <div className="overflow-hidden">
          <div
            className="w-full py-4 px-1 grid grid-flow-col transition-transform duration-500 ease-in-out gap-4"
            style={{
              transform: `translateX(-${currentIndex * cardWidth}%)`,
              gridAutoColumns: isMobile
                ? `calc(100% - 8px)`
                : `calc(${cardWidth}% - 12px)`,
            }}
          >
            {reviews.map((review) => (
              <div
                key={review.id}
                className={`h-[220px] ${
                  isMobile ? "w-full" : "w-[calc(100% / 3)]"
                }`}
              >
                <UserReview
                  fullName={review.fullName!}
                  city={review.city || ""}
                  title={review.title}
                  rating={review.rating}
                  text={review.text}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-xl">Няма публикувани отзиви</p>
      )}
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
    <Card className="p-4 w-full overflow-hidden hover:shadow-md transform transition-transform duration-300 hover:-translate-y-2 h-full">
      <CardTitle className="text-base my-1">
        {fullName} - {city}
      </CardTitle>
      <Rating value={rating} />
      <h3 className="text-sm font-bold my-1">{title}</h3>
      <CardContent className="p-0">
        <p className="text-sm text-muted-foreground line-clamp-5">
          &rdquo;{text}&rdquo;
        </p>
      </CardContent>
    </Card>
  );
};

export default UserReviews;
