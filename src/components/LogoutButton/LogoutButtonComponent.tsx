import { AccountType, type User } from "../../types/variables";

export default function LogoutButton({ userData, handle_logout }: { userData: User | null, handle_logout: () => Promise<void> }) {
    return <div className="relative group md:block hidden float">
        <button
            className="flex items-center overflow-hidden px-4 py-3 bg-white hover:bg-[#7FA1C3] hover:text-white rounded-bl-xl fixed top-0 right-0 hover:w-[6rem] w-[3rem] duration-300 cursor-pointer group"
            onClick={handle_logout}
        >
            <i className="pi pi-sign-out mr-2"></i>
            <span
                className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
                {(!userData || userData.role == AccountType.Siswa) ? "Login" : "Logout"}
            </span>
        </button>
    </div>
}