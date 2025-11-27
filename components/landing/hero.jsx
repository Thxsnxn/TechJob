"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="hero"
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {/* Parallax Background */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        <img
          src="/industrial-electrical-installation-panels-and-equi.jpg"
          alt="Electrical Installation"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-white font-light text-[32px] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.1] mb-6 tracking-tight"
        >
          <span className="font-bold">
            Tech <span className="text-blue-600">Job</span>
          </span>
        </motion.h1>

        {/* Sub text */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-white/90 text-base sm:text-lg md:text-xl lg:text-2xl font-light max-w-3xl mb-12 leading-relaxed px-4"
        >
          ผสานความเชี่ยวชาญทางเทคนิคเข้ากับการบริหารจัดการที่เป็นระบบ
          เพื่อผลลัพธ์ที่เหนือกว่าและเชื่อถือได้ในทุกขั้นตอน
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button
            size="lg"
            className="bg-white text-black hover:bg-white/90 px-8 py-6 text-base font-medium rounded-full min-w-[180px]"
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            แจ้งงาน / ติดต่อเรา
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="bg-transparent text-white border-white hover:bg-white hover:text-black px-8 py-6 text-base font-medium rounded-full min-w-[180px]"
            onClick={() =>
              document
                .getElementById("projects")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            ดูผลงานของเรา
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
