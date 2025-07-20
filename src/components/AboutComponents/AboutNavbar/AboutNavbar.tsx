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
        className={`w-full flex flex-row z-50 items-center justify-between gap-2
        transition-all duration-500 ease-in-out transform bg-(--theme-bg) text-(--theme-text) px-6
        ${isScrolled ? 'fixed top-0 shadow-(--theme-shadow) translate-0 py-4' : 'relative shadow-gray-200 py-2'}`}
      >
        <a className="text-2xl font-thin tracking-wide cursor-pointer" href="#">E-LAPOR</a>
        <button onClick={() => { window.location.href = "/loginPage" }} className="cursor-pointer font-extralight md:text-lg text-xl uppercase tracking-wider hover:bg-slate-900 hover:text-white py-2 px-4 rounded-lg duration-300 transition-colors">Login</button>
      </nav>
    </> 
  );
}
