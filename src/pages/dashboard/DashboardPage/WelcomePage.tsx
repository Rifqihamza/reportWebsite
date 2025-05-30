export default function WelcomePage() {
    return (
        <div className="flex flex-col items-center justify-center space-y-2 h-full relative text-center">
            <div className="fixed top-1/4">
                <h1 className="text-4xl tracking-wide font-bold text-[#6096B4]">Hai Dears!,</h1>
                <p className="text-xl tracking-wide font-medium text-[#93BFCF]">Welcome To Admin Dashbord</p>
            </div>
            <div className="flex items-center justify-center fixed bottom-0">
                <img src="/img/wavePerson.png" className="w-[30rem]" alt="" />
            </div>
        </div>
    )
}