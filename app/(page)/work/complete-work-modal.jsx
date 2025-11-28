"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function CompleteWorkModal({ isOpen, onClose, onConfirm }) {

    const handleConfirm = () => {
        // Just call onConfirm, no data needed as per new requirement
        onConfirm({});
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-blue-600" />
                        ยืนยันการจบงาน
                    </DialogTitle>
                    <DialogDescription className="pt-2 text-base text-gray-600 dark:text-gray-300">
                        คุณต้องการจบงานนี้ใช่หรือไม่? <br />
                        เมื่อยืนยันแล้ว สถานะงานจะถูกเปลี่ยนเป็น "เสร็จสิ้น" ทันที
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="sm:gap-0 mt-4 space-x-4">
                    <Button variant="outline" onClick={onClose}>ยกเลิก</Button>
                    <Button
                        onClick={handleConfirm}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        ยืนยันจบงาน
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
