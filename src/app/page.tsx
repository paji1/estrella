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

  // User auth state
  const [username, setUsername] = useState<string | null>(null);
  const [loginInput, setLoginInput] = useState("");

  // Notification state
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | "unsupported">("default");
  const [reminderTimes, setReminderTimes] = useState<string[]>([]);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [newReminderTime, setNewReminderTime] = useState("09:00");

  // Register Service Worker and check notification permission on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Register service worker for PWA
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js").then((registration) => {
          console.log("Service Worker registered:", registration);
        }).catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
      }

      // Check notification permission
      if ("Notification" in window) {
        setNotificationPermission(Notification.permission);
        // Load saved reminder times
        const saved = localStorage.getItem("reminderTimes");
        if (saved) {
          setReminderTimes(JSON.parse(saved));
        }
      } else {
        setNotificationPermission("unsupported");
      }
    }
  }, []);

  // Request notification permission
  const requestNotificationPermission = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      return permission === "granted";
    }
    return false;
  };

  // Add reminder time
  const addReminderTime = () => {
    if (!reminderTimes.includes(newReminderTime)) {
      const updated = [...reminderTimes, newReminderTime].sort();
      setReminderTimes(updated);
      localStorage.setItem("reminderTimes", JSON.stringify(updated));
    }
  };

  // Remove reminder time
  const removeReminderTime = (time: string) => {
    const updated = reminderTimes.filter(t => t !== time);
    setReminderTimes(updated);
    localStorage.setItem("reminderTimes", JSON.stringify(updated));
  };

  // Show notification
  const showNotification = useCallback((title: string, body: string) => {
    if (notificationPermission === "granted") {
      new Notification(title, {
        body,
        icon: "💊",
        badge: "💊",
        tag: "pill-reminder",
        requireInteraction: true,
      });
    }
  }, [notificationPermission]);

  // Check for reminder times every minute
  useEffect(() => {
    if (notificationPermission !== "granted" || reminderTimes.length === 0) return;

    const checkReminders = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

      if (reminderTimes.includes(currentTime)) {
        const todayPills = pills[currentDayIndex];
        if (todayPills > 0) {
          showNotification(
            "💊 Pill Reminder! 💖",
            `Time to take your medicine, bestie! You have ${todayPills} pill${todayPills > 1 ? "s" : ""} left today. ✨`
          );
        }
      }
    };

    // Check immediately
    checkReminders();

    // Then check every minute
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [notificationPermission, reminderTimes, pills, currentDayIndex, showNotification]);

  // Load username from localStorage on mount
  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  // Handle login
  const handleLogin = async () => {
    if (loginInput.trim()) {
      const name = loginInput.trim();
      setUsername(name);
      localStorage.setItem("username", name);
      setLoginInput("");

      // Load user data from backend with username
      try {
        const response = await fetch(`/api/user?username=${encodeURIComponent(name)}`);
        const data = await response.json();
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
      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    setUsername(null);
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
  };

  // Load user data from API
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const savedUserId = localStorage.getItem("userId");
        const savedUsername = localStorage.getItem("username");

        // Don't load if no username (will show login modal)
        if (!savedUsername) {
          // Clear any stale userId if no username
          localStorage.removeItem("userId");
          setIsLoading(false);
          return;
        }

        // Always use username as primary identifier (it's unique across devices)
        const url = `/api/user?username=${encodeURIComponent(savedUsername)}`;

        const response = await fetch(url);

        // Check if response is ok
        if (!response.ok) {
          // If error, clear saved data and show login
          localStorage.removeItem("userId");
          localStorage.removeItem("username");
          setIsLoading(false);
          return;
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

  // Show login modal first if not signed in (before loading screen)
  if (!username && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-200 to-rose-200 flex items-center justify-center">
        {/* Login Modal */}
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border-4 border-pink-300">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-pink-600">👋 Hey Bestie!</h2>
            </div>

            <div className="text-center mb-6">
              <div className="text-6xl mb-4">💖</div>
              <p className="text-gray-600">What should we call you?</p>
              <p className="text-xs text-gray-400 mt-2">Enter your name to get started!</p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={loginInput}
                onChange={e => setLoginInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="Enter your name..."
                className="w-full px-4 py-4 rounded-xl border-2 border-pink-300 focus:border-pink-400 focus:outline-none text-lg text-center"
                autoFocus
              />
              <button
                onClick={handleLogin}
                disabled={!loginInput.trim()}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                ✨ Let's Go! ✨
              </button>
            </div>

            <p className="text-center text-xs text-gray-400 mt-4">
              No password needed - just vibes 💕
            </p>
          </div>
        </div>
      </div>
    );
  }

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
        {/* ADHD Planner Button */}
        <Link href="/adhd" className="mt-2 block">
          <div className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-xl px-4 py-3 shadow-lg border-2 border-cyan-300 text-center transition-all hover:scale-105 cursor-pointer">
            <span className="text-xl">🧠</span>
            <span className="ml-2 font-bold">ADHD Planner</span>
          </div>
        </Link>
        {/* Notification Settings Button */}
        <button
          onClick={() => setShowNotificationSettings(true)}
          className="mt-2 w-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl px-4 py-3 shadow-lg border-2 border-amber-300 text-center transition-all hover:scale-105 cursor-pointer"
        >
          <span className="text-xl">🔔</span>
          <span className="ml-2 font-bold">Reminders</span>
          {reminderTimes.length > 0 && (
            <span className="ml-2 bg-white/30 px-2 py-0.5 rounded-full text-sm">{reminderTimes.length}</span>
          )}
        </button>
        {/* User Button */}
        {username && (
          <div className="mt-2 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg border-2 border-pink-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">👤</span>
                <span className="font-bold text-pink-600 truncate max-w-[100px]">{username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notification Settings Modal */}
      {showNotificationSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border-4 border-pink-300 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-pink-600">🔔 Pill Reminders</h2>
              <button
                onClick={() => setShowNotificationSettings(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Permission Status */}
            <div className="mb-6">
              {notificationPermission === "unsupported" ? (
                <div className="bg-red-100 text-red-600 rounded-xl p-4 text-sm">
                  <span className="font-bold">😢 Not Supported</span>
                  <p className="mt-1">Your browser doesn't support notifications. Try using Chrome or Safari!</p>
                </div>
              ) : notificationPermission === "granted" ? (
                <div className="bg-green-100 text-green-600 rounded-xl p-4 text-sm">
                  <span className="font-bold">✅ Notifications Enabled!</span>
                  <p className="mt-1">You'll get reminders at the times you set below.</p>
                </div>
              ) : notificationPermission === "denied" ? (
                <div className="bg-red-100 text-red-600 rounded-xl p-4 text-sm">
                  <span className="font-bold">🚫 Notifications Blocked</span>
                  <p className="mt-1">Please enable notifications in your browser settings to get reminders.</p>
                </div>
              ) : (
                <button
                  onClick={requestNotificationPermission}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl px-4 py-4 font-bold hover:from-pink-600 hover:to-purple-600 transition-all"
                >
                  🔔 Enable Notifications
                </button>
              )}
            </div>

            {/* Add Reminder Time */}
            {notificationPermission === "granted" && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-2">Add reminder time:</label>
                  <div className="flex gap-2">
                    <input
                      type="time"
                      value={newReminderTime}
                      onChange={e => setNewReminderTime(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-pink-300 focus:border-pink-400 focus:outline-none text-lg"
                    />
                    <button
                      onClick={addReminderTime}
                      className="px-6 py-3 bg-pink-500 text-white rounded-xl font-bold hover:bg-pink-600 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Reminder Times List */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-600">Your reminders:</label>
                  {reminderTimes.length === 0 ? (
                    <p className="text-gray-400 text-sm py-4 text-center">No reminders set yet. Add one above! ⏰</p>
                  ) : (
                    reminderTimes.map(time => (
                      <div key={time} className="flex items-center justify-between bg-pink-50 rounded-xl px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">⏰</span>
                          <span className="font-bold text-gray-700 text-lg">{time}</span>
                        </div>
                        <button
                          onClick={() => removeReminderTime(time)}
                          className="text-red-400 hover:text-red-600 text-xl"
                        >
                          🗑️
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Tips */}
                <div className="mt-6 bg-purple-50 rounded-xl p-4 text-sm text-purple-600">
                  <p className="font-bold mb-1">💡 Tips:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Keep this tab open for notifications to work</li>
                    <li>On iPhone, add this site to Home Screen for best results</li>
                    <li>Set reminders for your usual medication times</li>
                  </ul>
                </div>
              </>
            )}

            <button
              onClick={() => setShowNotificationSettings(false)}
              className="mt-6 w-full py-3 bg-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

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
