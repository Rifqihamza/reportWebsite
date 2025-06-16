export default function AboutNavbar() {
  const handleRedirect = () => {
    window.location.href = "/loginPage";
  };
  
  return <>
    <nav className="fixed top-0 w-dvw py-8 px-6 bg-white flex flex-row z-100 items-center justify-between gap-2">
      <a className="text-2xl font-thin tracking-wide cursor-pointer" href="#">e-Lapor</a>
      <button onClick={handleRedirect} className="py-2 px-12 bg-[#1f324d] text-white overflow-hidden cursor-pointer duration-250 hover:bg-white hover:shadow-[0_0_10px_1px_#00000055] hover:text-[#1f324d]">Login</button>
    </nav>
  </>;
}