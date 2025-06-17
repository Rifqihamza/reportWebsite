export default function LogoutButton({ handle_logout }: { handle_logout: () => Promise<void> }) {
    return <div className="relative group block float z-50">
        <button
            className="h-12 flex items-center overflow-hidden px-4 py-3 bg-amber-50 hover:bg-[#7FA1C3] hover:text-white fixed top-0 right-0 hover:rounded-l-xl hover:w-[6rem] w-[3rem] duration-300 cursor-pointer group"
            onClick={handle_logout}
        >
            <i className="pi pi-sign-out mr-2"></i>
            <span
                className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
                Logout
            </span>
        </button>
    </div>
}