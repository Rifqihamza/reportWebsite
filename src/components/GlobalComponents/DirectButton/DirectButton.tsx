interface propsBtn {
    label: string;
}

export default function DirectButton({ label }: propsBtn) {
    const handleRedirect = () => {
        window.location.href = "/loginPage"
    }
    return <button onClick={handleRedirect} className="bg-(--theme-bg-accent) border-(--theme-bg-accent) border-1 text-(--theme-text-alt) px-4 py-2 rounded-2xl cursor-pointer duration-200 hover:bg-transparent hover:text-(--theme-text) hover:border-(--theme-text) hover:px-8">{label}</button>
}