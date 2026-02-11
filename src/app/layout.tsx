import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "CNC PRO: Precision & Mastery — Сертификация специалистов ЧПУ",
    description:
        "Премиальная платформа тестирования и сертификации специалистов ЧПУ Fanuc. Проверь свои знания G-кодов, циклов обработки и программирования.",
    keywords: [
        "ЧПУ",
        "Fanuc",
        "тестирование",
        "G-коды",
        "CNC",
        "сертификация",
        "токарная обработка",
    ],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru">
            <body className="bg-graphite-900 text-white antialiased">
                {children}
            </body>
        </html>
    );
}
