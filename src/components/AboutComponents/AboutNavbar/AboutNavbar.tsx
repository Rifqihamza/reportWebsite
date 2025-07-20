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
        className={`w-full flex flex-row z-50 items-center justify-between px-6 py-4 text-[#F2E5BF]
        ${isScrolled ? 'fixed top-0 bg-white/5 backdrop-blur-3xl shadow shadow-gray-200 translate-0 py-5 duration-500' : 'fixed bg-transparent duration-200'}`}
      >
        <a className="text-2xl font-normal tracking-wide cursor-pointer" href="#">E-LAPOR</a>
        <button onClick={() => { window.location.href = "/loginPage" }} className="cursor-pointer font-normal text-md uppercase tracking-wider hover:shadow hover:shadow-white font-normal py-1 px-4 rounded-lg duration-300">Lapor</button>
      </nav>
    </>
  );
}
