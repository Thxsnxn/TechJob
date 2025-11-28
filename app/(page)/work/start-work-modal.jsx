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
import { PlayCircle } from "lucide-react";

export default function StartWorkModal({ isOpen, onClose, onConfirm }) {

    const handleConfirm = () => {
        // Just call onConfirm, no data needed (images removed)
        onConfirm([]);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <PlayCircle className="w-5 h-5 text-blue-600" />
                        ยืนยันการเริ่มงาน
                    </DialogTitle>
                    <DialogDescription className="pt-2 text-base text-gray-600 dark:text-gray-300">
                        คุณต้องการเริ่มปฏิบัติงานนี้ใช่หรือไม่? <br />
                        เมื่อยืนยันแล้ว สถานะงานจะถูกเปลี่ยนเป็น "กำลังดำเนินการ"
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="sm:gap-0 mt-4 space-x-4">
                    <Button variant="outline" onClick={onClose}>ยกเลิก</Button>
                    <Button
                        onClick={handleConfirm}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        ยืนยันเริ่มงาน
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
