"use client";

import { useState, useEffect } from "react";

export default function Patrick() {
	const [isWaving, setIsWaving] = useState(false);
	const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });

	// Random eye movement
	useEffect(() => {
		const interval = setInterval(() => {
			setEyePosition({
				x: Math.random() * 3 - 1.5,
				y: Math.random() * 3 - 1.5,
			});
		}, 2500);
		return () => clearInterval(interval);
	}, []);

	// Random waving
	useEffect(() => {
		const interval = setInterval(() => {
			setIsWaving(true);
			setTimeout(() => setIsWaving(false), 1000);
		}, 5000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="fixed bottom-16 md:bottom-24 left-2 md:left-4 w-20 h-24 md:w-36 md:h-48 z-50">
			<div className="relative w-full h-full">
				{/* Patrick Container */}
				<div
					className="absolute inset-0 flex items-center justify-center cursor-pointer"
					onClick={() => setIsWaving(true)}
				>
					<svg
						viewBox="0 0 140 180"
						className="w-full h-full"
						style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }}
					>
						{/* Body - cone/pear shape like real Patrick */}
						<ellipse cx="70" cy="110" rx="45" ry="50" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="2" />

						{/* Head - pointy top */}
						<ellipse cx="70" cy="45" rx="30" ry="35" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="2" />

						{/* Connect head to body */}
						<rect x="40" y="45" width="60" height="70" fill="#FFB6C1" />

						{/* Belly (lighter) */}
						<ellipse cx="70" cy="105" rx="28" ry="30" fill="#FFD1DC" />

						{/* Belly button */}
						<ellipse cx="70" cy="115" rx="4" ry="5" fill="#FF69B4" opacity="0.6" />

						{/* Left Eye */}
						<ellipse cx="55" cy="45" rx="12" ry="14" fill="white" stroke="#333" strokeWidth="1.5" />
						<circle
							cx={55 + eyePosition.x}
							cy={45 + eyePosition.y}
							r="5"
							fill="#333"
							style={{ transition: "all 0.3s ease" }}
						/>

						{/* Right Eye */}
						<ellipse cx="85" cy="45" rx="12" ry="14" fill="white" stroke="#333" strokeWidth="1.5" />
						<circle
							cx={85 + eyePosition.x}
							cy={45 + eyePosition.y}
							r="5"
							fill="#333"
							style={{ transition: "all 0.3s ease" }}
						/>

						{/* Thick Eyebrows */}
						<ellipse cx="55" cy="32" rx="10" ry="4" fill="#8B4513" />
						<ellipse cx="85" cy="32" rx="10" ry="4" fill="#8B4513" />

						{/* Big Smile */}
						<path
							d="M 50 65 Q 70 85 90 65"
							fill="none"
							stroke="#333"
							strokeWidth="3"
							strokeLinecap="round"
						/>

						{/* Shorts */}
						<path
							d="M 30 130 L 30 155 L 55 155 L 55 145 L 70 150 L 85 145 L 85 155 L 110 155 L 110 130 Q 70 140 30 130"
							fill="#7CFC00"
							stroke="#228B22"
							strokeWidth="2"
						/>
						{/* Flower patterns on shorts */}
						<circle cx="45" cy="142" r="4" fill="#9370DB" />
						<circle cx="70" cy="145" r="4" fill="#FF69B4" />
						<circle cx="95" cy="142" r="4" fill="#9370DB" />

						{/* Left Arm */}
						<g
							style={{
								transformOrigin: "25px 90px",
								transform: isWaving ? "rotate(-15deg)" : "rotate(0deg)",
								transition: "transform 0.3s ease"
							}}
						>
							<ellipse cx="15" cy="95" rx="15" ry="10" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="2" />
						</g>

						{/* Right Arm - Waving! */}
						<g
							style={{
								transformOrigin: "115px 90px",
								transform: isWaving ? "rotate(35deg)" : "rotate(0deg)",
								transition: "transform 0.2s ease"
							}}
							className={isWaving ? "animate-wave" : ""}
						>
							<ellipse cx="125" cy="95" rx="15" ry="10" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="2" />
						</g>

						{/* Legs */}
						<ellipse cx="50" cy="168" rx="10" ry="12" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="2" />
						<ellipse cx="90" cy="168" rx="10" ry="12" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="2" />
					</svg>
				</div>

				{/* Speech bubble when waving */}
				{isWaving && (
					<div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full text-sm font-bold text-pink-500 shadow-lg animate-bounce whitespace-nowrap">
						Hi there! 💗
					</div>
				)}

				{/* Label */}
				<div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-pink-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md whitespace-nowrap">
					💗 Patrick
				</div>
			</div>

			<style jsx>{`
        @keyframes wave {
          0%, 100% { transform: rotate(35deg); }
          25% { transform: rotate(50deg); }
          75% { transform: rotate(20deg); }
        }
        .animate-wave {
          animation: wave 0.3s ease-in-out 3;
        }
      `}</style>
		</div>
	);
}
