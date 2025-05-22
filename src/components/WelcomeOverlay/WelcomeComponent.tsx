import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
interface WelcomeComponentProps {
    onFinish: () => void;
}

export default function WelcomeComponent({ onFinish }: WelcomeComponentProps) {
    const [step, setStep] = useState<0 | 1 | 2 | 3>(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setStep(1), 1200), // Logo fade out
            setTimeout(() => setStep(2), 2100), // Text fade in
            setTimeout(() => setStep(3), 4000), // Text fade out
            setTimeout(() => onFinish(), 5000)  // Finish
        ];

        return () => timers.forEach(clearTimeout);
    }, [onFinish]);

    return (
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
    );
}
