"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

export default function OTRequestPage() {
	const params = useSearchParams();
	const type = params?.get("type") || "";

	return (
		<main className="p-4">
			<h1 className="text-lg font-semibold">OT Request</h1>
			<p className="text-sm text-muted-foreground mt-2">
				{type === "before" && "Requesting OT before your shift."}
				{type === "after" && "Requesting OT after your shift (retroactive)."}
				{!type && "Choose an OT request type from the bottom menu."}
			</p>

			{/* Add the real form or flow here */}
			<div className="mt-6">
				<div className="p-4 border rounded">Form goes here...</div>
			</div>
		</main>
	);
}

