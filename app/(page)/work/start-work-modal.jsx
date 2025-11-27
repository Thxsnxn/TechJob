"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Camera, X } from "lucide-react";

export default function StartWorkModal({ isOpen, onClose, onConfirm }) {
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);

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
            // Revoke old url to avoid memory leak
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleConfirm = () => {
        onConfirm(images);
        // Reset state after confirm
        setImages([]);
        setPreviews([]);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">เริ่มปฏิบัติงาน</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label className="text-base font-medium">รูปภาพก่อนเริ่มงาน (Before)</Label>
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
                        <p className="text-xs text-muted-foreground mt-2">
                            * ควรถ่ายรูปสภาพหน้างานก่อนเริ่มดำเนินการเพื่อเป็นหลักฐาน
                        </p>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={onClose}>ยกเลิก</Button>
                    <Button onClick={handleConfirm} className="bg-blue-600 hover:bg-blue-700 text-white">
                        ยืนยันเริ่มงาน
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
