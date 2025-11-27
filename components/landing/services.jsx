"use client";

import { motion } from "framer-motion";
import { Zap, Database, Cpu, Headphones } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";

const services = [
    {
        icon: Zap,
        title: "งานติดตั้งระบบไฟฟ้า (Electrical Installation)",
        description:
            "บริการออกแบบและติดตั้งระบบไฟฟ้าครบวงจร ตามมาตรฐานอุตสาหกรรม ด้วยความแม่นยำและเชื่อถือได้ เพื่อความปลอดภัยสูงสุด",
    },
    {
        icon: Database,
        title: "ระบบจ่ายไฟฟ้ากำลัง (Power Distribution)",
        description:
            "วางระบบโครงสร้างพื้นฐานการจ่ายไฟฟ้าขั้นสูง ออกแบบเพื่อประสิทธิภาพสูงสุดในการใช้พลังงานและการจัดการโหลดไฟฟ้า",
    },
    {
        icon: Cpu,
        title: "ตู้คอนโทรลและระบบอัตโนมัติ (Control & Automation)",
        description:
            "ออกแบบและประกอบตู้ควบคุมไฟฟ้า (Control Panel) พร้อมโซลูชันระบบอัตโนมัติที่ปรับแต่งตามความต้องการของโรงงาน",
    },
    {
        icon: Headphones,
        title: "บริการด้านวิศวกรรมและที่ปรึกษา (Engineering Support)",
        description:
            "ทีมวิศวกรผู้เชี่ยวชาญพร้อมให้คำปรึกษาทางเทคนิค ดูแลและแก้ไขปัญหาหน้างานตลอดอายุการใช้งานโครงการ",
    },
];

export function Services() {
    const { ref, inView } = useInView({ threshold: 0.1 });

    return (
        <section id="services" ref={ref} className="py-24 md:py-40 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-black mb-6 tracking-tight">
                        บริการของเรา
                    </h2>
                    <p className="text-lg sm:text-xl md:text-2xl text-neutral-600 font-light max-w-3xl mx-auto leading-relaxed">
                        โซลูชันระบบไฟฟ้าครบวงจรสำหรับภาคอุตสาหกรรม
                    </p>
                </motion.div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.title}
                            initial={{ opacity: 0, y: 40 }}
                            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className="text-center md:text-left"
                        >
                            <service.icon className="w-12 h-12 md:w-14 md:h-14 text-black mb-6 mx-auto md:mx-0 stroke-[1.5]" />

                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-light text-black mb-4 tracking-tight">
                                {service.title}
                            </h3>

                            <p className="text-base sm:text-lg md:text-xl text-neutral-600 font-light leading-relaxed">
                                {service.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}