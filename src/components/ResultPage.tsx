"use client";

import { motion } from "framer-motion";
import { useQuizStore } from "@/store/quizStore";
import questionsData from "@/data/questions.json";
import { useMemo, useRef } from "react";

/* Круговой индикатор процента */
function CircleProgress({
    percentage,
    size = 140,
    strokeWidth = 6,
}: {
    percentage: number;
    size?: number;
    strokeWidth?: number;
}) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg
                width={size}
                height={size}
                className="transform -rotate-90"
            >
                {/* Фоновый круг */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="rgba(45,45,61,0.5)"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Прогресс */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="url(#goldGradient)"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                />
                <defs>
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a6852e" />
                        <stop offset="50%" stopColor="#e8c96a" />
                        <stop offset="100%" stopColor="#c8a54e" />
                    </linearGradient>
                </defs>
            </svg>
            {/* Процент в центре */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                    className="font-display text-2xl sm:text-4xl font-black text-gold"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5, type: "spring" }}
                >
                    {percentage}%
                </motion.span>
                <span className="font-mono text-[10px] sm:text-xs text-steel uppercase tracking-wider">
                    Accuracy
                </span>
            </div>
        </div>
    );
}

/* ===== Круглая печать «Одобрено Токарная обработка ЧПУ 👌» ===== */
function StampSeal({ size = 130 }: { size?: number }) {
    const r = size / 2;
    const textR = r * 0.72;

    return (
        <motion.div
            className="relative"
            style={{ width: size, height: size }}
            initial={{ scale: 2.5, opacity: 0, rotate: -25 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{
                delay: 1.6,
                duration: 0.25,
                type: "spring",
                stiffness: 350,
                damping: 14,
            }}
        >
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="drop-shadow-[0_0_12px_rgba(200,50,50,0.25)]"
            >
                {/* Внешний круг */}
                <circle cx={r} cy={r} r={r - 4} fill="none" stroke="#c83232" strokeWidth="3" opacity="0.85" />
                {/* Второй круг */}
                <circle cx={r} cy={r} r={r - 10} fill="none" stroke="#c83232" strokeWidth="1.5" opacity="0.55" />

                {/* Текст по верхнему полукругу */}
                <defs>
                    <path id="topArc" d={`M ${r - textR},${r} A ${textR},${textR} 0 1,1 ${r + textR},${r}`} fill="none" />
                    <path id="bottomArc" d={`M ${r + textR},${r} A ${textR},${textR} 0 1,1 ${r - textR},${r}`} fill="none" />
                </defs>

                <text fill="#c83232" fontSize="9" fontWeight="bold" letterSpacing="2">
                    <textPath href="#topArc" startOffset="50%" textAnchor="middle">
                        ОДОБРЕНО
                    </textPath>
                </text>
                <text fill="#c83232" fontSize="7" fontWeight="600" letterSpacing="1">
                    <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">
                        ТОКАРНАЯ ОБРАБОТКА ЧПУ
                    </textPath>
                </text>

                {/* Центральный эмодзи */}
                <text x={r} y={r + 2} textAnchor="middle" dominantBaseline="middle" fontSize="30">👌</text>

                {/* Декоративные линии */}
                <line x1={r - 28} y1={r - 17} x2={r + 28} y2={r - 17} stroke="#c83232" strokeWidth="0.7" opacity="0.4" />
                <line x1={r - 28} y1={r + 19} x2={r + 28} y2={r + 19} stroke="#c83232" strokeWidth="0.7" opacity="0.4" />
            </svg>
        </motion.div>
    );
}

/* ===== Визуальный сертификат с печатью и разрядом ===== */
function Certificate({
    rank,
    score,
    total,
    percentage,
}: {
    rank: { title: string; description: string; icon: string; razryad?: string };
    score: number;
    total: number;
    percentage: number;
}) {
    const certRef = useRef<HTMLDivElement>(null);
    const date = new Date().toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <motion.div
            ref={certRef}
            className="relative w-full max-w-2xl mx-auto bg-gradient-to-br from-graphite-800 via-graphite-900 to-graphite-800 border-2 border-gold/30 rounded-lg overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
        >
            {/* Декоративные уголки */}
            <div className="absolute top-0 left-0 w-12 sm:w-16 h-12 sm:h-16 border-t-2 border-l-2 border-gold/50 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-12 sm:w-16 h-12 sm:h-16 border-t-2 border-r-2 border-gold/50 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-12 sm:w-16 h-12 sm:h-16 border-b-2 border-l-2 border-gold/50 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-12 sm:w-16 h-12 sm:h-16 border-b-2 border-r-2 border-gold/50 rounded-br-lg" />

            <div className="p-5 sm:p-8 md:p-12 text-center">
                {/* Логотип */}
                <motion.div
                    className="font-display text-[10px] sm:text-sm text-gold/60 tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-2 sm:mb-3"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    CNC PRO: Precision &amp; Mastery
                </motion.div>

                <div className="divider-gold my-3 sm:my-4" />

                <motion.h2
                    className="font-display text-xl sm:text-3xl md:text-4xl font-bold mb-2"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <span className="text-gold-gradient">СЕРТИФИКАТ</span>
                </motion.h2>

                <motion.p
                    className="text-steel text-xs sm:text-sm font-body mb-4 sm:mb-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    подтверждает прохождение аттестации по программе
                    <br />
                    <span className="text-white/80 font-semibold">«Токарная обработка на станках с ЧПУ FANUC»</span>
                </motion.p>

                {/* Иконка ранга */}
                <motion.div
                    className="text-4xl sm:text-6xl mb-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                >
                    {rank.icon}
                </motion.div>

                {/* Звание */}
                <motion.h3
                    className="font-display text-lg sm:text-2xl md:text-3xl font-bold text-white mb-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                >
                    {rank.title}
                </motion.h3>

                {/* Бейдж разряда */}
                {rank.razryad && (
                    <motion.div
                        className="inline-flex items-center gap-2 px-3 sm:px-5 py-1.5 sm:py-2 mb-3 sm:mb-4 border-2 border-gold/50 rounded-full bg-gold/10"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 1.0, type: "spring", stiffness: 200 }}
                    >
                        <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
                        <span className="text-gold font-display font-bold text-sm sm:text-base uppercase tracking-wider">
                            {rank.razryad}
                        </span>
                    </motion.div>
                )}

                <motion.p
                    className="text-steel-light text-xs sm:text-sm font-body mb-5 max-w-md mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                >
                    {rank.description}
                </motion.p>

                <div className="divider-gold my-4 sm:my-5" />

                {/* Статистика */}
                <motion.div
                    className="flex justify-center gap-4 sm:gap-8 mb-5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                >
                    <div className="text-center">
                        <div className="font-display text-lg sm:text-2xl font-bold text-gold">
                            {score}/{total}
                        </div>
                        <div className="font-mono text-[10px] sm:text-xs text-steel uppercase">Баллов</div>
                    </div>
                    <div className="text-center">
                        <div className="font-display text-lg sm:text-2xl font-bold text-gold">
                            {percentage}%
                        </div>
                        <div className="font-mono text-[10px] sm:text-xs text-steel uppercase">Точность</div>
                    </div>
                    <div className="text-center">
                        <div className="font-display text-lg sm:text-2xl font-bold text-gold">3/3</div>
                        <div className="font-mono text-[10px] sm:text-xs text-steel uppercase">Этапов</div>
                    </div>
                </motion.div>

                {/* Печать + дата */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-2">
                    {/* Печать «Одобрено» */}
                    <StampSeal size={120} />

                    {/* Дата и ID */}
                    <motion.div
                        className="text-center sm:text-left"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.4 }}
                    >
                        <div className="font-mono text-[10px] sm:text-xs text-steel/50 tracking-wider mb-1">
                            ДАТА ВЫДАЧИ
                        </div>
                        <div className="font-display text-xs sm:text-sm text-white/80 mb-3">
                            {date}
                        </div>
                        <div className="font-mono text-[10px] sm:text-xs text-steel/50 tracking-wider mb-1">
                            НОМЕР СЕРТИФИКАТА
                        </div>
                        <div className="font-mono text-xs sm:text-sm text-gold/60">
                            CNC-{Date.now().toString(36).toUpperCase()}
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}

