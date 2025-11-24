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
    <nav
      className={`w-full fixed top-0 z-50 flex flex-row items-center justify-between px-6 py-4 md:py-4 transition-all duration-500 bg-black/50 backdrop-blur-xs`}
    >
      {/* Logo */}
      <a
        href="#"
        className="text-md md:text-2xl font-semibold tracking-wide flex items-center gap-2"
      >
        <img src="/img/logoSekolah.png" className="w-8 h-8" alt="Logo Sekolah" />
        E-LAPOR
      </a>

      {/* Login Button */}
      <button
        onClick={() => (window.location.href = "/loginPage")}
        className="cursor-pointer text-sm md:text-md uppercase tracking-wider font-medium flex items-center gap-2 border-2 border-(--primary) text-white bg-[var(--primary)] hover:text-white hover:bg-transparent hover:border-white transition-all duration-300 rounded-lg px-3 md:px-4 py-1.5"
      >
        <i className="pi pi-sign-in"></i>
        Login
      </button>
    </nav>
  );
}
