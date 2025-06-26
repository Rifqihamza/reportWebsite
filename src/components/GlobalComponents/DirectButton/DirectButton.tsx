interface propsBtn {
    label: string;
}

export default function DirectButton({ label }: propsBtn) {
    const handleRedirect = () => {
        window.location.href = "/loginPage"
    }
    return <button onClick={handleRedirect} className="cursor-pointer border px-4 py-2 rounded-xl hover:bg-[#1f324d] hover:text-white duration-300 text-xs md:text-lg">{label}</button>
}