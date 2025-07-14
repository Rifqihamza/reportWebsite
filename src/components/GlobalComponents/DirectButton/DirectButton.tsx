interface propsBtn {
    label: string;
}

export default function DirectButton({ label }: propsBtn) {
    const handleRedirect = () => {
        window.location.href = "/loginPage"
    }
    return <button onClick={handleRedirect} className="bg-[#253149] border-[#253149] border-2 text-white px-4 py-2 rounded-2xl cursor-pointer duration-200 hover:bg-transparent hover:text-[#253149] hover:px-8">{label}</button>
}