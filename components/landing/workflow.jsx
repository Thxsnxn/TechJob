"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/use-in-view";

const steps = [
    "Consultation",
    "Site Survey",
    "Proposal",
    "Installation",
    "Commissioning",
];

export function Workflow() {
    const { ref, inView } = useInView({ threshold: 0.1 });

    return (
        <section
            id="process"
            ref={ref}
            className="py-24 md:py-40 px-6 bg-neutral-50"
        >
            <div className="max-w-7xl mx-auto">

                {/* Section Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 40 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-black mb-16 md:mb-24 text-center tracking-tight"
                >
                    Our Process
                </motion.h2>

                {/* Steps */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, y: 40 }}
                            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className="flex-1 text-center relative w-full"
                        >
                            {/* Step Number */}
                            <div className="mb-6">
                                <span className="text-5xl sm:text-6xl md:text-6xl lg:text-7xl font-extralight text-neutral-300">
                                    {(index + 1).toString().padStart(2, "0")}
                                </span>
                            </div>

                            {/* Step Title */}
                            <h3 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-light text-black tracking-tight">
                                {step}
                            </h3>

                            {/* Connector Line (Desktop only) */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-12 left-[55%] w-[80%] h-[1px] bg-neutral-300" />
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
