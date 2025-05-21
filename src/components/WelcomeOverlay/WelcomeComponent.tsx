import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeComponentProps {
    onFinish: () => void;
}

export default function WelcomeComponent({ onFinish }: WelcomeComponentProps) {
    const [step, setStep] = useState<0 | 1 | 2 | 3>(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setStep(1), 2000), // Logo fade out
            setTimeout(() => setStep(2), 3000), // Text fade in
            setTimeout(() => setStep(3), 6000), // Text fade out
            setTimeout(() => onFinish(), 8000)  // Finish
        ];

        return () => timers.forEach(clearTimeout);
    }, [onFinish]);

    return (
        <div className="flex translate-y-[10rem] flex-col items-center justify-center h-full text-center">
            <AnimatePresence mode="wait">
                {step === 0 && (
                    <motion.img
                        key="logo"
                        src="/public/img/logoSekolah.png"
                        alt="Logo"
                        className="md:w-1/4 w-1/2 h-auto"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 2, ease: 'easeInOut' }}
                    />
                )}

                {step === 2 && (
                    <motion.div
                        key="text"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 2, ease: 'easeInOut' }}
                    >
                        <div className='flex flex-col items-center justify-center bg-white rounded-xl px-8 py-6 translate-y-[8rem]'>
                            <h1 className="text-3xl mt-4">Halo, Selamat datang di</h1>
                            <p className="text-xl mt-2">Web Report Site</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
