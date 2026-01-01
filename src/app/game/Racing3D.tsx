"use client";

import { useRef, useState, useEffect, useCallback, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Types
interface Obstacle {
	id: number;
	lane: number;
	z: number;
	type: "car" | "coin" | "diamond" | "shield" | "nitro";
	collected?: boolean;
}

interface GameState {
	score: number;
	highScore: number;
	isPlaying: boolean;
	gameOver: boolean;
	carLane: number;
	speed: number;
	combo: number;
	hasShield: boolean;
	shieldTime: number;
	hasNitro: boolean;
	obstacles: Obstacle[];
	reward: number | null;
}

// 3D Car Component - Cute Pink Convertible
function Car({ lane, hasShield, hasNitro }: { lane: number; hasShield: boolean; hasNitro: boolean }) {
	const carRef = useRef<THREE.Group>(null);
	const targetX = (lane - 1) * 2.5;
	
	useFrame((_, delta) => {
		if (carRef.current) {
			// Smooth lane transition
			carRef.current.position.x = THREE.MathUtils.lerp(
				carRef.current.position.x,
				targetX,
				delta * 12
			);
			// Slight tilt when moving
			const diff = targetX - carRef.current.position.x;
			carRef.current.rotation.z = THREE.MathUtils.lerp(
				carRef.current.rotation.z,
				diff * 0.15,
				delta * 8
			);
			// Bobbing effect
			carRef.current.position.y = Math.sin(Date.now() * 0.005) * 0.02 + 0.3;
		}
	});

	return (
		<group ref={carRef} position={[0, 0.3, 8]}>
			{/* Car body - Hot Pink */}
			<mesh position={[0, 0.25, 0]}>
				<boxGeometry args={[1.2, 0.5, 2]} />
				<meshStandardMaterial color="#ff69b4" metalness={0.9} roughness={0.1} emissive="#ff1493" emissiveIntensity={0.2} />
			</mesh>
			{/* Car interior - open convertible */}
			<mesh position={[0, 0.45, 0.3]}>
				<boxGeometry args={[0.9, 0.2, 1]} />
				<meshStandardMaterial color="#ffb6c1" metalness={0.5} roughness={0.3} />
			</mesh>
			{/* Windshield */}
			<mesh position={[0, 0.5, -0.4]} rotation={[0.3, 0, 0]}>
				<boxGeometry args={[1, 0.35, 0.05]} />
				<meshStandardMaterial color="#87ceeb" metalness={0.9} roughness={0.1} transparent opacity={0.6} />
			</mesh>
			{/* Headlights - sparkly */}
			<mesh position={[0.4, 0.2, -1]}>
				<sphereGeometry args={[0.15, 16, 16]} />
				<meshStandardMaterial color="#fff0f5" emissive="#ffffff" emissiveIntensity={3} />
			</mesh>
			<mesh position={[-0.4, 0.2, -1]}>
				<sphereGeometry args={[0.15, 16, 16]} />
				<meshStandardMaterial color="#fff0f5" emissive="#ffffff" emissiveIntensity={3} />
			</mesh>
			{/* Tail lights - cute pink */}
			<mesh position={[0.4, 0.2, 1]}>
				<sphereGeometry args={[0.12, 16, 16]} />
				<meshStandardMaterial color="#ff1493" emissive="#ff1493" emissiveIntensity={2} />
			</mesh>
			<mesh position={[-0.4, 0.2, 1]}>
				<sphereGeometry args={[0.12, 16, 16]} />
				<meshStandardMaterial color="#ff1493" emissive="#ff1493" emissiveIntensity={2} />
			</mesh>
			{/* Wheels - white with pink */}
			{[[-0.6, 0, -0.6], [0.6, 0, -0.6], [-0.6, 0, 0.6], [0.6, 0, 0.6]].map((pos, i) => (
				<mesh key={i} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
					<cylinderGeometry args={[0.22, 0.22, 0.15, 16]} />
					<meshStandardMaterial color="#fff0f5" metalness={0.5} roughness={0.3} />
				</mesh>
			))}
			{/* Sparkle decorations */}
			<mesh position={[0, 0.55, 0.8]}>
				<sphereGeometry args={[0.08, 8, 8]} />
				<meshStandardMaterial color="#ffffff" emissive="#ff69b4" emissiveIntensity={2} />
			</mesh>
			{/* Shield effect */}
			{hasShield && (
				<mesh position={[0, 0.4, 0]}>
					<sphereGeometry args={[1.5, 32, 32]} />
					<meshStandardMaterial 
						color="#00ffff" 
						transparent 
						opacity={0.3} 
						emissive="#00ffff"
						emissiveIntensity={0.5}
					/>
				</mesh>
			)}
			{/* Nitro flames */}
			{hasNitro && (
				<>
					<mesh position={[-0.3, 0.15, 1.2]}>
						<coneGeometry args={[0.15, 0.8, 8]} />
						<meshStandardMaterial color="#ff6600" emissive="#ff3300" emissiveIntensity={3} transparent opacity={0.8} />
					</mesh>
					<mesh position={[0.3, 0.15, 1.2]}>
						<coneGeometry args={[0.15, 0.8, 8]} />
						<meshStandardMaterial color="#ff6600" emissive="#ff3300" emissiveIntensity={3} transparent opacity={0.8} />
					</mesh>
				</>
			)}
		</group>
	);
}

// Obstacle Car Component
function ObstacleCar({ position, color }: { position: [number, number, number]; color: string }) {
	const carRef = useRef<THREE.Group>(null);
	
	useFrame(() => {
		if (carRef.current) {
			carRef.current.rotation.y = Math.sin(Date.now() * 0.001) * 0.05;
		}
	});

	return (
		<group ref={carRef} position={position}>
			<mesh position={[0, 0.25, 0]}>
				<boxGeometry args={[1.1, 0.45, 1.8]} />
				<meshStandardMaterial color={color} metalness={0.7} roughness={0.2} />
			</mesh>
			<mesh position={[0, 0.55, 0.15]}>
				<boxGeometry args={[0.9, 0.3, 1]} />
				<meshStandardMaterial color={color} metalness={0.7} roughness={0.2} />
			</mesh>
			<mesh position={[0, 0.6, 0.15]}>
				<boxGeometry args={[0.8, 0.2, 0.9]} />
				<meshStandardMaterial color="#87ceeb" metalness={0.9} roughness={0.1} transparent opacity={0.7} />
			</mesh>
		</group>
	);
}

// Coin Component
function Coin({ position }: { position: [number, number, number] }) {
	const coinRef = useRef<THREE.Mesh>(null);
	
	useFrame((_, delta) => {
		if (coinRef.current) {
			coinRef.current.rotation.y += delta * 3;
			coinRef.current.position.y = position[1] + Math.sin(Date.now() * 0.005) * 0.2;
		}
	});

	return (
		<mesh ref={coinRef} position={position}>
			<cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
			<meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} emissive="#ffa500" emissiveIntensity={0.5} />
		</mesh>
	);
}

