"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useQuizStore } from "@/store/quizStore";
import questionsData from "@/data/questions.json";
import { useMemo, useCallback, useState } from "react";

/* ===== Прогресс-бар — Axis Load Meter ===== */
function AxisProgressBar({
    current,
    total,
    label,
}: {
    current: number;
    total: number;
    label: string;
}) {
    const pct = (current / total) * 100;
    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-1.5">
                <span className="font-mono text-[10px] sm:text-xs text-steel tracking-wider uppercase">
                    {label}
                </span>
                <span className="font-mono text-[10px] sm:text-xs text-gold">
                    {current}/{total}
                </span>
            </div>
            <div className="relative h-2 sm:h-3 bg-graphite-700 rounded-sm overflow-hidden border border-graphite-600/50">
                <div className="absolute inset-0 flex">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex-1 border-r border-graphite-600/30 last:border-r-0"
                        />
                    ))}
                </div>
                <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold-dark via-gold to-gold-light rounded-sm"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                />
                <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-20"
                    animate={{ x: ["-80px", "400px"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />
            </div>
        </div>
    );
}

/* ===== Score Badge (компактный для мобильных) ===== */
function ScoreBadge({ score, total }: { score: number; total: number }) {
    return (
        <motion.div
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-graphite-700/50 border border-graphite-600/30 rounded-lg"
            layout
        >
            <span className="font-mono text-[10px] sm:text-xs text-steel uppercase hidden sm:inline">Score</span>
            <span className="font-mono text-[10px] sm:hidden text-steel uppercase">⚡</span>
            <motion.span
                className="font-display text-base sm:text-xl font-bold text-gold"
                key={score}
                initial={{ scale: 1.3, color: "#e8c96a" }}
                animate={{ scale: 1, color: "#c8a54e" }}
                transition={{ duration: 0.3 }}
            >
                {score}
            </motion.span>
            <span className="font-mono text-[10px] sm:text-xs text-steel">/ {total}</span>
        </motion.div>
    );
}

/* ===== Промежуточный экран результата этапа ===== */
function StageResultScreen({
    stageTitle,
    stageIcon,
    score,
    total,
    passed,
    passingScore,
    onContinue,
}: {
    stageTitle: string;
    stageIcon: string;
    score: number;
    total: number;
    passed: boolean;
    passingScore: number;
    onContinue: () => void;
}) {
    const pct = Math.round((score / total) * 100);
    return (
        <div className="min-h-screen flex items-center justify-center bg-cnc-grid px-4 py-8">
            <motion.div
                className="max-w-md w-full text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Иконка результата */}
                <motion.div
                    className="text-6xl sm:text-7xl mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                    {passed ? "✅" : "🔄"}
                </motion.div>

                {/* Статус */}
                <motion.h2
                    className={`font-display text-2xl sm:text-3xl font-bold mb-2 ${passed ? "text-green-400" : "text-gold"}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {passed ? "Этап пройден!" : "Попробуйте ещё раз"}
                </motion.h2>

                <motion.p
                    className="text-steel text-sm sm:text-base mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    {passed
                        ? `Уровень «${stageTitle}» пройден. Следующий этап разблокирован.`
                        : `Для прохождения нужно ${passingScore}/${total} правильных ответов.`}
                </motion.p>

                {/* Карточка баллов */}
                <motion.div
                    className="card-glass mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="flex items-center justify-center gap-4 mb-3">
                        <span className="text-3xl">{stageIcon}</span>
                        <span className="font-display text-lg font-bold text-white">{stageTitle}</span>
                    </div>
                    <div className={`font-display text-5xl sm:text-6xl font-bold mb-1 ${passed ? "text-green-400" : "text-red-400"}`}>
                        {score}/{total}
                    </div>
                    <div className="text-steel text-sm font-mono">{pct}% правильных ответов</div>
                </motion.div>

                {/* Кнопка продолжить */}
                <motion.button
                    className="btn-metal w-full text-sm sm:text-base cursor-pointer"
                    onClick={onContinue}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    {passed ? "Продолжить →" : "К выбору этапов"}
                </motion.button>
            </motion.div>
        </div>
    );
}

/* ===== Селектор этапов (мобильная адаптация) ===== */
function StageSelector() {
    const { currentStage, setStage, unlockedStages, stageResults, setScreen, startQuiz } =
        useQuizStore();

    const stages = questionsData.stages;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-cnc-grid px-3 sm:px-4 py-6">
            <motion.div
                className="max-w-3xl w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Кнопка назад */}
                <motion.button
                    className="mb-4 sm:mb-8 text-steel hover:text-gold transition-colors font-mono text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
                    onClick={() => setScreen("landing")}
                    whileHover={{ x: -5 }}
                >
                    ← Главная
                </motion.button>

                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
                    Выберите <span className="text-gold-gradient">этап</span>
                </h2>
                <p className="text-steel text-xs sm:text-sm mb-6 sm:mb-10 font-body">
                    Пройдите все этапы последовательно для получения сертификата
                </p>

                <div className="flex flex-col gap-3 sm:gap-5">
                    {stages.map((stage, i) => {
                        const unlocked = unlockedStages.includes(stage.id);
                        const result = stageResults[stage.id];
                        const isCurrent = currentStage === stage.id;

                        return (
                            <motion.div
                                key={stage.id}
                                className={`card-glass flex items-center gap-3 sm:gap-5 cursor-pointer ${!unlocked ? "opacity-40 pointer-events-none" : ""
                                    } ${isCurrent ? "border-gold/40 shadow-glow" : ""}`}
                                onClick={() => {
                                    if (unlocked) startQuiz(stage.id);
                                }}
                                whileHover={unlocked ? { scale: 1.02, borderColor: "rgba(200,165,78,0.5)" } : {}}
                                whileTap={unlocked ? { scale: 0.98 } : {}}
                                initial={{ x: -30, opacity: 0 }}
                                animate={{ x: 0, opacity: unlocked ? 1 : 0.4 }}
                                transition={{ delay: i * 0.15, duration: 0.5 }}
                            >
                                {/* Иконка */}
                                <div className="flex-shrink-0 w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center bg-graphite-700 border border-graphite-600/50 rounded-lg">
                                    <span className="text-lg sm:text-2xl">{stage.icon}</span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 sm:gap-3 mb-0.5 sm:mb-1 flex-wrap">
                                        <span className="font-display font-bold text-sm sm:text-lg text-white">
                                            {stage.title}
                                        </span>
                                        <span className="text-steel text-xs sm:text-sm font-mono hidden sm:inline">
                                            — {stage.subtitle}
                                        </span>
                                    </div>
                                    <p className="text-steel text-xs sm:text-sm font-body truncate">
                                        {stage.description}
                                    </p>
                                    <p className="text-steel/50 text-[10px] sm:text-xs font-mono mt-0.5 sm:mt-1">
                                        {stage.questions.length} вопросов · проходной:{" "}
                                        {stage.passingScore}/{stage.questions.length}
                                    </p>
                                </div>

                                {/* Статус */}
                                <div className="flex-shrink-0 text-right">
                                    {result ? (
                                        <div>
                                            <div
                                                className={`font-display font-bold text-sm sm:text-lg ${result.passed ? "text-green-400" : "text-red-400"
                                                    }`}
                                            >
                                                {result.score}/{result.total}
                                            </div>
                                            <div
                                                className={`text-[10px] sm:text-xs font-mono ${result.passed ? "text-green-400/60" : "text-red-400/60"
                                                    }`}
                                            >
                                                {result.passed ? "✓" : "✗"}
                                            </div>
                                        </div>
                                    ) : unlocked ? (
                                        <span className="text-gold font-mono text-xs sm:text-sm">НАЧАТЬ →</span>
                                    ) : (
                                        <span className="text-steel/30 font-mono text-[10px] sm:text-xs">
                                            🔒
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Кнопка "Результаты" — если все этапы пройдены */}
                {Object.keys(stageResults).length === 3 && (
                    <motion.button
                        className="btn-metal w-full mt-6 sm:mt-8 text-center text-sm sm:text-base cursor-pointer"
                        onClick={() => setScreen("result")}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        Посмотреть финальный результат
                    </motion.button>
                )}
            </motion.div>
        </div>
    );
}

/* ===== Основной компонент — вопросы (с мобильной адаптацией) ===== */
function QuestionView() {
    const {
        currentStage,
        currentQuestionIndex,
        answers,
        setAnswer,
        showExplanation,
        setShowExplanation,
        nextQuestion,
        setStageResult,
        unlockStage,
        setScreen,
        stageResults,
        stopQuiz,
    } = useQuizStore();

    /* Промежуточный экран результата */
    const [stageEndInfo, setStageEndInfo] = useState<{
        score: number;
        total: number;
        passed: boolean;
    } | null>(null);

    const stage = questionsData.stages[currentStage - 1];
    const questions = stage.questions;
    const question = questions[currentQuestionIndex];
    const selectedAnswer = answers[currentStage]?.[currentQuestionIndex];
    const isLast = currentQuestionIndex === questions.length - 1;

    /* Подсчёт текущего балла этапа */
    const currentScore = useMemo(() => {
        const stageAnswers = answers[currentStage] || {};
        return Object.entries(stageAnswers).reduce((sum, [qIdx, ans]) => {
            const q = questions[Number(qIdx)];
            return sum + (q && ans === q.correctAnswer ? 1 : 0);
        }, 0);
    }, [answers, currentStage, questions]);

    /* Обработка ответа */
    const handleAnswer = useCallback(
        (optionIndex: number) => {
            if (selectedAnswer !== undefined) return;
            setAnswer(currentStage, currentQuestionIndex, optionIndex);
            setShowExplanation(true);
        },
        [selectedAnswer, currentStage, currentQuestionIndex, setAnswer, setShowExplanation]
    );

    /* Следующий вопрос / завершение этапа */
    const handleNext = useCallback(() => {
        if (isLast) {
            // Подсчёт финального балла
            const stageAnswers = answers[currentStage] || {};
            let score = 0;
            questions.forEach((q, idx) => {
                if (stageAnswers[idx] === q.correctAnswer) score++;
            });

            const passed = score >= stage.passingScore;
            setStageResult(currentStage, {
                score,
                total: questions.length,
                passed,
            });

            if (passed && currentStage < 3) {
                unlockStage(currentStage + 1);
            }

            // Показываем промежуточный экран
            setStageEndInfo({ score, total: questions.length, passed });
        } else {
            nextQuestion();
        }
    }, [isLast, answers, currentStage, questions, stage.passingScore, setStageResult, unlockStage, nextQuestion]);

    /* Обработка перехода после промежуточного экрана */
    const handleStageEndContinue = useCallback(() => {
        const allResults = { ...stageResults, [currentStage]: stageEndInfo };
        if (Object.keys(allResults).length === 3) {
            stopQuiz();
            setScreen("result");
        } else {
            stopQuiz();
        }
    }, [stageResults, currentStage, stageEndInfo, stopQuiz, setScreen]);

    /* Промежуточный экран результата этапа */
    if (stageEndInfo) {
        return (
            <StageResultScreen
                stageTitle={stage.title}
                stageIcon={stage.icon}
                score={stageEndInfo.score}
                total={stageEndInfo.total}
                passed={stageEndInfo.passed}
                passingScore={stage.passingScore}
                onContinue={handleStageEndContinue}
            />
        );
    }

    if (!question) return null;

    return (
        <div className="min-h-screen flex flex-col bg-cnc-grid">
            {/* Верхняя панель — инфо, баллы, прогресс */}
            <div className="sticky top-0 z-20 bg-graphite-900/90 backdrop-blur-md border-b border-graphite-600/30 px-3 sm:px-4 py-2.5 sm:py-4">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <span className="text-base sm:text-xl">{stage.icon}</span>
                            <div>
                                <span className="font-display font-bold text-white text-xs sm:text-sm">
                                    {stage.title}
                                </span>
                                <span className="text-steel text-[10px] sm:text-xs font-mono ml-1.5 sm:ml-2">
                                    Этап {currentStage}/3
                                </span>
                            </div>
                        </div>
                        <ScoreBadge score={currentScore} total={questions.length} />
                    </div>
                    <AxisProgressBar
                        current={currentQuestionIndex + 1}
                        total={questions.length}
                        label="Прогресс"
                    />
                </div>
            </div>

            {/* Вопрос и варианты */}
            <div className="flex-1 flex items-start sm:items-center justify-center px-3 sm:px-4 py-4 sm:py-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={question.id}
                        className="max-w-3xl w-full"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Номер вопроса */}
                        <motion.div
                            className="font-mono text-gold/40 text-[10px] sm:text-sm mb-2 sm:mb-3 tracking-wider"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            ВОПРОС {currentQuestionIndex + 1} / {questions.length}
                        </motion.div>

                        {/* Текст вопроса */}
                        <motion.h3
                            className="text-base sm:text-xl md:text-2xl font-body font-semibold text-white mb-4 sm:mb-8 leading-relaxed"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                        >
                            {question.question}
                        </motion.h3>

                        {/* Варианты ответов */}
                        <div className="flex flex-col gap-2 sm:gap-3">
                            {question.options.map((option, idx) => {
                                const isSelected = selectedAnswer === idx;
                                const isCorrect = idx === question.correctAnswer;
                                const showResult = showExplanation;

                                let borderColor = "border-graphite-600/30";
                                let bgColor = "bg-graphite-800/40";
                                let textColor = "text-white";

                                if (showResult) {
                                    if (isCorrect) {
                                        borderColor = "border-green-500/60";
                                        bgColor = "bg-green-500/10";
                                        textColor = "text-green-400";
                                    } else if (isSelected && !isCorrect) {
                                        borderColor = "border-red-500/60";
                                        bgColor = "bg-red-500/10";
                                        textColor = "text-red-400";
                                    } else {
                                        borderColor = "border-graphite-600/20";
                                        bgColor = "bg-graphite-800/20";
                                        textColor = "text-steel/50";
                                    }
                                }

                                return (
                                    <motion.button
                                        key={idx}
                                        className={`flex items-start gap-2.5 sm:gap-4 w-full text-left px-3 sm:px-5 py-2.5 sm:py-4 rounded-lg border ${borderColor} ${bgColor} transition-all duration-200 cursor-pointer ${!showResult
                                            ? "hover:border-gold/40 hover:bg-graphite-700/40"
                                            : ""
                                            }`}
                                        onClick={() => handleAnswer(idx)}
                                        disabled={showExplanation}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + idx * 0.08 }}
                                        whileHover={!showResult ? { scale: 1.01 } : {}}
                                        whileTap={!showResult ? { scale: 0.99 } : {}}
                                    >
                                        {/* Буква варианта */}
                                        <span
                                            className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-md font-mono font-bold text-xs sm:text-sm ${showResult && isCorrect
                                                ? "bg-green-500/20 text-green-400"
                                                : showResult && isSelected && !isCorrect
                                                    ? "bg-red-500/20 text-red-400"
                                                    : "bg-graphite-700 text-gold"
                                                }`}
                                        >
                                            {String.fromCharCode(65 + idx)}
                                        </span>
                                        <span className={`font-body text-xs sm:text-base ${textColor} pt-0.5`}>
                                            {option}
                                        </span>
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* ===== ПОЯСНЕНИЕ — стильное, с подсветкой и заметное ===== */}
                        <AnimatePresence>
                            {showExplanation && (
                                <motion.div
                                    className="mt-4 sm:mt-6 relative"
                                    initial={{ opacity: 0, y: 15, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                >
                                    {/* Внешнее свечение — glow-эффект */}
                                    <div className="absolute -inset-1 bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20 rounded-xl blur-md" />

                                    <div className="relative p-4 sm:p-5 rounded-xl bg-gradient-to-br from-graphite-700/60 via-graphite-800/80 to-graphite-700/60 border border-gold/30 shadow-[0_0_20px_rgba(200,165,78,0.15)]">
                                        {/* Заголовок пояснения */}
                                        <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                            <div className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full bg-gold/20">
                                                <span className="text-sm sm:text-base">💡</span>
                                            </div>
                                            <span className="font-display text-xs sm:text-sm text-gold font-bold uppercase tracking-wider">
                                                Пояснение
                                            </span>
                                            {/* Индикатор правильности */}
                                            <span className={`ml-auto text-[10px] sm:text-xs font-mono px-2 py-0.5 rounded-full ${selectedAnswer === question.correctAnswer
                                                ? "bg-green-500/20 text-green-400"
                                                : "bg-red-500/20 text-red-400"
                                                }`}>
                                                {selectedAnswer === question.correctAnswer ? "✓ Верно" : "✗ Неверно"}
                                            </span>
                                        </div>

                                        {/* Текст пояснения */}
                                        <p className="text-steel-light text-xs sm:text-sm font-body leading-relaxed">
                                            {question.explanation}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Кнопка "Далее" */}
                        <AnimatePresence>
                            {showExplanation && (
                                <motion.div
                                    className="mt-4 sm:mt-6 flex justify-end pb-4"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <motion.button
                                        className="btn-metal px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm cursor-pointer"
                                        onClick={handleNext}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        {isLast ? "Завершить этап" : "Следующий вопрос →"}
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

/* ===== Главный экспорт ===== */
export default function QuizEngine() {
    const { quizActive } = useQuizStore();

    if (!quizActive) {
        return <StageSelector />;
    }

    return <QuestionView />;
}
