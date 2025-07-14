interface propsBtn {
    label: string;
}

export default function DirectButton({ label }: propsBtn) {
    const handleRedirect = () => {
        window.location.href = "/loginPage"
    }
    return <button onClick={handleRedirect} className="bg-transparent border-[#F2E5BF] border-2 text-white px-4 py-2 rounded-2xl cursor-pointer duration-200 hover:bg-[#F2E5BF] hover:text-[#257180]">{label}</button>
}