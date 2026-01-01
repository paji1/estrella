"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

// Dynamic import for components (client-side only)
const SpongeBob3D = dynamic(() => import("./components/SpongeBob3D"), {
  ssr: false,
  loading: () => (
    <div className="fixed bottom-24 right-4 w-48 h-48 z-50 flex items-center justify-center">
      <div className="animate-spin text-4xl">🧽</div>
    </div>
  ),
});

const Patrick = dynamic(() => import("./components/Patrick"), {
  ssr: false,
  loading: () => (
    <div className="fixed bottom-24 left-4 w-44 h-52 z-50 flex items-center justify-center">
      <div className="animate-spin text-4xl">💗</div>
    </div>
  ),
});

const Squidward = dynamic(() => import("./components/Squidward"), {
  ssr: false,
  loading: () => (
    <div className="fixed bottom-48 left-4 w-32 h-44 z-40 flex items-center justify-center">
      <div className="animate-spin text-4xl">🎺</div>
    </div>
  ),
});

const Gary = dynamic(() => import("./components/Gary"), {
  ssr: false,
  loading: () => (
    <div className="fixed bottom-24 left-48 w-28 h-32 z-50 flex items-center justify-center">
      <div className="animate-spin text-4xl">🐌</div>
    </div>
  ),
});

const MrKrabs = dynamic(() => import("./components/MrKrabs"), {
  ssr: false,
  loading: () => (
    <div className="fixed bottom-48 right-4 w-36 h-44 z-40 flex items-center justify-center">
      <div className="animate-spin text-4xl">🦀</div>
    </div>
  ),
});

const DAYS = [
  { name: "Mon", emoji: "🌸" },
  { name: "Tue", emoji: "💖" },
  { name: "Wed", emoji: "🌷" },
  { name: "Thu", emoji: "💕" },
  { name: "Fri", emoji: "🌺" },
  { name: "Sat", emoji: "💗" },
  { name: "Sun", emoji: "🌹" },
];

const MOTIVATIONAL_QUOTES = [
  "You're doing amazing, sweetie! 💪",
  "Self-care is the best care! 🌸",
  "One pill at a time, you got this! ✨",
  "Your health is your wealth! 💖",
  "Stay strong, beautiful! 🦋",
];

