import { navLinks } from "@/app/lib/constants";
import Link from "next/link";

export default function Header() {
  return (
    <div className="py-6 px-23">
      <div className="flex flex-row justify-between items-center">
        <HeaderLogo />
        <div className="flex md:flex-row gap-12 caption-text tracking-wider">
          {navLinks.map((x, index) => (
            <Link 
            key={index} 
            href={x.link}
            className="border-b border-b-transparent hover:border-b-neutral-300 hover:text-neutral-300 transition-all duration-300 hover:cursor-pointer"
            >
              {x.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

const HeaderLogo = () => {
  return <h4 className="font-playfair text-3xl italic text-neutral-100 hover:cursor-pointer">MF</h4>;
};
