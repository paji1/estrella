"use client";

import { useState, useEffect } from "react";

export default function SpongeBob3D() {
	const [isWaving, setIsWaving] = useState(false);
	const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });

	// Random eye movement
	useEffect(() => {
		const interval = setInterval(() => {
			setEyePosition({
				x: Math.random() * 4 - 2,
				y: Math.random() * 4 - 2,
			});
		}, 2000);
		return () => clearInterval(interval);
	}, []);

	// Random waving
	useEffect(() => {
		const interval = setInterval(() => {
			setIsWaving(true);
			setTimeout(() => setIsWaving(false), 1000);
		}, 4000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="fixed bottom-16 md:bottom-24 right-2 md:right-4 w-24 h-28 md:w-48 md:h-56 z-50">
			<div className="relative w-full h-full">
				{/* SpongeBob Container */}
				<div
					className="absolute inset-0 flex items-center justify-center cursor-pointer"
					onClick={() => setIsWaving(true)}
				>
					<svg
						viewBox="0 0 200 220"
						className="w-full h-full drop-shadow-xl"
						style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))" }}
					>
						{/* Body (Yellow Sponge) */}
						<rect
							x="40"
							y="40"
							width="120"
							height="140"
							rx="15"
							fill="#FFE135"
							stroke="#D4A800"
							strokeWidth="3"
							className="animate-pulse"
							style={{ animationDuration: "3s" }}
						/>

						{/* Holes on sponge */}
						<circle cx="70" cy="70" r="8" fill="#D4A800" opacity="0.5" />
						<circle cx="130" cy="80" r="6" fill="#D4A800" opacity="0.5" />
						<circle cx="90" cy="110" r="7" fill="#D4A800" opacity="0.5" />
						<circle cx="140" cy="130" r="5" fill="#D4A800" opacity="0.5" />
						<circle cx="60" cy="140" r="6" fill="#D4A800" opacity="0.5" />
						<circle cx="110" cy="155" r="5" fill="#D4A800" opacity="0.5" />

						{/* Left Eye White */}
						<ellipse cx="75" cy="85" rx="22" ry="25" fill="white" stroke="#333" strokeWidth="2" />
						{/* Right Eye White */}
						<ellipse cx="125" cy="85" rx="22" ry="25" fill="white" stroke="#333" strokeWidth="2" />

						{/* Left Pupil */}
						<circle
							cx={75 + eyePosition.x}
							cy={85 + eyePosition.y}
							r="10"
							fill="#62C8F2"
							style={{ transition: "all 0.3s ease" }}
						/>
						<circle
							cx={75 + eyePosition.x}
							cy={85 + eyePosition.y}
							r="5"
							fill="#333"
							style={{ transition: "all 0.3s ease" }}
						/>

						{/* Right Pupil */}
						<circle
							cx={125 + eyePosition.x}
							cy={85 + eyePosition.y}
							r="10"
							fill="#62C8F2"
							style={{ transition: "all 0.3s ease" }}
						/>
						<circle
							cx={125 + eyePosition.x}
							cy={85 + eyePosition.y}
							r="5"
							fill="#333"
							style={{ transition: "all 0.3s ease" }}
						/>

						{/* Nose */}
						<ellipse cx="100" cy="110" rx="8" ry="12" fill="#FFE135" stroke="#D4A800" strokeWidth="2" />

						{/* Cheeks (blush) */}
						<circle cx="55" cy="115" r="10" fill="#FF9999" opacity="0.5" />
						<circle cx="145" cy="115" r="10" fill="#FF9999" opacity="0.5" />

						{/* Mouth */}
						<path
							d="M 70 130 Q 100 160 130 130"
							fill="none"
							stroke="#333"
							strokeWidth="3"
							strokeLinecap="round"
						/>

						{/* Teeth */}
						<rect x="90" y="130" width="10" height="15" fill="white" stroke="#333" strokeWidth="1" rx="2" />
						<rect x="102" y="130" width="10" height="15" fill="white" stroke="#333" strokeWidth="1" rx="2" />

						{/* Freckles */}
						<circle cx="60" cy="100" r="3" fill="#D4A800" />
						<circle cx="65" cy="108" r="3" fill="#D4A800" />
						<circle cx="55" cy="106" r="3" fill="#D4A800" />
						<circle cx="140" cy="100" r="3" fill="#D4A800" />
						<circle cx="135" cy="108" r="3" fill="#D4A800" />
						<circle cx="145" cy="106" r="3" fill="#D4A800" />

						{/* Eyelashes */}
						<line x1="55" y1="65" x2="50" y2="55" stroke="#333" strokeWidth="2" strokeLinecap="round" />
						<line x1="65" y1="62" x2="62" y2="52" stroke="#333" strokeWidth="2" strokeLinecap="round" />
						<line x1="85" y1="62" x2="88" y2="52" stroke="#333" strokeWidth="2" strokeLinecap="round" />
						<line x1="95" y1="65" x2="100" y2="55" stroke="#333" strokeWidth="2" strokeLinecap="round" />

						<line x1="105" y1="65" x2="100" y2="55" stroke="#333" strokeWidth="2" strokeLinecap="round" />
						<line x1="115" y1="62" x2="112" y2="52" stroke="#333" strokeWidth="2" strokeLinecap="round" />
						<line x1="135" y1="62" x2="138" y2="52" stroke="#333" strokeWidth="2" strokeLinecap="round" />
						<line x1="145" y1="65" x2="150" y2="55" stroke="#333" strokeWidth="2" strokeLinecap="round" />

						{/* Pants */}
						<rect x="40" y="165" width="120" height="25" fill="#8B4513" stroke="#5D3A1A" strokeWidth="2" />
						<line x1="40" y1="175" x2="160" y2="175" stroke="#222" strokeWidth="2" />

						{/* Left Arm */}
						<g
							style={{
								transformOrigin: "40px 120px",
								transform: isWaving ? "rotate(-30deg)" : "rotate(0deg)",
								transition: "transform 0.3s ease"
							}}
						>
							<rect x="10" y="110" width="35" height="15" rx="7" fill="#FFE135" stroke="#D4A800" strokeWidth="2" />
						</g>

						{/* Right Arm - Waving! */}
						<g
							style={{
								transformOrigin: "160px 120px",
								transform: isWaving ? "rotate(-45deg)" : "rotate(0deg)",
								transition: "transform 0.2s ease"
							}}
							className={isWaving ? "animate-wave" : ""}
						>
							<rect x="155" y="110" width="35" height="15" rx="7" fill="#FFE135" stroke="#D4A800" strokeWidth="2" />
						</g>

						{/* Legs */}
						<rect x="60" y="185" width="15" height="30" fill="#FFE135" stroke="#D4A800" strokeWidth="2" />
						<rect x="125" y="185" width="15" height="30" fill="#FFE135" stroke="#D4A800" strokeWidth="2" />

						{/* Shoes */}
						<ellipse cx="67" cy="215" rx="15" ry="8" fill="#333" />
						<ellipse cx="132" cy="215" rx="15" ry="8" fill="#333" />
					</svg>
				</div>

				{/* Speech bubble when waving */}
				{isWaving && (
					<div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full text-sm font-bold text-pink-500 shadow-lg animate-bounce whitespace-nowrap">
						Take your pills! 💊
					</div>
				)}

				{/* Label */}
				<div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-md whitespace-nowrap">
					🧽 Click me!
				</div>
			</div>

			<style jsx>{`
        @keyframes wave {
          0%, 100% { transform: rotate(-45deg); }
          25% { transform: rotate(-60deg); }
          75% { transform: rotate(-30deg); }
        }
        .animate-wave {
          animation: wave 0.3s ease-in-out 3;
        }
      `}</style>
		</div>
	);
}
