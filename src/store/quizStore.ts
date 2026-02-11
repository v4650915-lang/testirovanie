"use client";

import { create } from "zustand";

/* === Типы === */
export interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

export interface StageResult {
    score: number;
    total: number;
    passed: boolean;
}

type AppScreen = "landing" | "quiz" | "result";

interface QuizState {
    /* Навигация */
    screen: AppScreen;
    setScreen: (screen: AppScreen) => void;

    /* Этап (1-3) */
    currentStage: number;
    setStage: (stage: number) => void;

    /* Флаг активного прохождения (true = показывать вопросы) */
    quizActive: boolean;
    startQuiz: (stage: number) => void;
    stopQuiz: () => void;

    /* Текущий вопрос в рамках этапа */
    currentQuestionIndex: number;
    setQuestionIndex: (index: number) => void;
    nextQuestion: () => void;

    /* Ответы пользователя: stageIndex -> questionIndex -> selectedOption */
    answers: Record<number, Record<number, number>>;
    setAnswer: (stage: number, questionIndex: number, option: number) => void;

    /* Результаты по этапам */
    stageResults: Record<number, StageResult>;
    setStageResult: (stage: number, result: StageResult) => void;

    /* Доступ к этапам — пройден ли предыдущий */
    unlockedStages: number[];
    unlockStage: (stage: number) => void;

    /* Общий балл */
    totalScore: () => number;
    totalQuestions: () => number;

    /* Показать пояснение */
    showExplanation: boolean;
    setShowExplanation: (show: boolean) => void;

    /* Сброс */
    reset: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
    screen: "landing",
    setScreen: (screen) => set({ screen }),

    currentStage: 1,
    setStage: (stage) => set({ currentStage: stage, currentQuestionIndex: 0, showExplanation: false }),

    quizActive: false,
    startQuiz: (stage) => set({ currentStage: stage, currentQuestionIndex: 0, showExplanation: false, quizActive: true }),
    stopQuiz: () => set({ quizActive: false }),

    currentQuestionIndex: 0,
    setQuestionIndex: (index) => set({ currentQuestionIndex: index }),
    nextQuestion: () =>
        set((state) => ({
            currentQuestionIndex: state.currentQuestionIndex + 1,
            showExplanation: false,
        })),

    answers: {},
    setAnswer: (stage, questionIndex, option) =>
        set((state) => ({
            answers: {
                ...state.answers,
                [stage]: {
                    ...(state.answers[stage] || {}),
                    [questionIndex]: option,
                },
            },
        })),

    stageResults: {},
    setStageResult: (stage, result) =>
        set((state) => ({
            stageResults: {
                ...state.stageResults,
                [stage]: result,
            },
        })),

    unlockedStages: [1],
    unlockStage: (stage) =>
        set((state) => ({
            unlockedStages: state.unlockedStages.includes(stage)
                ? state.unlockedStages
                : [...state.unlockedStages, stage],
        })),

    totalScore: () => {
        const results = get().stageResults;
        return Object.values(results).reduce((sum, r) => sum + r.score, 0);
    },

    totalQuestions: () => {
        const results = get().stageResults;
        return Object.values(results).reduce((sum, r) => sum + r.total, 0);
    },

    showExplanation: false,
    setShowExplanation: (show) => set({ showExplanation: show }),

    reset: () =>
        set({
            screen: "landing",
            currentStage: 1,
            currentQuestionIndex: 0,
            answers: {},
            stageResults: {},
            unlockedStages: [1],
            showExplanation: false,
            quizActive: false,
        }),
}));