// Diamond Component
function Diamond({ position }: { position: [number, number, number] }) {
	const diamondRef = useRef<THREE.Mesh>(null);
	
	useFrame((_, delta) => {
		if (diamondRef.current) {
			diamondRef.current.rotation.y += delta * 2;
			diamondRef.current.position.y = position[1] + Math.sin(Date.now() * 0.004) * 0.3;
		}
	});

	return (
		<mesh ref={diamondRef} position={position}>
			<octahedronGeometry args={[0.5, 0]} />
			<meshStandardMaterial color="#ff00ff" metalness={1} roughness={0} emissive="#ff00ff" emissiveIntensity={0.8} />
		</mesh>
	);
}

// Shield Powerup Component
function ShieldPowerup({ position }: { position: [number, number, number] }) {
	const shieldRef = useRef<THREE.Mesh>(null);
	
	useFrame((_, delta) => {
		if (shieldRef.current) {
			shieldRef.current.rotation.y += delta * 2;
			shieldRef.current.position.y = position[1] + Math.sin(Date.now() * 0.003) * 0.2;
		}
	});

	return (
		<mesh ref={shieldRef} position={position}>
			<dodecahedronGeometry args={[0.5, 0]} />
			<meshStandardMaterial color="#00ffff" metalness={0.8} roughness={0.2} emissive="#00ffff" emissiveIntensity={1} />
		</mesh>
	);
}

