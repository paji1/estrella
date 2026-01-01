"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

// Dynamically import Racing3D to avoid SSR issues with Three.js
const Racing3D = dynamic(() => import("./Racing3D"), {
	ssr: false,
	loading: () => (
		<div className="flex items-center justify-center h-96">
			<div className="text-2xl text-pink-500 animate-pulse">Loading 3D Game...</div>
		</div>
	)
});

const REWARDS = [
	{ emoji: "💎", name: "Diamond", amount: 500000000, color: "bg-cyan-400" },
	{ emoji: "💰", name: "Gold", amount: 200000000, color: "bg-yellow-400" },
	{ emoji: "💵", name: "Cash", amount: 100000000, color: "bg-green-400" },
	{ emoji: "🌸", name: "Flower", amount: 50000000, color: "bg-pink-400" },
	{ emoji: "⭐", name: "Star", amount: 150000000, color: "bg-purple-400" },
	{ emoji: "🦋", name: "Butterfly", amount: 75000000, color: "bg-blue-400" },
	{ emoji: "💖", name: "Heart", amount: 300000000, color: "bg-rose-400" },
	{ emoji: "🎀", name: "Ribbon", amount: 25000000, color: "bg-pink-300" },
];

const CARDS = ["🌸", "💖", "🦋", "⭐", "💎", "🎀"];

// Cute words for the word guessing game
const CUTE_WORDS = [
	"HEART", "BUNNY", "SWEET", "BLOOM", "FAIRY", "SUGAR", "HAPPY", "DREAM",
	"BLUSH", "PEARL", "DAISY", "CHARM", "SHINE", "ANGEL", "MAGIC", "HONEY",
	"LUCKY", "SMILE", "CLOUD", "CANDY", "SPARK", "CROWN", "JEWEL", "FLORA"
];

// Ball colors for the tube game - girly sparkly colors (distinct!)
const BALL_COLORS = [
	{ color: "pink-hot", name: "Hot Pink", solid: "#ff1493", light: "#ffb6c1" },
	{ color: "yellow-gold", name: "Gold", solid: "#ffd700", light: "#fff8dc" },
	{ color: "purple-violet", name: "Violet", solid: "#8a2be2", light: "#dda0dd" },
	{ color: "blue-sky", name: "Sky Blue", solid: "#00bfff", light: "#b0e0e6" },
	{ color: "green-mint", name: "Mint", solid: "#00fa9a", light: "#98fb98" },
	{ color: "orange-coral", name: "Coral", solid: "#ff6347", light: "#ffa07a" },
	{ color: "red-cherry", name: "Cherry", solid: "#dc143c", light: "#ffb6c1" },
	{ color: "teal-aqua", name: "Aqua", solid: "#40e0d0", light: "#afeeee" },
];

