export default function HelpButton() {
  const handleGotoHelp = () => {
    window.location.href = "/"
  }

  return <>
    <button className="w-10 h-10 flex justify-center items-center aspect-square rounded-full bg-[#CB6040] hover:ring-6 hover:ring-[#F2E5BF] duration-300 fixed top-5 left-5 cursor-pointer z-100" onClick={handleGotoHelp}>
      <i className="pi pi-question-circle text-[#F2E5BF] text-3xl!"></i>
    </button>
  </>
}