// Nitro Powerup Component
function NitroPowerup({ position }: { position: [number, number, number] }) {
	const nitroRef = useRef<THREE.Mesh>(null);
	
	useFrame((_, delta) => {
		if (nitroRef.current) {
			nitroRef.current.rotation.z += delta * 4;
			nitroRef.current.position.y = position[1] + Math.sin(Date.now() * 0.006) * 0.15;
		}
	});

	return (
		<mesh ref={nitroRef} position={position}>
			<torusGeometry args={[0.35, 0.15, 8, 16]} />
			<meshStandardMaterial color="#ff6600" metalness={0.7} roughness={0.3} emissive="#ff3300" emissiveIntensity={1.5} />
		</mesh>
	);
}

// Road Component - Cute Pink Barbie Road
function Road({ speed, isPlaying }: { speed: number; isPlaying: boolean }) {
	const roadRef = useRef<THREE.Mesh>(null);
	const lineRefs = useRef<THREE.Mesh[]>([]);
	const offsetRef = useRef(0);

	useFrame((_, delta) => {
		if (isPlaying) {
			offsetRef.current += delta * speed * 5;
			
			// Animate road lines
			lineRefs.current.forEach((line, i) => {
				if (line) {
					const baseZ = i * 4 - 40;
					line.position.z = ((baseZ + offsetRef.current) % 80) - 40;
				}
			});
		}
	});

	return (
		<group>
			{/* Road surface - Pink sparkly */}
			<mesh ref={roadRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
				<planeGeometry args={[10, 200]} />
				<meshStandardMaterial color="#ffb6c1" metalness={0.3} roughness={0.5} />
			</mesh>
			
			{/* Grass on sides - light green */}
			<mesh position={[-8, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
				<planeGeometry args={[6, 200]} />
				<meshStandardMaterial color="#90ee90" />
			</mesh>
			<mesh position={[8, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
				<planeGeometry args={[6, 200]} />
				<meshStandardMaterial color="#90ee90" />
			</mesh>
			
			{/* Road edges - hot pink glowing */}
			<mesh position={[-5, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
				<planeGeometry args={[0.4, 200]} />
				<meshStandardMaterial color="#ff1493" emissive="#ff1493" emissiveIntensity={1} />
			</mesh>
			<mesh position={[5, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
				<planeGeometry args={[0.4, 200]} />
				<meshStandardMaterial color="#ff1493" emissive="#ff1493" emissiveIntensity={1} />
			</mesh>

			{/* Lane markers - white hearts pattern would be nice, using white for now */}
			{[-2.5, 2.5].map((x, xi) => (
				[...Array(20)].map((_, i) => (
					<mesh 
						key={`${xi}-${i}`}
						ref={(el) => { if (el) lineRefs.current[xi * 20 + i] = el; }}
						position={[x, 0.03, i * 4 - 40]} 
						rotation={[-Math.PI / 2, 0, 0]}
					>
						<planeGeometry args={[0.2, 2.5]} />
						<meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
					</mesh>
				))
			))}

			{/* Flowers on the sides */}
			{[...Array(30)].map((_, i) => (
				<group key={`flower-${i}`}>
					<mesh position={[-7 + (i % 5) * 0.4, 0.2, i * 6 - 60]}>
						<sphereGeometry args={[0.25, 8, 8]} />
						<meshStandardMaterial color={i % 3 === 0 ? "#ff69b4" : i % 3 === 1 ? "#ffc0cb" : "#ffb6c1"} emissive="#ff69b4" emissiveIntensity={0.3} />
					</mesh>
					<mesh position={[7 - (i % 5) * 0.4, 0.2, i * 6 - 60 + 3]}>
						<sphereGeometry args={[0.25, 8, 8]} />
						<meshStandardMaterial color={i % 3 === 0 ? "#dda0dd" : i % 3 === 1 ? "#ee82ee" : "#da70d6"} emissive="#ff69b4" emissiveIntensity={0.3} />
					</mesh>
				</group>
			))}
		</group>
	);
}

// Background - Cute Barbie Dreamworld
function Buildings() {
	const pinkColors = ["#ffb6c1", "#ff69b4", "#ffc0cb", "#dda0dd", "#ee82ee", "#da70d6", "#ff1493"];
	
	// Pre-compute random values using useMemo
	const buildingData = useMemo(() => 
		[...Array(20)].map((_, i) => ({
			height: 4 + (i * 0.37 % 1) * 8,
			offset: (i * 0.61 % 1) * 4
		})), []
	);
	
	const treeData = useMemo(() => 
		[...Array(25)].map((_, i) => ({
			offset: (i * 0.53 % 1) * 3
		})), []
	);
	
	const cloudData = useMemo(() => 
		[...Array(10)].map((_, i) => ({
			xOffset: (i * 0.47 % 1) * 15,
			yOffset: (i * 0.71 % 1) * 10
		})), []
	);
	
	return (
		<group>
			{/* Cute houses/castles on sides */}
			{buildingData.map((data, i) => {
				const side = i % 2 === 0 ? -1 : 1;
				const color = pinkColors[i % pinkColors.length];
				return (
					<group key={i} position={[side * (12 + data.offset), 0, i * 10 - 60]}>
						{/* House body */}
						<mesh position={[0, data.height / 2, 0]}>
							<boxGeometry args={[3, data.height, 3]} />
							<meshStandardMaterial color={color} />
						</mesh>
						{/* Roof - cute pointy */}
						<mesh position={[0, data.height + 1, 0]}>
							<coneGeometry args={[2.5, 2.5, 4]} />
							<meshStandardMaterial color="#ff1493" />
						</mesh>
						{/* Windows */}
						<mesh position={[side * -0.8, data.height / 2, 1.51]}>
							<boxGeometry args={[0.8, 0.8, 0.1]} />
							<meshStandardMaterial color="#87ceeb" emissive="#ffff00" emissiveIntensity={0.3} />
						</mesh>
					</group>
				);
			})}

			{/* Trees - cute round pink trees */}
			{treeData.map((data, i) => {
				const side = i % 2 === 0 ? -1 : 1;
				return (
					<group key={`tree-${i}`} position={[side * (11 + data.offset), 0, i * 8 - 60 + 4]}>
						{/* Trunk */}
						<mesh position={[0, 1.5, 0]}>
							<cylinderGeometry args={[0.2, 0.3, 3, 8]} />
							<meshStandardMaterial color="#deb887" />
						</mesh>
						{/* Leaves - pink fluffy */}
						<mesh position={[0, 4, 0]}>
							<sphereGeometry args={[1.8, 16, 16]} />
							<meshStandardMaterial color={i % 2 === 0 ? "#ffb6c1" : "#ffc0cb"} />
						</mesh>
					</group>
				);
			})}

			{/* Rainbow in the sky */}
			<mesh position={[0, 30, -80]} rotation={[0, 0, Math.PI]}>
				<torusGeometry args={[25, 2, 8, 32, Math.PI]} />
				<meshStandardMaterial color="#ff69b4" transparent opacity={0.6} />
			</mesh>
			<mesh position={[0, 30, -81]} rotation={[0, 0, Math.PI]}>
				<torusGeometry args={[22, 2, 8, 32, Math.PI]} />
				<meshStandardMaterial color="#ffc0cb" transparent opacity={0.6} />
			</mesh>

			{/* Clouds */}
			{cloudData.map((data, i) => (
				<group key={`cloud-${i}`} position={[(i % 2 === 0 ? -1 : 1) * (10 + data.xOffset), 15 + data.yOffset, i * 20 - 60]}>
					<mesh position={[0, 0, 0]}>
						<sphereGeometry args={[2, 16, 16]} />
						<meshStandardMaterial color="#ffffff" />
					</mesh>
					<mesh position={[1.5, 0, 0]}>
						<sphereGeometry args={[1.5, 16, 16]} />
						<meshStandardMaterial color="#ffffff" />
					</mesh>
					<mesh position={[-1.5, 0, 0]}>
						<sphereGeometry args={[1.5, 16, 16]} />
						<meshStandardMaterial color="#ffffff" />
					</mesh>
				</group>
			))}
		</group>
	);
}

// Game Scene
function GameScene({ 
	gameState, 
	onCollision 
}: { 
	gameState: GameState;
	onCollision: (type: Obstacle["type"], id: number) => void;
}) {
	const carPosRef = useRef(1);
	const obstacleIdRef = useRef(0);
	const { camera } = useThree();

	useFrame(() => {
		// Update camera to follow slightly behind car
		camera.position.set(0, 6, 15);
		camera.lookAt(0, 0, -5);

		// Check collisions
		if (gameState.isPlaying && !gameState.gameOver) {
			const carX = (gameState.carLane - 1) * 2.5;
			const carZ = 8;

			gameState.obstacles.forEach(obs => {
				if (obs.collected) return;
				
				const obsX = (obs.lane - 1) * 2.5;
				const obsZ = obs.z;
				
				// Simple collision detection
				if (
					Math.abs(carX - obsX) < 1.2 &&
					Math.abs(carZ - obsZ) < 1.5
				) {
					onCollision(obs.type, obs.id);
				}
			});
		}
	});

	const carColors = ["#ff69b4", "#dda0dd", "#87ceeb", "#98fb98", "#ffb6c1", "#ffc0cb", "#da70d6", "#f0e68c"];

	return (
		<>
			{/* Lighting - Bright pink Barbie world */}
			<ambientLight intensity={0.8} color="#fff0f5" />
			<directionalLight position={[10, 30, 5]} intensity={1.5} color="#ffffff" />
			<pointLight position={[0, 15, 0]} intensity={1} color="#ff69b4" />
			<pointLight position={[-5, 8, 10]} intensity={0.5} color="#ff1493" />
			<pointLight position={[5, 8, 10]} intensity={0.5} color="#ffc0cb" />
			<hemisphereLight args={["#87ceeb", "#ffb6c1", 0.6]} />
			
			{/* Sky - Beautiful sunset pink gradient effect */}
			<mesh position={[0, 50, -50]}>
				<sphereGeometry args={[120, 32, 32]} />
				<meshBasicMaterial color="#ffb6c1" side={THREE.BackSide} />
			</mesh>
			{/* Sun */}
			<mesh position={[30, 40, -80]}>
				<sphereGeometry args={[8, 32, 32]} />
				<meshBasicMaterial color="#ffff99" />
			</mesh>

			{/* Road */}
			<Road speed={gameState.speed} isPlaying={gameState.isPlaying} />

			{/* Buildings */}
			<Buildings />

			{/* Player Car */}
			<Car lane={gameState.carLane} hasShield={gameState.hasShield} hasNitro={gameState.hasNitro} />

			{/* Obstacles */}
			{gameState.obstacles.filter(o => !o.collected).map(obs => {
				const x = (obs.lane - 1) * 2.5;
				const pos: [number, number, number] = [x, 0.5, obs.z];

				switch (obs.type) {
					case "car":
						return <ObstacleCar key={obs.id} position={[x, 0, obs.z]} color={carColors[obs.id % carColors.length]} />;
					case "coin":
						return <Coin key={obs.id} position={pos} />;
					case "diamond":
						return <Diamond key={obs.id} position={pos} />;
					case "shield":
						return <ShieldPowerup key={obs.id} position={pos} />;
					case "nitro":
						return <NitroPowerup key={obs.id} position={pos} />;
					default:
						return null;
				}
			})}
		</>
	);
}

// Main Racing3D Component
interface Racing3DProps {
	onExit: () => void;
	onEarnMoney: (amount: number) => void;
	formatMoney: (amount: number) => string;
}

export default function Racing3D({ onExit, onEarnMoney, formatMoney }: Racing3DProps) {
	const [gameState, setGameState] = useState<GameState>({
		score: 0,
		highScore: 0,
		isPlaying: false,
		gameOver: false,
		carLane: 1,
		speed: 8,
		combo: 0,
		hasShield: false,
		shieldTime: 0,
		hasNitro: false,
		obstacles: [],
		reward: null
	});
	
	const obstacleIdRef = useRef(0);
	const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);

	// Load high score
	useEffect(() => {
		const saved = localStorage.getItem("racing3DHighScore");
		if (saved) {
			setGameState(prev => ({ ...prev, highScore: parseInt(saved) }));
		}
	}, []);

	// Game loop
	useEffect(() => {
		if (!gameState.isPlaying || gameState.gameOver) {
			if (gameLoopRef.current) {
				clearInterval(gameLoopRef.current);
				gameLoopRef.current = null;
			}
			return;
		}

		gameLoopRef.current = setInterval(() => {
			setGameState(prev => {
				// Move obstacles toward player
				const movedObstacles = prev.obstacles
					.map(o => ({ ...o, z: o.z + prev.speed * 0.15 }))
					.filter(o => o.z < 20 && !o.collected);

				// Spawn new obstacles
				const spawnRate = 0.04 + prev.score / 10000;
				
				if (Math.random() < spawnRate) {
					obstacleIdRef.current++;
					movedObstacles.push({
						id: obstacleIdRef.current,
						lane: Math.floor(Math.random() * 3),
						z: -80,
						type: "car"
					});
				}

				// Spawn coins
				if (Math.random() < 0.03) {
					obstacleIdRef.current++;
					movedObstacles.push({
						id: obstacleIdRef.current,
						lane: Math.floor(Math.random() * 3),
						z: -60 - Math.random() * 20,
						type: "coin"
					});
				}

				// Spawn powerups (rare)
				if (Math.random() < 0.005) {
					obstacleIdRef.current++;
					const types: Obstacle["type"][] = ["shield", "nitro", "diamond"];
					movedObstacles.push({
						id: obstacleIdRef.current,
						lane: Math.floor(Math.random() * 3),
						z: -70,
						type: types[Math.floor(Math.random() * types.length)]
					});
				}

				// Speed increases over time
				const newSpeed = Math.min(8 + prev.score / 200, 20);

				// Shield timer
				let shieldTime = prev.shieldTime;
				let hasShield = prev.hasShield;
				if (hasShield) {
					shieldTime -= 0.05;
					if (shieldTime <= 0) {
						hasShield = false;
						shieldTime = 0;
					}
				}

				// Nitro timer handled separately

				return {
					...prev,
					score: prev.score + 1,
					speed: newSpeed,
					obstacles: movedObstacles,
					hasShield,
					shieldTime
				};
			});
		}, 50);

		return () => {
			if (gameLoopRef.current) {
				clearInterval(gameLoopRef.current);
			}
		};
	}, [gameState.isPlaying, gameState.gameOver]);

	// Nitro effect timer
	useEffect(() => {
		if (gameState.hasNitro) {
			const timer = setTimeout(() => {
				setGameState(prev => ({ ...prev, hasNitro: false }));
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [gameState.hasNitro]);

	const handleCollision = useCallback((type: Obstacle["type"], id: number) => {
		setGameState(prev => {
			if (type === "coin") {
				const comboBonus = Math.min(1 + prev.combo * 0.2, 3);
				return {
					...prev,
					score: prev.score + Math.floor(50 * comboBonus),
					combo: prev.combo + 1,
					obstacles: prev.obstacles.map(o => o.id === id ? { ...o, collected: true } : o)
				};
			}
			
			if (type === "diamond") {
				return {
					...prev,
					score: prev.score + 500,
					obstacles: prev.obstacles.map(o => o.id === id ? { ...o, collected: true } : o)
				};
			}

			if (type === "shield") {
				return {
					...prev,
					hasShield: true,
					shieldTime: 5,
					obstacles: prev.obstacles.map(o => o.id === id ? { ...o, collected: true } : o)
				};
			}

			if (type === "nitro") {
				return {
					...prev,
					hasNitro: true,
					obstacles: prev.obstacles.map(o => o.id === id ? { ...o, collected: true } : o)
				};
			}

			if (type === "car") {
				if (prev.hasShield) {
					return {
						...prev,
						hasShield: false,
						shieldTime: 0,
						obstacles: prev.obstacles.filter(o => o.id !== id)
					};
				}
				
				// Game over
				const reward = prev.score * 1000000;
				onEarnMoney(reward);
				
				const newHighScore = prev.score > prev.highScore ? prev.score : prev.highScore;
				if (prev.score > prev.highScore) {
					localStorage.setItem("racing3DHighScore", prev.score.toString());
				}

				return {
					...prev,
					isPlaying: false,
					gameOver: true,
					highScore: newHighScore,
					reward
				};
			}

			return prev;
		});
	}, [onEarnMoney]);

	const startGame = () => {
		obstacleIdRef.current = 0;
		setGameState(prev => ({
			...prev,
			score: 0,
			isPlaying: true,
			gameOver: false,
			carLane: 1,
			speed: 8,
			combo: 0,
			hasShield: false,
			shieldTime: 0,
			hasNitro: false,
			obstacles: [],
			reward: null
		}));
	};

	// Keyboard controls
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!gameState.isPlaying || gameState.gameOver) {
				if (e.key === " " && !gameState.isPlaying) {
					startGame();
				}
				return;
			}

			if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
				setGameState(prev => ({
					...prev,
					carLane: Math.max(0, prev.carLane - 1)
				}));
			} else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
				setGameState(prev => ({
					...prev,
					carLane: Math.min(2, prev.carLane + 1)
				}));
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [gameState.isPlaying, gameState.gameOver]);

	// Touch controls
	const [touchStartX, setTouchStartX] = useState<number | null>(null);

	const handleTouchStart = (e: React.TouchEvent) => {
		setTouchStartX(e.touches[0].clientX);
	};

	const handleTouchEnd = (e: React.TouchEvent) => {
		if (touchStartX === null) return;
		
		const diff = e.changedTouches[0].clientX - touchStartX;
		
		if (Math.abs(diff) > 30) {
			if (diff > 0) {
				setGameState(prev => ({
					...prev,
					carLane: Math.min(2, prev.carLane + 1)
				}));
			} else {
				setGameState(prev => ({
					...prev,
					carLane: Math.max(0, prev.carLane - 1)
				}));
			}
		}
		
		setTouchStartX(null);
	};

	const moveLeft = () => {
		if (gameState.isPlaying && !gameState.gameOver) {
			setGameState(prev => ({
				...prev,
				carLane: Math.max(0, prev.carLane - 1)
			}));
		}
	};

	const moveRight = () => {
		if (gameState.isPlaying && !gameState.gameOver) {
			setGameState(prev => ({
				...prev,
				carLane: Math.min(2, prev.carLane + 1)
			}));
		}
	};

	return (
		<div className="max-w-2xl mx-auto text-center">
			<button
				onClick={onExit}
				className="mb-4 text-pink-500 font-bold hover:text-pink-600"
			>
				← Back to Games
			</button>

			<h1 className="text-3xl font-bold mb-2" style={{
				background: "linear-gradient(to right, #ff00ff, #00ffff)",
				WebkitBackgroundClip: "text",
				WebkitTextFillColor: "transparent"
			}}>
				� Barbie Rush 🎀
			</h1>

			{/* HUD */}
			<div className="flex justify-center gap-3 mb-3 flex-wrap">
				<div className="bg-pink-900/60 rounded-xl px-4 py-2 border border-pink-400/50">
					<span className="text-pink-300 text-xs uppercase">Score</span>
					<div className="text-2xl font-bold text-pink-300 font-mono">{gameState.score}</div>
				</div>
				<div className="bg-pink-900/60 rounded-xl px-4 py-2 border border-yellow-400/50">
					<span className="text-pink-300 text-xs uppercase">Best</span>
					<div className="text-2xl font-bold text-yellow-300 font-mono">{gameState.highScore}</div>
				</div>
				<div className="bg-pink-900/60 rounded-xl px-4 py-2 border border-fuchsia-400/50">
					<span className="text-pink-300 text-xs uppercase">Speed</span>
					<div className="text-2xl font-bold text-fuchsia-300 font-mono">{gameState.speed.toFixed(1)}x</div>
				</div>
			</div>

			{/* Power-up indicators */}
			<div className="flex justify-center gap-3 mb-2">
				{gameState.hasShield && (
					<div className="bg-pink-500/20 border border-pink-400 rounded-lg px-3 py-1 animate-pulse">
						<span className="text-pink-300">🛡️ Shield {Math.ceil(gameState.shieldTime)}s</span>
					</div>
				)}
				{gameState.hasNitro && (
					<div className="bg-fuchsia-500/20 border border-fuchsia-400 rounded-lg px-3 py-1 animate-pulse">
						<span className="text-fuchsia-300">🔥 TURBO!</span>
					</div>
				)}
				{gameState.combo > 1 && (
					<div className="bg-pink-500/20 border border-pink-300 rounded-lg px-3 py-1 animate-bounce">
						<span className="text-pink-200 font-bold">{gameState.combo}x COMBO! ✨</span>
					</div>
				)}
			</div>

			{/* 3D Canvas */}
			<div 
				className="relative mx-auto rounded-2xl overflow-hidden shadow-2xl"
				style={{ 
					width: "100%",
					maxWidth: "500px",
					height: "400px",
					background: "#ffb6c1"
				}}
				onTouchStart={handleTouchStart}
				onTouchEnd={handleTouchEnd}
			>
				<Canvas>
					<Suspense fallback={null}>
						<GameScene 
							gameState={gameState}
							onCollision={handleCollision}
						/>
					</Suspense>
				</Canvas>

				{/* Start Overlay */}
				{!gameState.isPlaying && !gameState.gameOver && (
					<div className="absolute inset-0 bg-pink-900/80 flex flex-col items-center justify-center backdrop-blur-sm">
						<div className="text-7xl mb-4 animate-bounce">🎀</div>
						<h2 className="text-2xl font-bold mb-4" style={{
							background: "linear-gradient(to right, #ff69b4, #ff1493)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent"
						}}>
							BARBIE RUSH ✨
						</h2>
						<button
							onClick={startGame}
							className="px-8 py-4 bg-linear-to-r from-pink-400 to-pink-600 text-white rounded-full font-bold text-xl shadow-lg transition-all hover:scale-105"
							style={{ boxShadow: "0 0 30px rgba(255,105,180,0.6)" }}
						>
							💖 START
						</button>
						<div className="mt-6 space-y-2 text-sm">
							<p className="text-pink-300">← → or A/D or Swipe</p>
							<div className="flex justify-center gap-4 text-xs">
								<span className="text-yellow-300">💰 Coins</span>
								<span className="text-pink-300">🛡️ Shield</span>
								<span className="text-orange-300">🔥 Nitro</span>
								<span className="text-purple-300">💎 Gems</span>
							</div>
						</div>
					</div>
				)}

				{/* Game Over Overlay */}
				{gameState.gameOver && (
					<div className="absolute inset-0 bg-pink-900/85 flex flex-col items-center justify-center backdrop-blur-sm">
						<div className="text-6xl mb-2 animate-pulse">💔</div>
						<div className="text-4xl font-bold mb-3" style={{
							background: "linear-gradient(to right, #ff69b4, #ff1493)",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent"
						}}>
							OOPS!
						</div>
						<div className="bg-pink-800/80 rounded-xl p-4 mb-4 border border-pink-400">
							<div className="text-3xl font-bold text-white mb-1 font-mono">{gameState.score}</div>
							<div className="text-pink-300 text-sm">DISTANCE</div>
						</div>
						<div className="text-xl text-green-300 mb-3 animate-pulse">
							💰 +${formatMoney(gameState.reward!)}
						</div>
						{gameState.score >= gameState.highScore && gameState.score > 0 && (
							<div className="text-lg mb-4 animate-pulse font-bold" style={{
								background: "linear-gradient(to right, #ffd700, #ff69b4, #ff1493)",
								WebkitBackgroundClip: "text",
								WebkitTextFillColor: "transparent"
							}}>
								👑 NEW RECORD! 👑
							</div>
						)}
						<button
							onClick={startGame}
							className="px-8 py-4 bg-linear-to-r from-pink-400 to-fuchsia-500 text-white rounded-full font-bold text-xl shadow-lg transition-all hover:scale-105"
							style={{ boxShadow: "0 0 20px rgba(255,105,180,0.5)" }}
						>
							💖 TRY AGAIN
						</button>
					</div>
				)}
			</div>

			{/* Mobile Controls */}
			<div className="flex justify-center gap-8 mt-6">
				<button
					onTouchStart={moveLeft}
					onClick={moveLeft}
					className="w-20 h-20 bg-linear-to-br from-pink-400 to-fuchsia-500 text-white rounded-2xl text-4xl shadow-lg active:scale-90 transition-all border-2 border-white/30"
					style={{ boxShadow: "0 0 20px rgba(255,105,180,0.5)" }}
				>
					◀
				</button>
				<button
					onTouchStart={moveRight}
					onClick={moveRight}
					className="w-20 h-20 bg-linear-to-br from-pink-400 to-fuchsia-500 text-white rounded-2xl text-4xl shadow-lg active:scale-90 transition-all border-2 border-white/30"
					style={{ boxShadow: "0 0 20px rgba(255,105,180,0.5)" }}
				>
					▶
				</button>
			</div>

			<p className="text-pink-400 mt-4 text-sm">
				⌨️ Use Arrow Keys, A/D, or Swipe
			</p>
		</div>
	);
}
