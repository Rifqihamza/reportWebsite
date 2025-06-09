import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeProps {
    onFinish: () => void;
}

export default function WelcomeComponent({ onFinish }: WelcomeProps) {
    const [step, setStep] = useState<0 | 1 | 2 | 3>(0);

    const campusBtn = [
        { imgCampus: "/img/logoSekolah.png", nameCampus: "MM2100" },
        { imgCampus: "/img/logoSekolah.png", nameCampus: "MM02 Pati" },
        { imgCampus: "/img/logoSekolah.png", nameCampus: "MM03 Putra Dharma" },
        { imgCampus: "/img/logoSekolah.png", nameCampus: "Asy-syarif" },
    ];

    const [showCampusOptions, setShowCampusOptions] = useState(false);

    useEffect(() => {
        const timers = [
            setTimeout(() => setStep(1), 1200),
            setTimeout(() => setStep(2), 2100),
            setTimeout(() => setStep(3), 4000),
            setTimeout(() => setShowCampusOptions(true), 5000),
        ];

        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <>
            {!showCampusOptions && (
                <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-white/10 backdrop-blur-lg text-center">
                    <AnimatePresence mode="wait">
                        {step === 0 && (
                            <motion.img
                                key="logo"
                                src="/img/logoSekolah.png"
                                alt="Logo"
                                className="md:w-1/4 w-1/2 h-auto"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.7, ease: 'easeInOut' }}
                            />
                        )}

                        {step === 2 && (
                            <motion.div
                                key="text"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 1, ease: 'easeInOut' }}
                            >
                                <div className='welcomeTitle text-center flex flex-col items-center justify-center text-white'>
                                    <h1>hello</h1>
                                    <p className='text-xl'>Welcome To Web Report</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {showCampusOptions && (
                <div className='flex flex-col items-center justify-center h-screen'>
                    <h2 className='text-2xl font-semibold mb-4'>Pilih kampus anda untuk melanjutkan.</h2>
                    <div className="flex flex-row flex-wrap justify-center items-center gap-4">
                        {campusBtn.map((campus, index) => (
                            <button
                                key={index}
                                className="px-4 py-2 text-white rounded w-60 text-lg cursor-pointer"
                                onClick={onFinish} // ✅ panggil onFinish dari prop saat kampus dipilih
                            >
                                <img src={campus.imgCampus} alt="" />
                                {campus.nameCampus}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
