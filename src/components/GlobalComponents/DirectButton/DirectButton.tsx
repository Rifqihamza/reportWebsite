interface propsBtn {
    label: string;
}

export default function DirectButton({ label }: propsBtn) {
    const handleRedirect = () => {
        window.location.href = "/loginPage"
    }
    return <button onClick={handleRedirect} className="bg-transparent border-white border-2 text-white px-4 py-2 rounded-2xl cursor-pointer duration-300 hover:[box-shadow:0_0_10px_2px_#DCD7C9]">{label}</button>
}