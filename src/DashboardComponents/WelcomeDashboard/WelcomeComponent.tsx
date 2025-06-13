export default function WelcomeComponent() {
    return (
        <div className="h-full w-full bg-white rounded-2xl relative">
            <div className="flex flex-col items-center justify-center space-y-2 h-full text-center">
                <div className="fixed top-1/4">
                    <h1 className="text-4xl tracking-wide font-bold text-[#1f324d]">Hi Dears!,</h1>
                        <p className="text-xl tracking-wide font-medium text-[#234c85]">Welcome To Admin Dashbord</p>
                </div>
                <div className="flex items-center justify-center absolute bottom-0">
                    <img src="/img/wavePerson.png" className="w-[20rem]" alt="" />
                </div>
            </div>
        </div>
    )
}