export default function GamePage() {
	const [money, setMoney] = useState<number>(0);
	const [userId, setUserId] = useState<string | null>(null);
	const [gameMode, setGameMode] = useState<"menu" | "wheel" | "memory" | "wordle" | "ballsort" | "racing">("menu");

	// Wheel game state
	const [isSpinning, setIsSpinning] = useState(false);
	const [rotation, setRotation] = useState(0);
	const [wheelResult, setWheelResult] = useState<typeof REWARDS[0] | null>(null);

	// Memory game state
	const [cards, setCards] = useState<{ emoji: string; id: number; flipped: boolean; matched: boolean }[]>([]);
	const [flippedCards, setFlippedCards] = useState<number[]>([]);
	const [matches, setMatches] = useState(0);
	const [moves, setMoves] = useState(0);
	const [memoryReward, setMemoryReward] = useState<number | null>(null);

	// Wordle game state
	const [targetWord, setTargetWord] = useState("");
	const [guesses, setGuesses] = useState<string[]>([]);
	const [currentGuess, setCurrentGuess] = useState("");
	const [wordleStatus, setWordleStatus] = useState<"playing" | "won" | "lost">("playing");
	const [wordleReward, setWordleReward] = useState<number | null>(null);

	// Ball Sort game state
	const [tubes, setTubes] = useState<string[][]>([]);
	const [selectedTube, setSelectedTube] = useState<number | null>(null);
	const [ballSortLevel, setBallSortLevel] = useState(1);
	const [ballSortMoves, setBallSortMoves] = useState(0);
	const [ballSortWon, setBallSortWon] = useState(false);
	const [ballSortReward, setBallSortReward] = useState<number | null>(null);

	// Racing game high score (game itself is in Racing3D component)
	const [racingHighScore, setRacingHighScore] = useState(0);

	// Load user data from API
	useEffect(() => {
		const loadUserData = async () => {
			const savedUserId = localStorage.getItem("userId");
			const savedBallSortLevel = localStorage.getItem("ballSortLevel");
			const savedRacingHighScore = localStorage.getItem("racingHighScore");
			if (savedBallSortLevel) {
				setBallSortLevel(parseInt(savedBallSortLevel));
			}
			if (savedRacingHighScore) {
				setRacingHighScore(parseInt(savedRacingHighScore));
			}
			if (savedUserId) {
				setUserId(savedUserId);
				try {
					const response = await fetch(`/api/user?userId=${savedUserId}`);
					const data = await response.json();
					if (data.success) {
						setMoney(parseInt(data.user.money));
					}
				} catch (error) {
					// Fallback to localStorage
					const saved = localStorage.getItem("healthWealth");
					if (saved) setMoney(parseInt(saved));
				}
			} else {
				const saved = localStorage.getItem("healthWealth");
				if (saved) setMoney(parseInt(saved));
			}
		};
		loadUserData();
	}, []);

	// Save money to API and localStorage
	const saveMoney = useCallback(async (newMoney: number) => {
		localStorage.setItem("healthWealth", newMoney.toString());
		if (userId) {
			try {
				await fetch("/api/user", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ userId, money: newMoney })
				});
			} catch (error) {
				console.error("Failed to save money:", error);
			}
		}
	}, [userId]);

	// Update money and save
	const addMoney = useCallback((amount: number) => {
		setMoney(prev => {
			const newMoney = prev + amount;
			saveMoney(newMoney);
			return newMoney;
		});
	}, [saveMoney]);

	const formatMoney = (amount: number) => {
		if (amount >= 1000000000) return (amount / 1000000000).toFixed(2) + "B";
		if (amount >= 1000000) return (amount / 1000000).toFixed(2) + "M";
		if (amount >= 1000) return (amount / 1000).toFixed(1) + "K";
		return amount.toString();
	};

	// Wheel game
	const spinWheel = () => {
		if (isSpinning) return;
		setIsSpinning(true);
		setWheelResult(null);

		const spins = 5 + Math.random() * 5; // 5-10 full rotations
		const extraDegrees = Math.random() * 360;
		const totalRotation = rotation + (spins * 360) + extraDegrees;

		setRotation(totalRotation);

		setTimeout(() => {
			const normalizedRotation = totalRotation % 360;
			const segmentAngle = 360 / REWARDS.length;
			const winningIndex = Math.floor((360 - normalizedRotation + segmentAngle / 2) % 360 / segmentAngle);
			const reward = REWARDS[winningIndex % REWARDS.length];

			setWheelResult(reward);
			addMoney(reward.amount);
			setIsSpinning(false);
		}, 4000);
	};

	// Memory game
	const initMemoryGame = () => {
		const shuffled = [...CARDS, ...CARDS]
			.sort(() => Math.random() - 0.5)
			.map((emoji, index) => ({ emoji, id: index, flipped: false, matched: false }));
		setCards(shuffled);
		setFlippedCards([]);
		setMatches(0);
		setMoves(0);
		setMemoryReward(null);
		setGameMode("memory");
	};

	const flipCard = (id: number) => {
		if (flippedCards.length === 2) return;
		if (cards[id].flipped || cards[id].matched) return;

		const newCards = [...cards];
		newCards[id].flipped = true;
		setCards(newCards);
		setFlippedCards([...flippedCards, id]);

		if (flippedCards.length === 1) {
			setMoves(m => m + 1);
			const firstCard = cards[flippedCards[0]];
			const secondCard = newCards[id];

			if (firstCard.emoji === secondCard.emoji) {
				// Match!
				setTimeout(() => {
					const matchedCards = [...newCards];
					matchedCards[flippedCards[0]].matched = true;
					matchedCards[id].matched = true;
					setCards(matchedCards);
					setFlippedCards([]);
					setMatches(m => {
						const newMatches = m + 1;
						if (newMatches === CARDS.length) {
							// Game complete!
							const reward = Math.max(500000000 - (moves * 10000000), 100000000);
							setMemoryReward(reward);
							addMoney(reward);
						}
						return newMatches;
					});
				}, 500);
			} else {
				// No match
				setTimeout(() => {
					const resetCards = [...newCards];
					resetCards[flippedCards[0]].flipped = false;
					resetCards[id].flipped = false;
					setCards(resetCards);
					setFlippedCards([]);
				}, 1000);
			}
		}
	};

	// Wordle game
	const initWordleGame = () => {
		const word = CUTE_WORDS[Math.floor(Math.random() * CUTE_WORDS.length)];
		setTargetWord(word);
		setGuesses([]);
		setCurrentGuess("");
		setWordleStatus("playing");
		setWordleReward(null);
		setGameMode("wordle");
	};

	// Ball Sort game
	const initBallSortGame = (level: number) => {
		// Level determines number of colors (3-8) and empty tubes
		// Level 1-2: 3 colors, Level 3-4: 4 colors, etc.
		const numColors = Math.min(3 + Math.floor((level - 1) / 2), 8);
		const ballsPerTube = 4;
		const numEmptyTubes = 2; // Always 2 empty tubes for easier gameplay

		// Create balls array with 4 of each color
		const allBalls: string[] = [];
		for (let i = 0; i < numColors; i++) {
			for (let j = 0; j < ballsPerTube; j++) {
				allBalls.push(BALL_COLORS[i].color);
			}
		}

		// Shuffle the balls
		for (let i = allBalls.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[allBalls[i], allBalls[j]] = [allBalls[j], allBalls[i]];
		}

		// Distribute balls into tubes
		const newTubes: string[][] = [];
		for (let i = 0; i < numColors; i++) {
			newTubes.push(allBalls.slice(i * ballsPerTube, (i + 1) * ballsPerTube));
		}

		// Add empty tubes
		for (let i = 0; i < numEmptyTubes; i++) {
			newTubes.push([]);
		}

		setTubes(newTubes);
		setSelectedTube(null);
		setBallSortMoves(0);
		setBallSortWon(false);
		setBallSortReward(null);
		setBallSortLevel(level);
		localStorage.setItem("ballSortLevel", level.toString());
		setGameMode("ballsort");
	};

	const selectTube = (tubeIndex: number) => {
		if (ballSortWon) return;

		if (selectedTube === null) {
			// First selection - select if tube has balls
			if (tubes[tubeIndex].length > 0) {
				setSelectedTube(tubeIndex);
			}
		} else if (selectedTube === tubeIndex) {
			// Deselect
			setSelectedTube(null);
		} else {
			// Try to move ball
			const fromTube = tubes[selectedTube];
			const toTube = tubes[tubeIndex];

			if (fromTube.length === 0) {
				setSelectedTube(null);
				return;
			}

			const ballToMove = fromTube[fromTube.length - 1];

			// Can only move if target is empty OR has same color on top AND isn't full
			const canMove = toTube.length < 4 && (toTube.length === 0 || toTube[toTube.length - 1] === ballToMove);

			if (canMove) {
				const newTubes = tubes.map((tube, i) => {
					if (i === selectedTube) return tube.slice(0, -1);
					if (i === tubeIndex) return [...tube, ballToMove];
					return tube;
				});
				setTubes(newTubes);
				setBallSortMoves(m => m + 1);

				// Check for win
				const isWon = newTubes.every(tube => {
					if (tube.length === 0) return true;
					if (tube.length !== 4) return false;
					return tube.every(ball => ball === tube[0]);
				});

				if (isWon) {
					setBallSortWon(true);
					// Higher level = more reward
					const baseReward = 100000000;
					const levelBonus = ballSortLevel * 50000000;
					const movesPenalty = Math.min(ballSortMoves * 1000000, levelBonus);
					const reward = baseReward + levelBonus - movesPenalty;
					setBallSortReward(reward);
					addMoney(reward);
					// Save next level
					localStorage.setItem("ballSortLevel", (ballSortLevel + 1).toString());
				}
			}
			setSelectedTube(null);
		}
	};

	const handleKeyPress = (key: string) => {
		if (wordleStatus !== "playing") return;

		if (key === "ENTER") {
			if (currentGuess.length === 5) {
				const newGuesses = [...guesses, currentGuess];
				setGuesses(newGuesses);

				if (currentGuess === targetWord) {
					// Won!
					const reward = Math.max(600000000 - (newGuesses.length * 80000000), 100000000);
					setWordleReward(reward);
					addMoney(reward);
					setWordleStatus("won");
				} else if (newGuesses.length >= 6) {
					// Lost
					setWordleStatus("lost");
				}

				setCurrentGuess("");
			}
		} else if (key === "DELETE") {
			setCurrentGuess(prev => prev.slice(0, -1));
		} else if (currentGuess.length < 5 && /^[A-Z]$/.test(key)) {
			setCurrentGuess(prev => prev + key);
		}
	};

	const getLetterStatus = (letter: string, index: number, guess: string) => {
		if (targetWord[index] === letter) {
			return "correct"; // Green - correct position
		} else if (targetWord.includes(letter)) {
			return "present"; // Yellow - wrong position
		}
		return "absent"; // Gray - not in word
	};

	const KEYBOARD = [
		["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
		["A", "S", "D", "F", "G", "H", "J", "K", "L"],
		["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DELETE"]
	];

	const getKeyStatus = (key: string) => {
		for (const guess of guesses) {
			for (let i = 0; i < guess.length; i++) {
				if (guess[i] === key) {
					if (targetWord[i] === key) return "correct";
					if (targetWord.includes(key)) return "present";
					return "absent";
				}
			}
		}
		return "unused";
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-pink-200 relative overflow-hidden">
			{/* Floating decorations */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-10 left-10 text-6xl opacity-20 animate-bounce">🎮</div>
				<div className="absolute top-20 right-20 text-5xl opacity-20 animate-pulse">💎</div>
				<div className="absolute bottom-20 left-20 text-7xl opacity-20 animate-bounce">🎀</div>
				<div className="absolute bottom-40 right-10 text-6xl opacity-20 animate-pulse">⭐</div>
			</div>

			{/* Header */}
			<div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-lg z-50 px-4 py-3">
				<div className="max-w-4xl mx-auto flex items-center justify-between">
					<Link href="/" className="flex items-center gap-2 text-pink-500 font-bold hover:text-pink-600 transition-colors">
						<span className="text-2xl">←</span>
						<span>Back to Pills</span>
					</Link>
					<div className="flex items-center gap-3 bg-green-100 px-4 py-2 rounded-full border-2 border-green-400">
						<span className="text-2xl">💵</span>
						<span className="text-xl font-bold text-green-600">${formatMoney(money)}</span>
					</div>
				</div>
			</div>

			<div className="pt-24 pb-12 px-4">
				{gameMode === "menu" && (
					<div className="max-w-2xl mx-auto">
						<h1 className="text-4xl font-bold text-center text-pink-600 mb-2">🎮 Mini Games 🎮</h1>
						<p className="text-center text-pink-400 mb-8">Play games to earn more money!</p>

						<div className="grid gap-6">
							{/* Spin Wheel Game */}
							<button
								onClick={() => setGameMode("wheel")}
								className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-4 border-purple-300 hover:border-purple-400 hover:scale-105 transition-all duration-300 text-left"
							>
								<div className="flex items-center gap-6">
									<div className="text-6xl">🎡</div>
									<div>
										<h2 className="text-2xl font-bold text-purple-600 mb-2">Lucky Spin Wheel</h2>
										<p className="text-purple-400">Spin the wheel and win up to $500M!</p>
										<div className="mt-2 flex gap-2">
											{["💎", "💰", "💵", "⭐"].map((e, i) => (
												<span key={i} className="text-2xl">{e}</span>
											))}
										</div>
									</div>
								</div>
							</button>

							{/* Memory Game */}
							<button
								onClick={initMemoryGame}
								className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-4 border-pink-300 hover:border-pink-400 hover:scale-105 transition-all duration-300 text-left"
							>
								<div className="flex items-center gap-6">
									<div className="text-6xl">🃏</div>
									<div>
										<h2 className="text-2xl font-bold text-pink-600 mb-2">Memory Match</h2>
										<p className="text-pink-400">Match all pairs - fewer moves = more money!</p>
										<div className="mt-2 flex gap-2">
											{CARDS.map((e, i) => (
												<span key={i} className="text-2xl">{e}</span>
											))}
										</div>
									</div>
								</div>
							</button>

							{/* Wordle Game */}
							<button
								onClick={initWordleGame}
								className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-4 border-cyan-300 hover:border-cyan-400 hover:scale-105 transition-all duration-300 text-left"
							>
								<div className="flex items-center gap-6">
									<div className="text-6xl">🔤</div>
									<div>
										<h2 className="text-2xl font-bold text-cyan-600 mb-2">Guess the Word</h2>
										<p className="text-cyan-400">Find the cute 5-letter word in 6 tries!</p>
										<div className="mt-2 flex gap-2">
											<span className="px-2 py-1 bg-green-500 text-white text-sm rounded">✓ Correct</span>
											<span className="px-2 py-1 bg-yellow-500 text-white text-sm rounded">↔ Wrong Place</span>
											<span className="px-2 py-1 bg-gray-400 text-white text-sm rounded">✗ Wrong</span>
										</div>
									</div>
								</div>
							</button>

							{/* Ball Sort Game */}
							<button
								onClick={() => initBallSortGame(ballSortLevel)}
								className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-4 border-orange-300 hover:border-orange-400 hover:scale-105 transition-all duration-300 text-left"
							>
								<div className="flex items-center gap-6">
									<div className="text-6xl">🧪</div>
									<div>
										<h2 className="text-2xl font-bold text-orange-600 mb-2">Ball Sort Puzzle</h2>
										<p className="text-orange-400">Sort the balls by color! Higher levels = more money!</p>
										<div className="mt-2 flex items-center gap-3">
											<span className="px-3 py-1 bg-orange-500 text-white text-sm rounded-full font-bold">
												Level {ballSortLevel}
											</span>
											<span className="text-sm text-orange-500">
												💰 ${formatMoney(100000000 + ballSortLevel * 50000000)}+
											</span>
										</div>
										<div className="mt-2 flex gap-1">
											{BALL_COLORS.slice(0, 5).map((c, i) => (
												<div key={i} className={`w-5 h-5 rounded-full ${c.color}`} />
											))}
										</div>
									</div>
								</div>
							</button>

							{/* Racing Game */}
							<button
								onClick={() => setGameMode("racing")}
								className="bg-gradient-to-br from-gray-900 to-purple-900 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-4 border-pink-500/50 hover:border-cyan-400/80 hover:scale-105 transition-all duration-300 text-left"
							>
								<div className="flex items-center gap-6">
									<div className="text-6xl">🏎️</div>
									<div>
										<h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">Neon Rush 3D</h2>
										<p className="text-purple-300">Race through neon city! Collect coins in stunning 3D!</p>
										<div className="mt-2 flex items-center gap-3">
											<span className="px-3 py-1 bg-gradient-to-r from-pink-500 to-cyan-500 text-white text-sm rounded-full font-bold">
												High Score: {racingHighScore}
											</span>
											<span className="text-sm text-pink-400">
												💰 Score × $1M
											</span>
										</div>
										<div className="mt-2 flex gap-2 text-2xl">
											<span>🚗</span>
											<span>💰</span>
											<span>🛡️</span>
											<span>🔥</span>
										</div>
									</div>
								</div>
							</button>
						</div>
					</div>
				)}

				{gameMode === "wheel" && (
					<div className="max-w-lg mx-auto text-center">
						<button
							onClick={() => setGameMode("menu")}
							className="mb-6 text-purple-500 font-bold hover:text-purple-600"
						>
							← Back to Games
						</button>

						<h1 className="text-3xl font-bold text-purple-600 mb-6">🎡 Lucky Spin Wheel 🎡</h1>

						{/* Wheel */}
						<div className="relative w-72 h-72 mx-auto mb-6">
							{/* Pointer */}
							<div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10 text-4xl">
								▼
							</div>

							{/* Wheel segments */}
							<div
								className="w-full h-full rounded-full border-8 border-purple-400 shadow-2xl overflow-hidden relative"
								style={{
									transform: `rotate(${rotation}deg)`,
									transition: isSpinning ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
								}}
							>
								{REWARDS.map((reward, index) => {
									const angle = (360 / REWARDS.length) * index;
									return (
										<div
											key={index}
											className={`absolute w-1/2 h-1/2 origin-bottom-right ${reward.color}`}
											style={{
												transform: `rotate(${angle}deg) skewY(${90 - 360 / REWARDS.length}deg)`,
												transformOrigin: "bottom right",
												left: "50%",
												top: "0",
											}}
										>
											<span
												className="absolute text-2xl"
												style={{
													transform: `skewY(${-(90 - 360 / REWARDS.length)}deg) rotate(${180 / REWARDS.length}deg)`,
													left: "20%",
													top: "40%",
												}}
											>
												{reward.emoji}
											</span>
										</div>
									);
								})}
								{/* Center circle */}
								<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full border-4 border-purple-400 flex items-center justify-center text-2xl shadow-lg">
									🎰
								</div>
							</div>
						</div>

						{/* Spin Button */}
						<button
							onClick={spinWheel}
							disabled={isSpinning}
							className={`px-12 py-4 rounded-full text-xl font-bold text-white shadow-xl transition-all ${isSpinning
								? "bg-gray-400 cursor-not-allowed"
								: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-105"
								}`}
						>
							{isSpinning ? "Spinning... 🎡" : "SPIN! 🎰"}
						</button>

						{/* Result */}
						{wheelResult && (
							<div className="mt-6 bg-white/90 rounded-2xl p-6 shadow-xl border-4 border-green-400 animate-bounce">
								<div className="text-4xl mb-2">{wheelResult.emoji}</div>
								<div className="text-2xl font-bold text-green-600">
									You won ${formatMoney(wheelResult.amount)}!
								</div>
							</div>
						)}
					</div>
				)}

				{gameMode === "memory" && (
					<div className="max-w-lg mx-auto text-center">
						<button
							onClick={() => setGameMode("menu")}
							className="mb-6 text-pink-500 font-bold hover:text-pink-600"
						>
							← Back to Games
						</button>

						<h1 className="text-3xl font-bold text-pink-600 mb-2">🃏 Memory Match 🃏</h1>
						<p className="text-pink-400 mb-4">Moves: {moves} | Matches: {matches}/{CARDS.length}</p>

						{/* Cards Grid */}
						<div className="grid grid-cols-4 gap-3 mb-6">
							{cards.map((card) => (
								<button
									key={card.id}
									onClick={() => flipCard(card.id)}
									className={`aspect-square rounded-xl text-4xl flex items-center justify-center transition-all duration-300 transform ${card.flipped || card.matched
										? "bg-white border-4 border-pink-400 rotate-0"
										: "bg-gradient-to-br from-pink-400 to-purple-400 border-4 border-pink-300 hover:scale-105"
										} ${card.matched ? "opacity-50" : ""}`}
									disabled={card.matched}
								>
									{card.flipped || card.matched ? card.emoji : "❓"}
								</button>
							))}
						</div>

						{/* Result */}
						{memoryReward && (
							<div className="bg-white/90 rounded-2xl p-6 shadow-xl border-4 border-green-400 animate-bounce">
								<div className="text-4xl mb-2">🎉</div>
								<div className="text-2xl font-bold text-green-600 mb-2">
									Congratulations!
								</div>
								<div className="text-xl text-green-500">
									You won ${formatMoney(memoryReward)}!
								</div>
								<button
									onClick={initMemoryGame}
									className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-full font-bold hover:bg-pink-600"
								>
									Play Again 🔄
								</button>
							</div>
						)}

						{!memoryReward && (
							<button
								onClick={initMemoryGame}
								className="px-6 py-2 bg-pink-500 text-white rounded-full font-bold hover:bg-pink-600"
							>
								Restart 🔄
							</button>
						)}
					</div>
				)}

				{gameMode === "wordle" && (
					<div className="max-w-lg mx-auto text-center">
						<button
							onClick={() => setGameMode("menu")}
							className="mb-6 text-cyan-500 font-bold hover:text-cyan-600"
						>
							← Back to Games
						</button>

						<h1 className="text-3xl font-bold text-cyan-600 mb-2">🔤 Guess the Word 🔤</h1>
						<p className="text-cyan-400 mb-4">Find the cute 5-letter word!</p>

						{/* Legend */}
						<div className="flex justify-center gap-3 mb-4 text-sm">
							<span className="px-2 py-1 bg-green-500 text-white rounded">✓ Correct</span>
							<span className="px-2 py-1 bg-yellow-500 text-white rounded">↔ Wrong Place</span>
							<span className="px-2 py-1 bg-gray-400 text-white rounded">✗ Wrong</span>
						</div>

						{/* Guess Grid */}
						<div className="grid gap-2 mb-6">
							{Array.from({ length: 6 }, (_, rowIndex) => {
								const guess = guesses[rowIndex] || (rowIndex === guesses.length ? currentGuess : "");
								const isSubmitted = rowIndex < guesses.length;

								return (
									<div key={rowIndex} className="flex justify-center gap-2">
										{Array.from({ length: 5 }, (_, colIndex) => {
											const letter = guess[colIndex] || "";
											const status = isSubmitted ? getLetterStatus(letter, colIndex, guess) : "";

											let bgColor = "bg-white border-pink-300";
											if (isSubmitted) {
												if (status === "correct") bgColor = "bg-green-500 border-green-600 text-white";
												else if (status === "present") bgColor = "bg-yellow-500 border-yellow-600 text-white";
												else bgColor = "bg-gray-400 border-gray-500 text-white";
											}

											return (
												<div
													key={colIndex}
													className={`w-14 h-14 flex items-center justify-center text-2xl font-bold border-4 rounded-lg ${bgColor} ${letter && !isSubmitted ? "border-pink-500" : ""} transition-all`}
												>
													{letter}
												</div>
											);
										})}
									</div>
								);
							})}
						</div>

						{/* Keyboard */}
						{wordleStatus === "playing" && (
							<div className="space-y-2">
								{KEYBOARD.map((row, rowIndex) => (
									<div key={rowIndex} className="flex justify-center gap-1">
										{row.map((key) => {
											const keyStatus = getKeyStatus(key);
											let bgColor = "bg-pink-200 hover:bg-pink-300";
											if (keyStatus === "correct") bgColor = "bg-green-500 text-white";
											else if (keyStatus === "present") bgColor = "bg-yellow-500 text-white";
											else if (keyStatus === "absent") bgColor = "bg-gray-400 text-white";

											return (
												<button
													key={key}
													onClick={() => handleKeyPress(key)}
													className={`${key.length > 1 ? "px-3" : "px-4"} py-3 rounded-lg font-bold text-sm ${bgColor} transition-all hover:scale-105`}
												>
													{key === "DELETE" ? "⌫" : key}
												</button>
											);
										})}
									</div>
								))}
							</div>
						)}

						{/* Result */}
						{wordleStatus !== "playing" && (
							<div className={`bg-white/90 rounded-2xl p-6 shadow-xl border-4 ${wordleStatus === "won" ? "border-green-400" : "border-red-400"} animate-bounce`}>
								{wordleStatus === "won" ? (
									<>
										<div className="text-4xl mb-2">🎉💖✨</div>
										<div className="text-2xl font-bold text-green-600 mb-2">
											Amazing! You got it!
										</div>
										<div className="text-xl text-green-500 mb-2">
											You won ${formatMoney(wordleReward!)}!
										</div>
										<div className="text-lg text-pink-500">
											The word was: <span className="font-bold">{targetWord}</span>
										</div>
									</>
								) : (
									<>
										<div className="text-4xl mb-2">😢💔</div>
										<div className="text-2xl font-bold text-red-500 mb-2">
											Oops! Better luck next time!
										</div>
										<div className="text-lg text-pink-500">
											The word was: <span className="font-bold">{targetWord}</span>
										</div>
									</>
								)}
								<button
									onClick={initWordleGame}
									className="mt-4 px-6 py-2 bg-cyan-500 text-white rounded-full font-bold hover:bg-cyan-600"
								>
									Play Again 🔄
								</button>
							</div>
						)}
					</div>
				)}

				{/* Ball Sort Game */}
				{gameMode === "ballsort" && (
					<div className="max-w-2xl mx-auto text-center">
						<button
							onClick={() => setGameMode("menu")}
							className="mb-6 text-orange-500 hover:text-orange-600 font-bold"
						>
							← Back to Games
						</button>

						<h2 className="text-3xl font-bold text-orange-600 mb-2">🧪 Ball Sort Puzzle 🧪</h2>
						<div className="flex justify-center items-center gap-4 mb-4">
							<span className="px-4 py-2 bg-orange-500 text-white rounded-full font-bold text-lg">
								Level {ballSortLevel}
							</span>
							<span className="px-4 py-2 bg-white/80 rounded-full text-orange-600 font-medium">
								Moves: {ballSortMoves}
							</span>
						</div>
						<p className="text-orange-400 mb-6">Tap a tube to select, then tap another to move the top ball!</p>

						{/* Tubes */}
						<div className="flex flex-wrap justify-center gap-4 md:gap-5 mb-8">
							{tubes.map((tube, tubeIndex) => (
								<div
									key={tubeIndex}
									onClick={() => selectTube(tubeIndex)}
									className={`
                    relative w-16 md:w-20 cursor-pointer
                    transition-all duration-300 ease-out
                    ${selectedTube === tubeIndex
											? "scale-110 -translate-y-3"
											: "hover:scale-105 hover:-translate-y-1"
										}
                  `}
								>
									{/* Glass tube effect */}
									<div className={`
                    relative h-40 md:h-48 rounded-b-3xl overflow-hidden
                    border-4 transition-colors duration-200
                    ${selectedTube === tubeIndex
											? "border-orange-400 shadow-lg shadow-orange-200"
											: "border-slate-300 hover:border-orange-300"
										}
                  `}
										style={{
											background: selectedTube === tubeIndex
												? "linear-gradient(180deg, rgba(255,237,213,0.9) 0%, rgba(254,215,170,0.8) 100%)"
												: "linear-gradient(180deg, rgba(248,250,252,0.9) 0%, rgba(226,232,240,0.8) 100%)"
										}}
									>
										{/* Tube shine effect */}
										<div className="absolute left-1 top-0 bottom-0 w-2 bg-white/40 rounded-full" />

										{/* Tube opening rim */}
										<div className={`
                      absolute -top-0.5 -left-1 -right-1 h-3 rounded-t-xl
                      ${selectedTube === tubeIndex ? "bg-orange-400" : "bg-slate-400"}
                    `} />
										<div className={`
                      absolute top-1 left-0 right-0 h-1
                      ${selectedTube === tubeIndex ? "bg-orange-300" : "bg-slate-300"}
                    `} />

										{/* Balls container */}
										<div className="absolute bottom-2 left-1 right-1 flex flex-col-reverse gap-0.5">
											{tube.map((ballColor, ballIndex) => {
												// Get colors from BALL_COLORS
												const colorInfo = BALL_COLORS.find(c => c.color === ballColor);
												const solidColor = colorInfo?.solid || "#ff69b4";
												const lighterColor = colorInfo?.light || "#ffc0cb";

												return (
													<div
														key={ballIndex}
														className={`
                              relative w-8 h-8 md:w-10 md:h-10 mx-auto rounded-full
                              shadow-lg border-2 border-white/80
                              ${selectedTube === tubeIndex && ballIndex === tube.length - 1
																? "animate-bounce"
																: ""
															}
                            `}
														style={{
															background: `radial-gradient(circle at 25% 25%, white 0%, ${lighterColor} 20%, ${solidColor} 80%)`,
															boxShadow: `inset 0 -4px 8px rgba(0,0,0,0.15), inset 0 4px 8px rgba(255,255,255,0.6), 0 2px 6px rgba(0,0,0,0.2), 0 0 8px ${solidColor}40`
														}}
													>
														{/* Sparkle effects */}
														<div className="absolute top-1 left-1.5 w-1.5 h-1.5 bg-white rounded-full opacity-90" />
														<div className="absolute top-2 left-3 w-1 h-1 bg-white rounded-full opacity-70" />
														<div className="absolute top-1 right-2 w-0.5 h-0.5 bg-white rounded-full opacity-60" />
													</div>
												);
											})}
										</div>

										{/* Empty indicator */}
										{tube.length === 0 && (
											<div className="absolute inset-0 flex items-center justify-center">
												<span className={`text-3xl ${selectedTube === tubeIndex ? "text-orange-300" : "text-slate-300"}`}>↓</span>
											</div>
										)}
									</div>

									{/* Tube base */}
									<div className={`
                    h-2 mx-1 rounded-b-lg
                    ${selectedTube === tubeIndex ? "bg-orange-400" : "bg-slate-400"}
                  `} />
								</div>
							))}
						</div>

						{/* Control buttons */}
						<div className="flex justify-center gap-4 mb-6">
							<button
								onClick={() => initBallSortGame(ballSortLevel)}
								className="px-6 py-3 bg-gray-400 text-white rounded-full font-bold hover:bg-gray-500 transition-colors"
							>
								🔄 Restart Level
							</button>
						</div>

						{/* Win overlay */}
						{ballSortWon && (
							<div className="bg-white/95 rounded-3xl p-8 shadow-2xl border-4 border-green-400 animate-bounce">
								<div className="text-5xl mb-4">🎉🧪✨</div>
								<div className="text-3xl font-bold text-green-600 mb-3">
									Level {ballSortLevel} Complete!
								</div>
								<div className="text-2xl text-green-500 mb-4">
									You won ${formatMoney(ballSortReward!)}! 💰
								</div>
								<div className="text-lg text-orange-500 mb-6">
									Completed in {ballSortMoves} moves
								</div>
								<button
									onClick={() => initBallSortGame(ballSortLevel + 1)}
									className="px-8 py-4 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-full font-bold text-xl hover:from-orange-500 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl hover:scale-105"
								>
									Next Level → Level {ballSortLevel + 1} 🚀
								</button>
							</div>
						)}
					</div>
				)}

				{/* Racing Game - 3D */}
				{gameMode === "racing" && (
					<Racing3D
						onExit={() => setGameMode("menu")}
						onEarnMoney={(amount) => addMoney(amount)}
						formatMoney={formatMoney}
					/>
				)}
			</div>
		</div>
	);
}
