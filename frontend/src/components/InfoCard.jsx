import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InfoCard({
    title,
    value,
    tone = "white",
    textColor = "gray",
    className = "",
    fontSize = "2xl",
}) {
    const toneClasses = {
        green: {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-700",
        ring: "hover:ring-2 hover:ring-green-200",
        hoverShadow: "hover:shadow-xl",
        },
        yellow: {
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        text: "text-yellow-700",
        ring: "hover:ring-2 hover:ring-yellow-200",
        hoverShadow: "hover:shadow-md",
        },
        red: {
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-700",
        ring: "hover:ring-2 hover:ring-red-200",
        hoverShadow: "hover:shadow-xl",
        },
        white: {
        bg: "bg-white",
        border: "border-gray-200",
        text: "text-gray-700",
        ring: "hover:ring-2 hover:ring-gray-200",
        hoverShadow: "hover:shadow-md",
        },
    };

    const textMap = {
        gray: "text-gray-900",
        red: "text-red-600",
        green: "text-green-600",
        yellow: "text-yellow-600",
    };

    const { bg, border, text, ring, hoverShadow } = toneClasses[tone] ?? toneClasses.white;
    const textNumber = textMap[textColor] ?? textMap.gray;

    return (
        <div
        className={`p-4 ${bg} border ${border} rounded-lg shadow-sm
                    transition-all duration-300 hover:-translate-y-1
                    ${hoverShadow} ${ring} ${className}`}
        >
        <h3 className={`text-sm font-medium ${text}`}>{title}</h3>

        <AnimatePresence mode="wait">
            <motion.p
            key={String(value)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            // className="text-2xl font-bold text-gray-900 mt-1"
            // className={`text-2xl font-bold ${textNumber} mt-1`}
            className={`text-${fontSize} font-bold ${textNumber} mt-2`}
            >
            {value}
            </motion.p>
        </AnimatePresence>
        </div>
    );
}
