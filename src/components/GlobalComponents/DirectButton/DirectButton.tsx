interface propsBtn {
    label: string;
}

export default function DirectButton({ label }: propsBtn) {
    const handleRedirect = () => {
        window.location.href = "/loginPage"
    }
    return <button onClick={handleRedirect} className="cursor-pointer uppercase tracking-wide px-3 py-1 rounded-xl bg-[var(--primary)] border border-[var(--primary)] text-white hover:bg-transparent hover:border-white duration-300">{label}</button>
}