"use client";

import { useState, useEffect } from "react";

export default function MrKrabs() {
	const [isExcited, setIsExcited] = useState(false);
	const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });

	// Random eye movement
	useEffect(() => {
		const interval = setInterval(() => {
			setEyePosition({
				x: Math.random() * 2 - 1,
				y: Math.random() * 2 - 1,
			});
		}, 2500);
		return () => clearInterval(interval);
	}, []);

	// Random money excitement
	useEffect(() => {
		const interval = setInterval(() => {
			setIsExcited(true);
			setTimeout(() => setIsExcited(false), 1500);
		}, 5500);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="fixed bottom-36 md:bottom-72 right-2 md:right-4 w-14 h-16 md:w-28 md:h-32 z-40">
			<div className="relative w-full h-full">
				<div
					className="absolute inset-0 flex items-center justify-center cursor-pointer"
					onClick={() => setIsExcited(true)}
				>
					<svg
						viewBox="0 0 140 170"
						className="w-full h-full"
						style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }}
					>
						{/* Body - round crab shape */}
						<ellipse cx="70" cy="95" rx="50" ry="45" fill="#E53935" stroke="#B71C1C" strokeWidth="3" />

						{/* Shell texture lines */}
						<path d="M 30 85 Q 70 75 110 85" fill="none" stroke="#C62828" strokeWidth="2" opacity="0.5" />
						<path d="M 35 100 Q 70 90 105 100" fill="none" stroke="#C62828" strokeWidth="2" opacity="0.5" />

						{/* Head - slightly smaller oval on top */}
						<ellipse cx="70" cy="50" rx="35" ry="30" fill="#E53935" stroke="#B71C1C" strokeWidth="3" />

						{/* Eye stalks */}
						<rect x="45" y="15" width="8" height="25" rx="4" fill="#E53935" stroke="#B71C1C" strokeWidth="2" />
						<rect x="87" y="15" width="8" height="25" rx="4" fill="#E53935" stroke="#B71C1C" strokeWidth="2" />

						{/* Left Eye */}
						<circle cx="49" cy="12" r="12" fill="white" stroke="#333" strokeWidth="2" />
						<circle
							cx={49 + eyePosition.x}
							cy={12 + eyePosition.y}
							r="6"
							fill="#2E7D32"
							style={{ transition: "all 0.3s ease" }}
						/>
						<circle
							cx={49 + eyePosition.x}
							cy={12 + eyePosition.y}
							r="3"
							fill="#1B5E20"
							style={{ transition: "all 0.3s ease" }}
						/>
						{/* Eye shine */}
						<circle cx="46" cy="9" r="2" fill="white" opacity="0.8" />

						{/* Right Eye */}
						<circle cx="91" cy="12" r="12" fill="white" stroke="#333" strokeWidth="2" />
						<circle
							cx={91 + eyePosition.x}
							cy={12 + eyePosition.y}
							r="6"
							fill="#2E7D32"
							style={{ transition: "all 0.3s ease" }}
						/>
						<circle
							cx={91 + eyePosition.x}
							cy={12 + eyePosition.y}
							r="3"
							fill="#1B5E20"
							style={{ transition: "all 0.3s ease" }}
						/>
						{/* Eye shine */}
						<circle cx="88" cy="9" r="2" fill="white" opacity="0.8" />

						{/* Nose */}
						<ellipse cx="70" cy="50" rx="6" ry="10" fill="#EF5350" stroke="#C62828" strokeWidth="1" />

						{/* Cheeks */}
						<circle cx="45" cy="55" r="8" fill="#FF8A80" opacity="0.6" />
						<circle cx="95" cy="55" r="8" fill="#FF8A80" opacity="0.6" />

						{/* Big Smile */}
						<path
							d={isExcited ? "M 45 65 Q 70 85 95 65" : "M 50 62 Q 70 72 90 62"}
							fill="none"
							stroke="#333"
							strokeWidth="3"
							strokeLinecap="round"
							style={{ transition: "all 0.3s ease" }}
						/>

						{/* Left Claw */}
						<g
							style={{
								transformOrigin: "15px 85px",
								transform: isExcited ? "rotate(-15deg) scale(1.1)" : "rotate(0deg)",
								transition: "transform 0.3s ease"
							}}
						>
							{/* Arm */}
							<ellipse cx="10" cy="90" rx="12" ry="8" fill="#E53935" stroke="#B71C1C" strokeWidth="2" />
							{/* Claw */}
							<path d="M -5 80 Q -15 75 -10 85 Q -5 90 -15 95 Q -5 100 -5 90 Z" fill="#E53935" stroke="#B71C1C" strokeWidth="2" />
						</g>

						{/* Right Claw */}
						<g
							style={{
								transformOrigin: "125px 85px",
								transform: isExcited ? "rotate(15deg) scale(1.1)" : "rotate(0deg)",
								transition: "transform 0.3s ease"
							}}
						>
							{/* Arm */}
							<ellipse cx="130" cy="90" rx="12" ry="8" fill="#E53935" stroke="#B71C1C" strokeWidth="2" />
							{/* Claw */}
							<path d="M 145 80 Q 155 75 150 85 Q 145 90 155 95 Q 145 100 145 90 Z" fill="#E53935" stroke="#B71C1C" strokeWidth="2" />
						</g>

						{/* Belt */}
						<rect x="25" y="125" width="90" height="10" rx="2" fill="#1A1A1A" />
						<ellipse cx="70" cy="130" rx="8" ry="6" fill="#FFD700" stroke="#FFA000" strokeWidth="1" />

						{/* Legs - 6 little crab legs */}
						<rect x="35" y="138" width="6" height="22" rx="3" fill="#E53935" stroke="#B71C1C" strokeWidth="1" />
						<rect x="50" y="140" width="5" height="18" rx="2" fill="#E53935" stroke="#B71C1C" strokeWidth="1" />
						<rect x="63" y="142" width="4" height="15" rx="2" fill="#E53935" stroke="#B71C1C" strokeWidth="1" />
						<rect x="73" y="142" width="4" height="15" rx="2" fill="#E53935" stroke="#B71C1C" strokeWidth="1" />
						<rect x="85" y="140" width="5" height="18" rx="2" fill="#E53935" stroke="#B71C1C" strokeWidth="1" />
						<rect x="99" y="138" width="6" height="22" rx="3" fill="#E53935" stroke="#B71C1C" strokeWidth="1" />
					</svg>
				</div>

				{/* Money bubble */}
				{isExcited && (
					<div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full text-sm font-bold text-green-600 shadow-lg animate-bounce whitespace-nowrap">
						Money! 💰
					</div>
				)}

				{/* Label */}
				<div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md whitespace-nowrap">
					🦀 Mr. Krabs
				</div>
			</div>
		</div>
	);
}
