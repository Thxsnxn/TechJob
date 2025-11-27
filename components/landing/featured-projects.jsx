"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/use-in-view";

const projects = [
  {
    title: "งานติดตั้งตู้สวิทช์บอร์ดหลัก (MDB Installation)",
    description:
      "ยกระดับระบบตู้ MDB ครบวงจรสำหรับโรงงานผลิตขนาดใหญ่ พร้อมวางระบบสำรองไฟฟ้า (Redundant Power) และระบบตรวจสอบสถานะพลังงานอัจฉริยะ",
    image: "/modern-electrical-distribution-board-installation-.jpg",
  },
  {
    title: "ปรับปรุงระบบไฟฟ้าโรงงานอุตสาหกรรม",
    description:
      "ปรับปรุงโครงสร้างพื้นฐานทางไฟฟ้าทั้งระบบให้ทันสมัย รวมถึงการติดตั้งหม้อแปลงไฟฟ้า ระบบจ่ายไฟแบบ Busbar และการเชื่อมต่อกับระบบ Automation",
    image: "/industrial-factory-electrical-power-equipment-and-.jpg",
  },
  {
    title: "วางระบบไฟฟ้าคลังสินค้าสมัยใหม่",
    description:
      "ออกแบบและติดตั้งระบบไฟฟ้าใหม่แบบ End-to-End ครอบคลุมระบบแสงสว่าง LED ประหยัดพลังงาน การกระจายโหลดไฟฟ้า และระบบไฟฉุกเฉินมาตรฐานความปลอดภัย",
    image: "/modern-warehouse-electrical-installation-with-ligh.jpg",
  },
];

function ProjectItem({ project, index }) {
  const { ref, inView } = useInView({ threshold: 0.2 });

  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"
        } gap-10 lg:gap-16 items-center max-w-7xl mx-auto`}
    >
      {/* Image block */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? -60 : 60, scale: 0.97 }}
        animate={
          inView
            ? { opacity: 1, x: 0, scale: 1 }
            : { opacity: 0, x: isEven ? -60 : 60, scale: 0.97 }
        }
        transition={{ duration: 0.9 }}
        className="w-full lg:w-1/2"
      >
        <img
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          className="w-full h-auto rounded-2xl shadow-lg object-cover aspect-video" // เพิ่ม aspect-video เพื่อให้รูปสัดส่วนเท่ากัน
        />
      </motion.div>

      {/* Text block */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.9, delay: 0.2 }}
        className="w-full lg:w-1/2 text-center lg:text-left"
      >
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-light text-black mb-6 tracking-tight leading-tight">
          {project.title}
        </h3>
        <p className="text-lg md:text-xl text-neutral-600 font-light leading-relaxed">
          {project.description}
        </p>
      </motion.div>
    </div>
  );
}

export function FeaturedProjects() {
  const { ref, inView } = useInView({ threshold: 0.05 });

  return (
    <section
      id="projects"
      ref={ref}
      className="py-24 md:py-40 px-6 bg-white"
    >
      {/* Heading */}
      <div className="max-w-7xl mx-auto mb-20">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl lg:text-6xl font-light text-black text-center tracking-tight"
        >
          ตัวอย่างผลงานที่ผ่านมา
        </motion.h2>
      </div>

      <div className="space-y-32 md:space-y-40">
        {projects.map((project, index) => (
          <ProjectItem key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}