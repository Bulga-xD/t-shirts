import Link from "next/link";
import { FaLinkedin } from "react-icons/fa";

const DeveloperContacts = () => {
  return (
    <div className="flex gap-2 items-center justify-center">
      <p>Сайтът е направен от:</p>
      <Link href="https://www.linkedin.com/in/chavdar-tonchev-818919235/">
        <FaLinkedin size={24} />
      </Link>
    </div>
  );
};
export default DeveloperContacts;
