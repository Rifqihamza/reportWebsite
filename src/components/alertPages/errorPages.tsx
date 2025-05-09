const ErrorPages = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8  ">
            <div className="bg-white max-w-3xl w-full rounded-lg shadow-md p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <img
                        src="/img/error404.jpg"
                        className="w-40 sm:w-60 md:w-72 lg:w-80 h-auto object-contain mx-auto"
                        alt="404 Illustration"
                    />
                    <div className="space-y-4 flex flex-col justify-between py-3">
                        <div className="text-center lg:text-left ">
                            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-800">
                                <span className="text-red-500">Oops!</span> Page Not Found
                            </h2>
                            <p className="text-gray-600 text-sm sm:text-base">
                                Halaman yang kamu tuju tidak bisa ditemukan. Mungkin sudah dipindahkan,
                                dihapus, atau URL-nya salah. Yuk, kembali ke beranda dan mulai lagi!
                            </p>
                        </div>
                        <div className="pt-2">
                            <button
                                className="w-full uppercase tracking-[2px] font-bold px-3 py-2 bg-[#7FA1C3] -translate-y-[10px] [box-shadow:0_10px_0_#E2DAD6] active:[box-shadow:0_5px_0_#E2DAD6] active:-translate-y-[5px] text-white rounded-xl">Kembali Ke Beranda</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ErrorPages;