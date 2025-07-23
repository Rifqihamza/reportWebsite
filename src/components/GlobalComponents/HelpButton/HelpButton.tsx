export default function HelpButton() {
  const handleGotoHelp = () => {
    window.location.href = "/"
  }

  return <>
    <button className="w-10 h-10 flex justify-center items-center aspect-square rounded-full bg-[#DCD7C9] hover:ring-6 hover:ring-[#A27B5C] duration-300 absolute top-5 left-5 cursor-pointer z-100" onClick={handleGotoHelp}>
      <i className="pi pi-question-circle text-[#A27B5C] text-3xl!"></i>
    </button>
  </>
}