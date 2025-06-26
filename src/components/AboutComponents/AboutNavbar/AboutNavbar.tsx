import DirectButton from "../../GlobalComponents/DirectButton/DirectButton";

export default function AboutNavbar() {
  return <>
    <nav className="fixed top-0 w-full py-4 px-6 bg-white shadow shadow-gray-200 flex flex-row z-100 items-center justify-between gap-2">
      <a className="text-2xl font-thin tracking-wide cursor-pointer" href="#">E-LAPOR</a>
      <DirectButton label="Login"/>
    </nav>
  </>;
}