export default function ResultPage() {
    const { stageResults, reset, setScreen } = useQuizStore();

    const totalScore = useMemo(() => {
        return Object.values(stageResults).reduce((sum, r) => sum + r.score, 0);
    }, [stageResults]);

    const totalQuestions = useMemo(() => {
        return Object.values(stageResults).reduce((sum, r) => sum + r.total, 0);
    }, [stageResults]);

    const percentage = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;

    /* Определение ранга / разряда */
    const rank = useMemo(() => {
        const ranks = questionsData.ranks;
        if (percentage >= 90) return ranks.master;
        if (percentage >= 70) return ranks.high;
        if (percentage >= 50) return ranks.medium;
        return ranks.low;
    }, [percentage]);

    /* Все этапы пройдены? */
    const allPassed = Object.values(stageResults).every((r) => r.passed);

    return (
        <div className="min-h-screen bg-cnc-grid flex flex-col items-center justify-center px-3 sm:px-4 py-6 sm:py-12">
            {/* Заголовок */}
            <motion.div
                className="text-center mb-6 sm:mb-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="font-mono text-[10px] sm:text-sm text-gold/60 tracking-wider uppercase mb-1 sm:mb-2">
                    Аттестация завершена
                </div>
                <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-black text-white">
                    <span className="text-gold-gradient">Результаты</span>
                </h1>
            </motion.div>

            {/* Круговой индикатор */}
            <motion.div
                className="mb-6 sm:mb-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <CircleProgress percentage={percentage} />
            </motion.div>

            {/* Результаты по этапам */}
            <motion.div
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-10 w-full max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                {questionsData.stages.map((stage, i) => {
                    const result = stageResults[stage.id];
                    if (!result) return null;

                    return (
                        <motion.div
                            key={stage.id}
                            className="flex-1 card-glass text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + i * 0.15 }}
                        >
                            <span className="text-2xl mb-2 block">{stage.icon}</span>
                            <div className="font-display font-bold text-white text-xs sm:text-sm mb-1">
                                {stage.title}
                            </div>
                            <div
                                className={`font-display text-lg sm:text-xl font-bold ${result.passed ? "text-green-400" : "text-red-400"}`}
                            >
                                {result.score}/{result.total}
                            </div>
                            <div
                                className={`font-mono text-[10px] sm:text-xs ${result.passed ? "text-green-400/60" : "text-red-400/60"}`}
                            >
                                {result.passed ? "✓ ПРОЙДЕН" : "✗ НЕ ПРОЙДЕН"}
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Мотивирующее сообщение */}
            <motion.div
                className="mb-6 sm:mb-8 max-w-xl text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                {allPassed && (
                    <div className="card-glass border-gold/30 shadow-glow p-4 sm:p-6">
                        <p className="text-gold font-display font-bold text-base sm:text-lg mb-1 sm:mb-2">
                            🏆 Поздравляем!
                        </p>
                        <p className="text-steel-light text-xs sm:text-sm font-body">
                            Все этапы пройдены. Вам присвоен квалификационный разряд
                            на основании набранных баллов.
                        </p>
                    </div>
                )}
                {!allPassed && (
                    <div className="card-glass border-red-500/20 p-4 sm:p-6">
                        <p className="text-red-400 font-display font-bold text-base sm:text-lg mb-1 sm:mb-2">
                            Аттестация не пройдена
                        </p>
                        <p className="text-steel-light text-xs sm:text-sm font-body">
                            Не все этапы пройдены успешно. Пройдите непройденные этапы
                            повторно для получения сертификата.
                        </p>
                    </div>
                )}
            </motion.div>

            {/* Сертификат — показываем только при прохождении всех этапов */}
            {allPassed && (
                <motion.div
                    className="w-full mb-8 sm:mb-10"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    <Certificate
                        rank={rank}
                        score={totalScore}
                        total={totalQuestions}
                        percentage={percentage}
                    />
                </motion.div>
            )}

            {/* Кнопки */}
            <motion.div
                className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
            >
                <motion.button
                    className="px-6 sm:px-8 py-2.5 sm:py-3 border border-steel/30 text-steel hover:text-gold hover:border-gold/30 rounded-sm font-display font-bold uppercase tracking-wider transition-all cursor-pointer text-xs sm:text-sm"
                    onClick={() => {
                        reset();
                        setScreen("landing");
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                >
                    Начать заново
                </motion.button>
                <motion.button
                    className="px-6 sm:px-8 py-2.5 sm:py-3 border border-steel/30 text-steel hover:text-gold hover:border-gold/30 rounded-sm font-display font-bold uppercase tracking-wider transition-all cursor-pointer text-xs sm:text-sm"
                    onClick={() => setScreen("quiz")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                >
                    К этапам
                </motion.button>
            </motion.div>

            {/* Футер */}
            <motion.div
                className="mt-8 sm:mt-12 text-steel/30 font-mono text-[10px] sm:text-xs tracking-widest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
            >
                CNC PRO v1.0 — CERTIFICATION COMPLETE
            </motion.div>
        </div>
    );
}
