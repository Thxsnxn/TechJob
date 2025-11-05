"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function BottomSheet({ isOpen, onClose, children, title }) {
  const duration = 300; // ms
  const [mounted, setMounted] = useState(isOpen);
  const [visible, setVisible] = useState(false);

  // manage mount/visibility to allow enter/leave animations
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // small delay to trigger CSS transition
      const t = setTimeout(() => setVisible(true), 20);
      return () => clearTimeout(t);
    }

    // animate out
    setVisible(false);
    const t = setTimeout(() => setMounted(false), duration);
    return () => clearTimeout(t);
  }, [isOpen]);

  // prevent body scroll when mounted
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = mounted ? "hidden" : "";
    }
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, [mounted]);

  const requestClose = () => {
    // start hide animation then call parent onClose after duration
    setVisible(false);
    setTimeout(() => {
      onClose && onClose();
    }, duration);
  };

  if (!mounted) return null;

  return (
    <div className="fixed inset-0" style={{ zIndex: 9999 }}>
      {/* backdrop */}
      <button
        aria-label="Close"
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          visible ? "opacity-40" : "opacity-0"
        }`}
        onClick={requestClose}
      />

      {/* raise the sheet higher (include safe-area) so it sits above the nav; remove heavy shadow */}
      <div
        className="absolute left-0 right-0"
        // anchor sheet to the device safe-area bottom so it sits flush
        style={{ bottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {/* center the sheet and fix width to 402px to match mobile nav */}
        <div style={{ width: 402, marginLeft: "auto", marginRight: "auto" }}>
          {/* outer wrapper ensures rounded panel doesn't show backdrop through corners */}
          <div style={{ overflow: "hidden", borderTopLeftRadius: 14, borderTopRightRadius: 14 }}>
            <div
              className={`bg-white transform transition-transform duration-300 ${
                visible ? "translate-y-0 rounded-t-xl" : "translate-y-full rounded-t-xl"
              }`}
              style={{ borderTopLeftRadius: 14, borderTopRightRadius: 14, boxShadow: "none" }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <div className="text-center w-full text-sm font-semibold">{title}</div>
                <button onClick={requestClose} className="absolute right-4 top-3">
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              <div className="p-4">{children}</div>
            </div>

            {/* filler under the sheet removed so panel bottom sits flush with the screen bottom */}
            <div style={{ height: 'env(safe-area-inset-bottom, 0px)', background: "white" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
