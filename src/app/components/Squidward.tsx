"use client";

import { useState, useEffect } from "react";

export default function Squidward() {
	const [isAnnoyed, setIsAnnoyed] = useState(false);
	const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });

	// Random eye movement (looking annoyed)
	useEffect(() => {
		const interval = setInterval(() => {
			setEyePosition({
				x: Math.random() * 2 - 1,
				y: Math.random() * 2 - 1,
			});
		}, 3000);
		return () => clearInterval(interval);
	}, []);

	// Random annoyed expression
	useEffect(() => {
		const interval = setInterval(() => {
			setIsAnnoyed(true);
			setTimeout(() => setIsAnnoyed(false), 2000);
		}, 6000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="fixed bottom-48 left-4 w-32 h-44 z-40">
			<div className="relative w-full h-full">
				<div
					className="absolute inset-0 flex items-center justify-center cursor-pointer"
					onClick={() => setIsAnnoyed(true)}
				>
					<svg
						viewBox="0 0 120 160"
						className="w-full h-full"
						style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }}
					>
						{/* Head - oval/egg shape */}
						<ellipse cx="60" cy="50" rx="35" ry="40" fill="#7EC8E3" stroke="#5BA3C6" strokeWidth="2" />

						{/* Forehead wrinkles when annoyed */}
						{isAnnoyed && (
							<>
								<path d="M 40 25 Q 50 22 60 25" fill="none" stroke="#5BA3C6" strokeWidth="1.5" />
								<path d="M 40 30 Q 50 27 60 30" fill="none" stroke="#5BA3C6" strokeWidth="1.5" />
							</>
						)}

						{/* Big nose */}
						<ellipse cx="60" cy="55" rx="8" ry="20" fill="#7EC8E3" stroke="#5BA3C6" strokeWidth="2" />

						{/* Left Eye */}
						<ellipse cx="42" cy="40" rx="10" ry="8" fill="#FFFACD" stroke="#333" strokeWidth="1.5" />
						<ellipse
							cx={42 + eyePosition.x}
							cy={40 + eyePosition.y}
							rx="4"
							ry="4"
							fill="#8B0000"
							style={{ transition: "all 0.3s ease" }}
						/>

						{/* Right Eye */}
						<ellipse cx="78" cy="40" rx="10" ry="8" fill="#FFFACD" stroke="#333" strokeWidth="1.5" />
						<ellipse
							cx={78 + eyePosition.x}
							cy={40 + eyePosition.y}
							rx="4"
							ry="4"
							fill="#8B0000"
							style={{ transition: "all 0.3s ease" }}
						/>

						{/* Eyelids (droopy/annoyed) */}
						<path
							d={isAnnoyed ? "M 32 38 Q 42 42 52 38" : "M 32 36 Q 42 38 52 36"}
							fill="#7EC8E3"
							stroke="#5BA3C6"
							strokeWidth="1.5"
							style={{ transition: "all 0.3s ease" }}
						/>
						<path
							d={isAnnoyed ? "M 68 38 Q 78 42 88 38" : "M 68 36 Q 78 38 88 36"}
							fill="#7EC8E3"
							stroke="#5BA3C6"
							strokeWidth="1.5"
							style={{ transition: "all 0.3s ease" }}
						/>

						{/* Mouth */}
						<path
							d={isAnnoyed ? "M 45 75 Q 60 70 75 75" : "M 45 72 L 75 72"}
							fill="none"
							stroke="#333"
							strokeWidth="2"
							strokeLinecap="round"
							style={{ transition: "all 0.3s ease" }}
						/>

						{/* Neck */}
						<rect x="50" y="85" width="20" height="20" fill="#7EC8E3" stroke="#5BA3C6" strokeWidth="2" />

						{/* Shirt */}
						<rect x="35" y="100" width="50" height="30" fill="#8B4513" stroke="#5D3A1A" strokeWidth="2" />

						{/* Tentacle legs */}
						<ellipse cx="45" cy="145" rx="10" ry="15" fill="#7EC8E3" stroke="#5BA3C6" strokeWidth="2" />
						<ellipse cx="60" cy="148" rx="8" ry="12" fill="#7EC8E3" stroke="#5BA3C6" strokeWidth="2" />
						<ellipse cx="75" cy="145" rx="10" ry="15" fill="#7EC8E3" stroke="#5BA3C6" strokeWidth="2" />
						<ellipse cx="52" cy="150" rx="6" ry="10" fill="#7EC8E3" stroke="#5BA3C6" strokeWidth="2" />
						<ellipse cx="68" cy="150" rx="6" ry="10" fill="#7EC8E3" stroke="#5BA3C6" strokeWidth="2" />
					</svg>
				</div>

				{/* Speech bubble */}
				{isAnnoyed && (
					<div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-full text-xs font-bold text-cyan-600 shadow-lg animate-bounce whitespace-nowrap">
						*sigh* 😒
					</div>
				)}

				{/* Label */}
				<div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-cyan-500 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-md whitespace-nowrap">
					🎺 Squidward
				</div>
			</div>
		</div>
	);
}
