"use client";

import { useState, useEffect } from "react";

export default function Gary() {
	const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
	const [isMeowing, setIsMeowing] = useState(false);

	// Random eye movement
	useEffect(() => {
		const interval = setInterval(() => {
			setEyePosition({
				x: Math.random() * 4 - 2,
				y: Math.random() * 3 - 1.5,
			});
		}, 2000);
		return () => clearInterval(interval);
	}, []);

	// Random meowing
	useEffect(() => {
		const interval = setInterval(() => {
			setIsMeowing(true);
			setTimeout(() => setIsMeowing(false), 1500);
		}, 4500);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="fixed bottom-16 md:bottom-24 left-24 md:left-48 w-14 h-16 md:w-28 md:h-32 z-50">
			<div className="relative w-full h-full">
				<div
					className="absolute inset-0 flex items-center justify-center cursor-pointer"
					onClick={() => setIsMeowing(true)}
				>
					<svg
						viewBox="0 0 100 110"
						className="w-full h-full"
						style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.3))" }}
					>
						{/* Shell */}
						<ellipse cx="50" cy="50" rx="35" ry="30" fill="#FF69B4" stroke="#FF1493" strokeWidth="2" />

						{/* Shell spiral pattern */}
						<path d="M 50 35 Q 65 40 60 55 Q 55 65 45 60 Q 35 55 42 45 Q 48 38 50 35" fill="none" stroke="#FF1493" strokeWidth="2" />
						<circle cx="50" cy="48" r="5" fill="#FF1493" />

						{/* Shell dots */}
						<circle cx="30" cy="45" r="4" fill="#FFB6C1" />
						<circle cx="70" cy="45" r="4" fill="#FFB6C1" />
						<circle cx="35" cy="60" r="3" fill="#FFB6C1" />
						<circle cx="65" cy="60" r="3" fill="#FFB6C1" />

						{/* Body/Slug part */}
						<ellipse cx="50" cy="85" rx="30" ry="15" fill="#87CEEB" stroke="#5BA3C6" strokeWidth="2" />

						{/* Eye stalks */}
						<line x1="40" y1="75" x2="35" y2="55" stroke="#87CEEB" strokeWidth="4" />
						<line x1="60" y1="75" x2="65" y2="55" stroke="#87CEEB" strokeWidth="4" />

						{/* Left Eye */}
						<circle cx="35" cy="52" r="8" fill="#FF6347" stroke="#333" strokeWidth="1.5" />
						<circle
							cx={35 + eyePosition.x}
							cy={52 + eyePosition.y}
							r="3"
							fill="#333"
							style={{ transition: "all 0.3s ease" }}
						/>

						{/* Right Eye */}
						<circle cx="65" cy="52" r="8" fill="#FF6347" stroke="#333" strokeWidth="1.5" />
						<circle
							cx={65 + eyePosition.x}
							cy={52 + eyePosition.y}
							r="3"
							fill="#333"
							style={{ transition: "all 0.3s ease" }}
						/>

						{/* Mouth */}
						<ellipse cx="50" cy="92" rx="4" ry="2" fill="#FF6B6B" />
					</svg>
				</div>

				{/* Meow bubble */}
				{isMeowing && (
					<div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-full text-xs font-bold text-pink-500 shadow-lg animate-bounce whitespace-nowrap">
						Meow! 🐱
					</div>
				)}

				{/* Label */}
				<div className="absolute -bottom-0 left-1/2 transform -translate-x-1/2 bg-pink-500 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-md whitespace-nowrap">
					🐌 Gary
				</div>
			</div>
		</div>
	);
}
