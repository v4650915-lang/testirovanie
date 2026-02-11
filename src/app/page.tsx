"use client";

import { useQuizStore } from "@/store/quizStore";
import LandingPage from "@/components/LandingPage";
import QuizEngine from "@/components/QuizEngine";
import ResultPage from "@/components/ResultPage";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
    const screen = useQuizStore((s) => s.screen);

    return (
        <main className="min-h-screen">
            <AnimatePresence mode="wait">
                {screen === "landing" && (
                    <motion.div
                        key="landing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <LandingPage />
                    </motion.div>
                )}
                {screen === "quiz" && (
                    <motion.div
                        key="quiz"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <QuizEngine />
                    </motion.div>
                )}
                {screen === "result" && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <ResultPage />
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