export default function Home() {
  const [pills, setPills] = useState<number[]>([3, 3, 3, 3, 3, 3, 3]);
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);
  const [quoteIndex] = useState(() => Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length));
  const [money, setMoney] = useState<number>(0);
  const [showMoneyAnimation, setShowMoneyAnimation] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Cute teen girl energy messages
  const [cuteMessage] = useState(() => {
    const messages = [
      "ur literally glowing rn bestie ✨🫂",
      "the universe is rooting 4 u babe 🌙✨",
      "main character energy only 💅🏼💫",
      "ur doing SO amazing sweetie omg 🥹💖",
      "protect ur energy queen �✨",
      "manifesting the best 4 u always 🌟🫀",
      "self care is NOT selfish periodt 💋",
      "healthy girl era activated 🎀💪",
      "giving ✨that girl✨ vibes rn 🥰",
      "ur body is a temple babe treat it right 🧘‍♀️❤️",
      "slay queen ur doing the WORK 👑✨",
      "this is so healing energy iktr 🌿💫",
      "bestie ur aura is immaculate today 💜🔮",
      "no bc ur actually crushing it rn 🤍✨",
      "soft girl summer but make it healthy 🌸💕",
      "the vibes r so right omg 🦋💗",
      "u deserve the world n more babe 🌍💖",
      "stay hydrated stay blessed stay cute 💧✨",
      "romanticizing taking care of urself 🎬🌹",
      "ur future self is thanking u rn 🪞💫",
      "wellness check: u r doing amazing 📝💕",
      "this is so mother of u honestly 👸✨",
      "the glow up is REAL and it's u 🌟💅",
      "living ur best life one pill at a time 💊💖",
      "hot girls take their vitamins 🔥💊",
      "mental health era unlocked 🧠💕",
      "ur literally that girl bestie 💁‍♀️✨",
      "the stars aligned 4 u today babe ⭐🌙",
      "pov: ur thriving and glowing 📱✨",
      "good energy only no bad vibes here 🚫🙅‍♀️",
      "this is giving ✨accountability queen✨ 👑",
      "u woke up and chose self love 💝🌅",
      "healing era >>> everything else 🌱💚",
      "ur energy is magnetic today omg 🧲💕",
      "ok miss consistent we see u 👀✨",
      "the dedication is giving obsessed 💯🔥",
      "small steps = big glow up energy 📈💫",
      "ur literally inspiring me rn ngl 🥺💖",
      "this screams ✨wellness goddess✨ 🧚‍♀️",
      "taking notes from u tbh 📓✨",
      "the feminine urge to be healthy queen 💅💪",
      "this energy is so divine girly 👼✨",
      "u r proof that angels walk among us 😇💕"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  });

  // Get current day of the week (0 = Sunday, so we need to convert to Monday = 0)
  const [currentDayIndex] = useState(() => {
    const jsDay = new Date().getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    return jsDay === 0 ? 6 : jsDay - 1; // Convert to Monday = 0, Sunday = 6
  });

  // Database state
  const [userId, setUserId] = useState<string | null>(null);
  const [weekId, setWeekId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from API
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const savedUserId = localStorage.getItem("userId");
        const url = savedUserId ? `/api/user?userId=${savedUserId}` : "/api/user";

        const response = await fetch(url);

        // Check if response is ok
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();

        // Check if response is HTML (error page)
        if (text.startsWith('<!DOCTYPE') || text.startsWith('<html')) {
          throw new Error('Server returned HTML instead of JSON');
        }

        const data = JSON.parse(text);

        if (data.success) {
          setUserId(data.user.id);
          setWeekId(data.currentWeek.id);
          setMoney(parseInt(data.user.money));
          setPills(data.currentWeek.pills);
          localStorage.setItem("userId", data.user.id);
          localStorage.setItem("healthWealth", data.user.money);
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
        // Fallback to localStorage
        const savedMoney = localStorage.getItem("healthWealth");
        if (savedMoney) setMoney(parseInt(savedMoney));
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Save data to API
  const saveData = useCallback(async (newPills: number[], newMoney: number) => {
    if (!userId || !weekId) return;

    try {
      await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          weekId,
          money: newMoney,
          pills: newPills
        })
      });

      // Also update localStorage for games page
      localStorage.setItem("healthWealth", newMoney.toString());
    } catch (error) {
      console.error("Failed to save data:", error);
    }
  }, [userId, weekId]);

  // Calculate completed days (where pills = 0)
  const completedDays = pills.filter(p => p === 0).length;

  // Format money as billions
  const formatMoney = (amount: number) => {
    if (amount >= 1000000000) {
      return (amount / 1000000000).toFixed(2) + "B";
    } else if (amount >= 1000000) {
      return (amount / 1000000).toFixed(2) + "M";
    } else if (amount >= 1000) {
      return (amount / 1000).toFixed(1) + "K";
    }
    return amount.toString();
  };

  const takePill = (dayIndex: number) => {
    if (pills[dayIndex] > 0) {
      setAnimatingIndex(dayIndex);

      const newPills = [...pills];
      newPills[dayIndex] = newPills[dayIndex] - 1;
      let newMoney = money;

      // If day is now complete (0 pills left), add money and celebrate!
      if (newPills[dayIndex] === 0) {
        newMoney = money + 1000000000; // Add 1 billion per completed day
        setMoney(newMoney);
        setShowMoneyAnimation(true);
        setShowCelebration(true);
        setTimeout(() => setShowMoneyAnimation(false), 1000);
        setTimeout(() => setShowCelebration(false), 3000);
      }

      setPills(newPills);
      saveData(newPills, newMoney);
      setTimeout(() => setAnimatingIndex(null), 500);
    }
  };

  const resetPills = async () => {
    const newPills = [3, 3, 3, 3, 3, 3, 3];
    setPills(newPills);
    setMoney(0);
    await saveData(newPills, 0);
  };

  // Generate random positions for celebration items
  const celebrationItems = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    emoji: ['💵', '💰', '💲', '🤑', '💸', '✨', '🎉', '💎'][Math.floor(Math.random() * 8)],
    size: 20 + Math.random() * 30,
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-200 to-rose-200 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">💊</div>
          <div className="text-2xl font-bold text-pink-600">Loading your pills...</div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-200 to-rose-200 relative overflow-hidden">
      {/* Money Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
          {celebrationItems.map((item) => (
            <div
              key={item.id}
              className="absolute animate-fall"
              style={{
                left: `${item.left}%`,
                top: '-50px',
                fontSize: `${item.size}px`,
                animationDelay: `${item.delay}s`,
                animationDuration: `${item.duration}s`,
              }}
            >
              {item.emoji}
            </div>
          ))}
          {/* Big center message */}
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center animate-celebration-pop">
            <div className="text-6xl mb-4">🎉💰🎉</div>
            <div className="bg-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl text-2xl font-bold">
              +$1 BILLION!
            </div>
            <div className="text-4xl mt-4">🤑💵💸</div>
          </div>
        </div>
      )}

      {/* Money Counter - Top Right */}
      <div className="fixed top-4 right-4 z-50">
        <div className={`bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-xl border-2 border-green-400 flex items-center gap-3 ${showMoneyAnimation ? 'animate-bounce scale-110' : ''} transition-all duration-300`}>
          <span className="text-3xl">💵</span>
          <div className="flex flex-col">
            <span className="text-xs text-green-600 font-medium">Health Wealth</span>
            <span className="text-2xl font-bold text-green-600">${formatMoney(money)}</span>
          </div>
          {showMoneyAnimation && (
            <span className="absolute -top-2 -right-2 text-2xl animate-ping">💰</span>
          )}
        </div>
        {/* Level indicator */}
        <div className="mt-2 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border-2 border-pink-300 text-center">
          <span className="text-xs text-pink-500">Level</span>
          <span className="ml-2 text-lg font-bold text-pink-600">{completedDays}</span>
          <span className="text-xs text-pink-400">/7 days</span>
        </div>
        {/* Play Games Button */}
        <Link href="/game" className="mt-2 block">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl px-4 py-3 shadow-lg border-2 border-purple-300 text-center transition-all hover:scale-105 cursor-pointer">
            <span className="text-xl">🎮</span>
            <span className="ml-2 font-bold">Play Games!</span>
          </div>
        </Link>
      </div>

      {/* SpongeBob in right corner */}
      <SpongeBob3D />

      {/* Patrick in left corner */}
      <Patrick />

      {/* Gary next to Patrick */}
      <Gary />

      {/* Mr. Krabs above SpongeBob */}
      <MrKrabs />

      {/* Floating background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl opacity-20 animate-bounce">💊</div>
        <div className="absolute top-20 right-20 text-5xl opacity-20 animate-pulse">🌸</div>
        <div className="absolute bottom-20 left-20 text-7xl opacity-20 animate-bounce">💕</div>
        <div className="absolute bottom-40 right-10 text-6xl opacity-20 animate-pulse">✨</div>
        <div className="absolute top-1/2 left-5 text-4xl opacity-15 animate-bounce">🦋</div>
        <div className="absolute top-1/3 right-5 text-5xl opacity-15 animate-pulse">🌷</div>
      </div>

      {/* Background motivational text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <p className="text-pink-300 text-[8rem] font-bold opacity-10 select-none text-center leading-tight">
          Stay<br />Healthy
        </p>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-pink-600 mb-4 drop-shadow-lg">
            💊 Pill Reminder 💊
          </h1>
          <p className="text-xl text-pink-500 font-medium">
            {MOTIVATIONAL_QUOTES[quoteIndex]}
          </p>
        </div>

        {/* Pill buckets grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 max-w-6xl mx-auto mb-8">
          {DAYS.map((day, index) => {
            const isPast = index < currentDayIndex;
            const isToday = index === currentDayIndex;

            return (
              <div
                key={day.name}
                className={`
                relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl
                border-4 ${isToday ? 'border-yellow-400 ring-4 ring-yellow-200' : isPast ? 'border-gray-300' : 'border-pink-300'} 
                ${!isPast ? 'hover:border-pink-400 hover:scale-105' : ''} 
                transform transition-all duration-300
                ${animatingIndex === index ? "animate-wiggle" : ""}
                ${pills[index] === 0 ? "bg-green-100/80 border-green-300" : ""}
                ${isPast ? "opacity-40 grayscale" : ""}
              `}
              >
                {/* Past day overlay */}
                {isPast && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gray-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    PASSED
                  </div>
                )}

                {/* Today badge */}
                {isToday && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    TODAY ✨
                  </div>
                )}

                {/* Day header */}
                <div className="text-center mb-4">
                  <span className="text-2xl">{day.emoji}</span>
                  <h2 className={`text-xl font-bold ${pills[index] === 0 ? "text-green-600" : isPast ? "text-gray-500" : "text-pink-600"}`}>
                    {day.name}
                  </h2>
                </div>

                {/* Pill bucket visualization */}
                <div className="bg-pink-50 rounded-2xl p-4 mb-4 min-h-[100px] flex flex-col items-center justify-center border-2 border-dashed border-pink-200">
                  {pills[index] > 0 ? (
                    <div className="flex flex-wrap gap-2 justify-center">
                      {Array.from({ length: pills[index] }).map((_, pillIndex) => (
                        <div
                          key={pillIndex}
                          className={`text-3xl transform transition-transform ${isPast ? '' : 'hover:scale-110 cursor-pointer animate-pulse'}`}
                          style={{ animationDelay: `${pillIndex * 200}ms` }}
                        >
                          💊
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center">
                      <span className="text-4xl">✅</span>
                      <p className="text-green-600 font-medium text-sm mt-1">All done!</p>
                    </div>
                  )}
                </div>

                {/* Pill count */}
                <div className="text-center mb-3">
                  <span className={`text-2xl font-bold ${pills[index] === 0 ? "text-green-500" : isPast ? "text-gray-400" : "text-pink-500"}`}>
                    {pills[index]}
                  </span>
                  <span className={`text-sm ${isPast ? "text-gray-400" : "text-pink-400"}`}> pills left</span>
                </div>

                {/* Take pill button - only show for today */}
                {isToday && (
                  <button
                    onClick={() => takePill(index)}
                    disabled={pills[index] === 0}
                    className={`
                    w-full py-3 px-4 rounded-full font-bold text-white
                    transform transition-all duration-200
                    ${pills[index] === 0
                        ? "bg-green-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 hover:shadow-lg active:scale-95"
                      }
                  `}
                  >
                    {pills[index] === 0 ? "Done! 🎉" : "Take Pill 💊"}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer message */}
        <div className="text-center mt-12 mb-8">
          <div className="inline-block px-8 py-4">
            <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-typing inline-block">
              {cuteMessage}
            </p>
            <div className="mt-2 flex justify-center gap-1">
              <span className="text-2xl animate-bounce" style={{ animationDelay: '0ms' }}>✨</span>
              <span className="text-2xl animate-bounce" style={{ animationDelay: '100ms' }}>🫀</span>
              <span className="text-2xl animate-bounce" style={{ animationDelay: '200ms' }}>🌟</span>
              <span className="text-2xl animate-bounce" style={{ animationDelay: '300ms' }}>💖</span>
              <span className="text-2xl animate-bounce" style={{ animationDelay: '400ms' }}>✨</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cartoon characters walking at bottom - SpongeBob style */}
      <div className="fixed bottom-0 left-0 right-0 h-24 overflow-hidden pointer-events-none">
        {/* Ground/grass */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-pink-400 to-pink-300"></div>

        {/* Walking characters */}
        <div className="absolute bottom-4 animate-walk-right">
          <div className="text-5xl transform hover:scale-110 animate-bounce-walk">🐱</div>
        </div>

        <div className="absolute bottom-4 animate-walk-right-slow">
          <div className="text-4xl transform hover:scale-110 animate-bounce-walk-delayed">🐰</div>
        </div>

        <div className="absolute bottom-4 animate-walk-left">
          <div className="text-5xl transform hover:scale-110 animate-bounce-walk">🦄</div>
        </div>

        <div className="absolute bottom-4 animate-walk-right-medium">
          <div className="text-4xl transform hover:scale-110 animate-bounce-walk-delayed">🐻</div>
        </div>

        <div className="absolute bottom-4 animate-walk-left-slow">
          <div className="text-5xl transform hover:scale-110 animate-bounce-walk">🦋</div>
        </div>

        <div className="absolute bottom-4 animate-walk-right-fast">
          <div className="text-4xl transform hover:scale-110 animate-bounce-walk">💊</div>
        </div>

        {/* SpongeBob! */}
        <div className="absolute bottom-4 animate-walk-right-spongebob">
          <div className="flex flex-col items-center animate-bounce-walk">
            <div className="text-5xl">🧽</div>
            <span className="text-xs font-bold text-yellow-500 -mt-1">SpongeBob</span>
          </div>
        </div>

        {/* Patrick */}
        <div className="absolute bottom-4 animate-walk-right-patrick">
          <div className="flex flex-col items-center animate-bounce-walk-delayed">
            <div className="text-5xl">⭐</div>
            <span className="text-xs font-bold text-pink-500 -mt-1">Patrick</span>
          </div>
        </div>

        {/* Gary the snail */}
        <div className="absolute bottom-4 animate-walk-right-gary">
          <div className="flex flex-col items-center animate-bounce-walk">
            <div className="text-4xl">🐌</div>
            <span className="text-xs font-bold text-blue-400 -mt-1">Gary</span>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes walkRight {
          0% { left: -60px; }
          100% { left: 100%; }
        }
        @keyframes walkLeft {
          0% { right: -60px; }
          100% { right: 100%; }
        }
        @keyframes bounceWalk {
          0%, 100% { transform: translateY(0) scaleX(1); }
          25% { transform: translateY(-8px) scaleX(1); }
          50% { transform: translateY(0) scaleX(1.05); }
          75% { transform: translateY(-5px) scaleX(1); }
        }
        .animate-walk-right {
          animation: walkRight 15s linear infinite;
        }
        .animate-walk-right-slow {
          animation: walkRight 22s linear infinite;
          animation-delay: 3s;
        }
        .animate-walk-right-medium {
          animation: walkRight 18s linear infinite;
          animation-delay: 7s;
        }
        .animate-walk-right-fast {
          animation: walkRight 10s linear infinite;
          animation-delay: 2s;
        }
        .animate-walk-left {
          animation: walkLeft 20s linear infinite;
          animation-delay: 5s;
        }
        .animate-walk-left-slow {
          animation: walkLeft 25s linear infinite;
          animation-delay: 10s;
        }
        .animate-bounce-walk {
          animation: bounceWalk 0.5s ease-in-out infinite;
        }
        .animate-bounce-walk-delayed {
          animation: bounceWalk 0.6s ease-in-out infinite;
          animation-delay: 0.1s;
        }
        .animate-walk-right-spongebob {
          animation: walkRight 12s linear infinite;
          animation-delay: 0s;
        }
        .animate-walk-right-patrick {
          animation: walkRight 14s linear infinite;
          animation-delay: 1.5s;
        }
        .animate-walk-right-gary {
          animation: walkRight 30s linear infinite;
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
