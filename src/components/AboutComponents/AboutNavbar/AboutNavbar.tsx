import { useEffect, useState } from "react";

export default function AboutNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 0);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`w-full flex flex-row z-50 items-center justify-between px-6 py-4 text-white duration-500
        ${isScrolled ? 'fixed top-0 translate-0 py-5 bg-[#2B3440] backdrop-blur-xl' : 'fixed bg-transparent'}`}
      >
        <a className="text-md md:text-2xl font-normal tracking-wide cursor-pointer" href="#">E-LAPOR</a>
        <button onClick={() => { window.location.href = "/loginPage" }}
          className={`cursor-pointer text-sm md:text-md uppercase tracking-wider hover:text-white font-normal ${isScrolled ? 'bg-[#F97316] hover:bg-[#374151]' : 'bg-transparent hover:bg-[#F97316]'} py-1 px-4 rounded-lg duration-300 transition-colors`}>Lapor</button>
      </nav>
    </>
  );
}
