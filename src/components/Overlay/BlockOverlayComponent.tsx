export default function OverlayBlockPages() {
    const btnToLogin = () => {
        window.location.href = "/loginPage";
    }
    return (
        <div className="flex flex-col md:flex-row items-center justify-center w-full md:h-full h-fit bg-white space-y-2 rounded-xl">
            <img src="/img/lockedPages.svg" className="w-[15rem] md:w-1/4 " alt="Blocked Image" />
            <div className="md:w-1/3 w-fit px-6 py-2 space-y-4">
                <h1 className="md:text-2xl text-xl font-bold tracking-wide">Uppsss..</h1>
                <p className="text-justify text-lg">Wahh halaman terkunci, Login terlebih dahulu untuk membuka halaman. Klik tombol dibawah</p>
                <button
                    onClick={btnToLogin}
                    className="w-full bg-[#7FA1C3] text-white uppercase font-bold tracking-wider px-6 py-2 rounded-lg hover:bg-[#6FA9E3] duration-300 cursor-pointer">Login</button>
            </div>
        </div>
    )
}