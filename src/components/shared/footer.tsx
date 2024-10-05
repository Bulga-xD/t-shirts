import { APP_NAME } from "@/lib/constants";
import Link from "next/link";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="wrapper flex flex-col items-center gap-2 sm:flex-row sm:justify-between max-w-7xl m-auto p-5 md:px-10">
      <div className="">
        {new Date().getFullYear()} {APP_NAME}. All Rights Reserved
      </div>
      <div className="flex gap-2 items-center justify-center">
        <p>Сайтът е направен от:</p>
        <Link href="https://www.linkedin.com/in/chavdar-tonchev-818919235/">
          <FaLinkedin size={24} />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
