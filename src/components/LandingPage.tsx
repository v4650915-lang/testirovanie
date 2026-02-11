"use client";

import { motion } from "framer-motion";
import { useQuizStore } from "@/store/quizStore";

/* Анимация частиц — имитация стружки/искр */
function Particles() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-gold/30 rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.2, 0.8, 0.2],
                        scale: [1, 1.5, 1],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 4,
                        repeat: Infinity,
                        delay: Math.random() * 3,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}

/* Декоративные линии координатных осей */
function AxisLines() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Ось X */}
            <motion.div
                className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
            />
            {/* Ось Z */}
            <motion.div
                className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-gold/20 to-transparent"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 2, delay: 0.8, ease: "easeOut" }}
            />
            {/* Метки осей */}
            <motion.span
                className="absolute top-1/2 right-8 text-gold/40 font-mono text-xs -translate-y-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
            >
                X+
            </motion.span>
            <motion.span
                className="absolute top-8 left-1/2 text-gold/40 font-mono text-xs -translate-x-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2 }}
            >
                Z+
            </motion.span>
        </div>
    );
}

export default function LandingPage() {
    const setScreen = useQuizStore((s) => s.setScreen);

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-cnc-grid overflow-hidden px-4 py-8">
            <Particles />
            <AxisLines />

            {/* Основной контент */}
            <motion.div
                className="relative z-10 text-center px-2 sm:px-6 max-w-4xl w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                {/* Верхний лейбл */}
                <motion.div
                    className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 mb-4 sm:mb-8 border border-gold/20 rounded-full bg-gold/5"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gold rounded-full animate-pulse-gold" />
                    <span className="text-gold text-[10px] sm:text-sm font-mono tracking-wider uppercase">
                        Fanuc CNC Certification
                    </span>
                </motion.div>

                {/* Главный заголовок */}
                <motion.h1
                    className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-black mb-3 sm:mb-6 leading-none"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                >
                    <span className="text-gold-gradient">CNC PRO</span>
                    <br />
                    <span className="text-white/90 text-lg sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-widest">
                        PRECISION & MASTERY
                    </span>
                </motion.h1>

                {/* Подзаголовок */}
                <motion.p
                    className="text-steel-light text-sm sm:text-lg md:text-xl max-w-2xl mx-auto mb-3 sm:mb-4 font-body"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                >
                    Премиальная платформа тестирования и сертификации
                    <br className="hidden sm:block" />
                    <span className="sm:hidden"> </span>
                    специалистов ЧПУ системы FANUC
                </motion.p>

                {/* Статистика */}
                <motion.div
                    className="flex justify-center gap-4 sm:gap-8 md:gap-12 mb-6 sm:mb-10"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1, duration: 0.6 }}
                >
                    {[
                        { value: "3", label: "Этапа" },
                        { value: "45", label: "Вопросов" },
                        { value: "∞", label: "Попыток" },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className="text-xl sm:text-3xl md:text-4xl font-display font-bold text-gold">
                                {stat.value}
                            </div>
                            <div className="text-[10px] sm:text-sm text-steel font-mono uppercase tracking-wider">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Кнопка старта */}
                <motion.button
                    className="btn-metal text-sm sm:text-lg md:text-xl px-8 sm:px-12 py-3.5 sm:py-5 cursor-pointer"
                    onClick={() => setScreen("quiz")}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                >
                    Начать сертификацию
                </motion.button>

                {/* Этапы внизу */}
                <motion.div
                    className="mt-8 sm:mt-16 flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.6 }}
                >
                    {[
                        { stage: "01", title: "Оператор", desc: "G-коды, безопасность" },
                        { stage: "02", title: "Наладчик", desc: "Циклы, режимы резания" },
                        { stage: "03", title: "Эксперт", desc: "Макросы, Ось C" },
                    ].map((s, i) => (
                        <motion.div
                            key={s.stage}
                            className="card-glass flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4 sm:min-w-[220px]"
                            whileHover={{ borderColor: "rgba(200,165,78,0.4)" }}
                            transition={{ delay: 1.5 + i * 0.15 }}
                        >
                            <span className="text-2xl sm:text-3xl font-display font-black text-gold/30">
                                {s.stage}
                            </span>
                            <div className="text-left">
                                <div className="font-display font-bold text-white text-xs sm:text-sm">
                                    {s.title}
                                </div>
                                <div className="text-steel text-[10px] sm:text-xs font-mono">{s.desc}</div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>

            {/* Нижний декор — версия протокола */}
            <motion.div
                className="absolute bottom-6 left-1/2 -translate-x-1/2 text-steel/30 font-mono text-xs tracking-widest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
            >
                CNC PRO v1.0 &mdash; PROTOCOL ACTIVE
            </motion.div>
        </div>
    );
}
