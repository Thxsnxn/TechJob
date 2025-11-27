"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/use-in-view";

const pillars = [
    {
        title: "มาตรฐานความปลอดภัยสูงสุด",
        description: "การติดตั้งทุกขั้นตอนเป็นไปตามมาตรฐานความปลอดภัยทางวิศวกรรมและกฎหมายกำหนด",
    },
    {
        title: "ทีมวิศวกรมืออาชีพ",
        description: "ควบคุมและดูแลงานโดยทีมวิศวกรที่มีใบประกอบวิชาชีพและประสบการณ์เชี่ยวชาญ",
    },
    {
        title: "คุณภาพระดับอุตสาหกรรม",
        description: "เลือกใช้อุปกรณ์เกรดพรีเมียม แข็งแรง ทนทาน และผ่านการตรวจสอบคุณภาพอย่างเข้มงวด",
    },
    {
        title: "บริการรวดเร็วทั่วประเทศ",
        description: "ตอบสนองงานด่วนได้ทันใจ พร้อมทีมงานให้บริการครอบคลุมพื้นที่ทั่วประเทศไทย",
    },
];

export function WhyChooseUs() {
    const { ref, inView } = useInView({ threshold: 0.1 });

    return (
        <section ref={ref} className="py-24 md:py-40 px-6 bg-neutral-50">
            <div className="max-w-7xl mx-auto">

                {/* Section heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 40 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-black mb-16 md:mb-24 text-center tracking-tight"
                >
                    ทำไมต้องเลือกเรา
                </motion.h2>

                {/* Pillars grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16">
                    {pillars.map((pillar, index) => (
                        <motion.div
                            key={pillar.title}
                            initial={{ opacity: 0, y: 40 }}
                            animate={
                                inView
                                    ? { opacity: 1, y: 0 }
                                    : { opacity: 0, y: 40 }
                            }
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className="text-center px-4"
                        >
                            <h3 className="text-xl sm:text-2xl md:text-3xl font-light text-black mb-3 tracking-tight">
                                {pillar.title}
                            </h3>

                            <p className="text-sm sm:text-base md:text-lg text-neutral-600 font-light leading-relaxed">
                                {pillar.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}