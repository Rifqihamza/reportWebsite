export default function ThanksComponent() {
    return (
        <>
            <section>
                <div className="fixed inset-0 -translate-y-[1rem] flex items-center justify-center p-4">
                    <div className="bg-neutral-200 shadow shadow-gray-600 w-full max-w-3xl h-fit p-6 rounded-xl space-y-4 relative">
                        <h1 className="font-bold uppercase text-xl text-white bg-[#7FA1C3] px-4 py-3 rounded-xl text-center">Terima Kasih Telah Melapor!</h1>
                        <div className="flex flex-col-reverse md:flex-row justify-center gap-4" >
                            <div className="flex flex-col gap-4">
                                <span className="px-4 bg-[#7FA1C3] h-full rounded-xl text-justify flex flex-col gap-4 items-center justify-center">
                                    <img src="/img/logoSekolah.png" className="w-1/5 h-auto" alt="" />
                                    <p className="text-white text-lg font-medium">Kami menghargai partisipasi Anda dalam melaporkan temuan ini. Bersama kita wujudkan lingkungan yang lebih baik.</p>
                                </span>
                                <button className="px-4 py-5 bg-[#7FA1C3] text-white rounded-xl uppercase tracking-wider font-bold cursor-pointer">
                                    Selesai
                                </button>
                            </div>
                            <img src="/img/9086589-removebg-preview.png" className="md:w-1/2 w-full px-4 py-2 bg-[#7FA1C3] h-full mx-auto rounded-xl" alt="" />
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}