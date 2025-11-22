"use client";

import { useEffect, useRef, useState } from "react";

export function useInView(options = { threshold: 0.2 }) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        if (!ref.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];

                if (entry.isIntersecting) {
                    setInView(true);       // animate in
                } else {
                    setInView(false);      // reset to allow re-trigger
                }
            },
            options
        );

        observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return { ref, inView };
}
