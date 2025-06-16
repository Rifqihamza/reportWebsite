export default function HelpButton() {
  const handleGotoHelp = () => {
    window.location.href = "/"
  }
  
  return <>
    <button className="w-10 h-10 flex justify-center items-center aspect-square rounded-full bg-white absolute top-5 left-5 cursor-pointer z-100" onClick={handleGotoHelp}>
      <i className="pi pi-question-circle text-[#1f324d] text-3xl!"></i>
    </button>
  </>
}