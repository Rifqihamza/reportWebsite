interface propsBtn {
    label: string;
}

export default function DirectButton({ label }: propsBtn) {
    const handleRedirect = () => {
        window.location.href = "/loginPage"
    }
    return <button onClick={handleRedirect} className="px-4 py-2 rounded-2xl cursor-pointer text-white border border-white hover:[box-shadow:0_0_5px_2px_#F2E5BF] hover:border-[#F2E5BF] hover:text-[#F2E5BF] duration-400">{label}</button>
}