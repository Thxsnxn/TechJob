"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, X, Eraser, PenTool } from "lucide-react";

export default function CompleteWorkModal({ isOpen, onClose, onConfirm }) {
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [note, setNote] = useState("");

    // Signature Canvas Refs & State
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setImages([]);
            setPreviews([]);
            setNote("");
            setHasSignature(false);
            // Delay clearing canvas to ensure it's rendered
            setTimeout(clearCanvas, 100);
        }
    }, [isOpen]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setImages((prev) => [...prev, ...files]);
            const newPreviews = files.map((file) => URL.createObjectURL(file));
            setPreviews((prev) => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    // --- Canvas Logic ---
    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
        setHasSignature(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
    };

    const handleConfirm = () => {
        const canvas = canvasRef.current;
        const signatureData = canvas ? canvas.toDataURL("image/png") : null;

        onConfirm({
            images,
            note,
            signature: signatureData
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg bg-white dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">ส่งมอบงาน / จบงาน</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* 1. After Images */}
                    <div className="space-y-2">
                        <Label className="text-base font-medium">รูปภาพหลังจบงาน (After)</Label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            {previews.map((src, idx) => (
                                <div key={idx} className="relative aspect-square rounded-md overflow-hidden border bg-gray-100 dark:bg-gray-800">
                                    <img src={src} alt="preview" className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            <label className="flex flex-col items-center justify-center aspect-square rounded-md border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors bg-gray-50 dark:bg-gray-800/50">
                                <Camera className="w-6 h-6 text-gray-400" />
                                <span className="text-xs text-gray-500 mt-1">เพิ่มรูป</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>
                    </div>

                    {/* 2. Problem Report */}
                    <div className="space-y-2">
                        <Label className="text-base font-medium">รายงานปัญหา / หมายเหตุ</Label>
                        <Textarea
                            placeholder="ระบุปัญหาที่พบ หรือรายละเอียดเพิ่มเติม..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>

                    {/* 3. Signature */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label className="text-base font-medium flex items-center gap-2">
                                <PenTool className="w-4 h-4" /> ลายเซ็นลูกค้า
                            </Label>
                            <Button variant="ghost" size="sm" onClick={clearCanvas} className="text-xs h-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                                <Eraser className="w-3 h-3 mr-1" /> ล้างลายเซ็น
                            </Button>
                        </div>
                        <div className="border rounded-lg overflow-hidden bg-white touch-none">
                            <canvas
                                ref={canvasRef}
                                width={460}
                                height={200}
                                className="w-full h-[200px] cursor-crosshair"
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                                onTouchStart={startDrawing}
                                onTouchMove={draw}
                                onTouchEnd={stopDrawing}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                            กรุณาเซ็นชื่อในกรอบด้านบน
                        </p>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={onClose}>ยกเลิก</Button>
                    <Button
                        onClick={handleConfirm}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={!hasSignature} // Require signature to complete? Maybe optional. Let's keep it optional for now or strictly required? User said "ลงชื่อรายเซ็นลูกค้า" so likely required.
                    >
                        ยืนยันจบงาน
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
