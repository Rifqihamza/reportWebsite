export default function AboutNavbar() {
  const handleRedirect = () => {
    window.location.href = "/loginPage";
  };
  
  return <>
    <nav className="sticky md:fixed top-0 w-dvw py-4  px-6 bg-white shadow shadow-gray-200 flex flex-row z-100 items-center justify-between gap-2">
      <a className="text-2xl font-thin tracking-wide cursor-pointer" href="#">E-LAPOR</a>
      <button onClick={handleRedirect} className="rounded-lg py-2 px-12 bg-[#1f324d] text-white overflow-hidden cursor-pointer duration-250 hover:bg-white hover:shadow-lg hover:text-[#1f324d]">Login</button>
    </nav>
  </>;
}