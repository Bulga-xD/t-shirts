import Link from "next/link";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="wrapper flex flex-col mt-10">
      {/* TOP SIDE */}
      <div className="w-full flex flex-col md:flex-row justify-between gap-10 max-w-7xl m-auto md:px-10">
        <div className="flex flex-col gap-3 flex-grow items-center md:items-start">
          <p className="font-another-danger text-4xl">VANDALL</p>
          <div className="border border-b-gray-800 my-3 w-1/2" />
          <div className="flex flex-col gap-1 text-muted-foreground text-sm">
            <p> Делници: 10.00 - 20.00 ч.</p>
            <p> Неделя: 12.00 - 18.00 ч.</p>
            <p> Магазин: +359 123 456 789</p>
            <p> Поръчки: +359 123 456 789</p>
          </div>
          <div className="flex gap-3">
            <Link
              target="_blank"
              href="https://www.facebook.com"
              className="hover:-translate-y-1 transition-transform duration-200"
            >
              <FaFacebook className="text-blue-600" size={28} />
            </Link>
            <Link
              target="_blank"
              href="https://www.instagram.com"
              className="hover:-translate-y-1 transition-transform duration-200"
            >
              <FaInstagram className="text-pink-600" size={28} />
            </Link>
            <Link
              target="_blank"
              href="https://www.youtube.com"
              className="hover:-translate-y-1 transition-transform duration-200"
            >
              <FaYoutube className="text-red-600" size={28} />
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-end flex-grow">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold uppercase">полезно</h2>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <Link href="/about">За нас</Link>
              <Link href="/about">Политика за поверителност</Link>
              <Link href="/about">Доставка и плащане</Link>
              <Link href="/about">Замяна и връщане</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full border border-b-gray-300 my-5" />
      {/* BOTTOM SIDE SIDE */}
      <div className="wrapper max-w-7xl md:px-10 mb-5 text-sm text-muted-foreground">
        <p className="tracking-wide">
          VANDALL &copy; {new Date().getFullYear()}
          <span className="ml-5">
            Уебдизайн от{" "}
            <Link href="https://www.linkedin.com/in/chavdar-tonchev-818919235/">
              Чавдар Тончев
            </Link>
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
