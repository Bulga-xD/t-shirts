"use client";
import { Button } from "@/components/ui/button";
import { MonthlyDeal } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const ProductPromotion = ({ deal }: { deal: MonthlyDeal }) => {
  const calculateTimeLeft = () => {
    const currentTime = new Date().getTime();
    const endDate =
      deal.endDate instanceof Date ? deal.endDate : new Date(deal.endDate);
    const endTime = endDate.getTime();

    const timeDifference = endTime - currentTime;

    if (timeDifference > 0) {
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    } else {
      return null;
    }
  };

  const [time, setTime] = useState(calculateTimeLeft());

  useEffect(() => {
    if (!time) return; // Don't set up timer if deal has already expired

    const timerInterval = setInterval(() => {
      const newTime = calculateTimeLeft();
      setTime(newTime);

      if (!newTime) {
        clearInterval(timerInterval);
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [deal.endDate]);

  if (!time) {
    return (
      <section className="my-20 text-center">
        <h3 className="text-3xl font-bold">Оферта на месеца</h3>
        <p>Тази оферта е изтекла. Моля, проверете за нови оферти.</p>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 my-20">
      <div className="flex flex-col gap-2 justify-center">
        <h3 className="text-3xl font-bold">Оферта на месеца</h3>
        <p>{deal.text}</p>

        <ul className="grid grid-cols-4 gap-2">
          <StatBox label="Дни" value={time.days} />
          <StatBox label="Часове" value={time.hours} />
          <StatBox label="Минути" value={time.minutes} />
          <StatBox label="Секунди" value={time.seconds} />
        </ul>
        <div className="text-center mt-4">
          <Button asChild>
            <Link href="/search">Разгледайте продуктите</Link>
          </Button>
        </div>
      </div>

      <div className="flex justify-center items-center mt-4 md:mt-0">
        <Image alt="promotion" width={300} height={200} src={deal.image} />
      </div>
    </section>
  );
};

const StatBox = ({ label, value }: { label: string; value: number }) => (
  <li className="p-4 w-full text-center bg-gray-100 rounded-lg">
    <p className="text-3xl font-bold">{value}</p>
    <p className="text-sm">{label}</p>
  </li>
);

export default ProductPromotion;
