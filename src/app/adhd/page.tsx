"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Task {
  id: string;
  text: string;
  duration: number; // in minutes
  completed: boolean;
  category: "morning" | "work" | "break" | "selfcare" | "evening";
}

interface TimeBlock {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  tasks: Task[];
  color: string;
  emoji: string;
}

const DEFAULT_TIME_BLOCKS: TimeBlock[] = [
  {
    id: "morning",
    name: "Morning Routine",
    startTime: "07:00",
    endTime: "09:00",
    tasks: [],
    color: "from-yellow-200 to-orange-200",
    emoji: "🌅",
  },
  {
    id: "focus1",
    name: "Focus Time",
    startTime: "09:00",
    endTime: "11:00",
    tasks: [],
    color: "from-pink-200 to-rose-200",
    emoji: "🎯",
  },
  {
    id: "break1",
    name: "Break & Recharge",
    startTime: "11:00",
    endTime: "11:30",
    tasks: [],
    color: "from-green-200 to-teal-200",
    emoji: "🌿",
  },
  {
    id: "focus2",
    name: "Focus Time",
    startTime: "11:30",
    endTime: "13:00",
    tasks: [],
    color: "from-pink-200 to-rose-200",
    emoji: "💪",
  },
  {
    id: "lunch",
    name: "Lunch Break",
    startTime: "13:00",
    endTime: "14:00",
    tasks: [],
    color: "from-amber-200 to-yellow-200",
    emoji: "🍽️",
  },
  {
    id: "focus3",
    name: "Afternoon Focus",
    startTime: "14:00",
    endTime: "16:00",
    tasks: [],
    color: "from-purple-200 to-pink-200",
    emoji: "✨",
  },
  {
    id: "break2",
    name: "Movement Break",
    startTime: "16:00",
    endTime: "16:30",
    tasks: [],
    color: "from-cyan-200 to-blue-200",
    emoji: "🚶‍♀️",
  },
  {
    id: "wind",
    name: "Wind Down",
    startTime: "16:30",
    endTime: "18:00",
    tasks: [],
    color: "from-indigo-200 to-purple-200",
    emoji: "🌸",
  },
  {
    id: "evening",
    name: "Evening Routine",
    startTime: "18:00",
    endTime: "22:00",
    tasks: [],
    color: "from-slate-200 to-violet-200",
    emoji: "🌙",
  },
];

const QUICK_TASKS = [
  { text: "Drink water 💧", duration: 1, category: "selfcare" as const },
  { text: "5 min stretch 🧘‍♀️", duration: 5, category: "break" as const },
  { text: "Check emails 📧", duration: 15, category: "work" as const },
  { text: "Take meds 💊", duration: 1, category: "morning" as const },
  { text: "Quick walk 🚶‍♀️", duration: 10, category: "break" as const },
  { text: "Healthy snack 🍎", duration: 5, category: "selfcare" as const },
  { text: "Deep breaths 🌬️", duration: 2, category: "break" as const },
  { text: "Tidy space 🧹", duration: 10, category: "selfcare" as const },
];

const ENCOURAGING_MESSAGES = [
  "You're doing amazing sweetie! 💖",
  "One task at a time, you got this! ✨",
  "Progress, not perfection! 🌟",
  "Your brain is unique and beautiful! 🧠💕",
  "Small steps lead to big wins! 🏆",
  "Be gentle with yourself today! 🌸",
  "You're more capable than you know! 💪",
  "Celebrate every little victory! 🎉",
];

export default function ADHDPlannerPage() {
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>(DEFAULT_TIME_BLOCKS);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskDuration, setNewTaskDuration] = useState(15);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [focusMode, setFocusMode] = useState(false);
  const [focusTask, setFocusTask] = useState<Task | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [encouragement, setEncouragement] = useState(ENCOURAGING_MESSAGES[0]);
  const [completedToday, setCompletedToday] = useState(0);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem("adhdPlanner");
    const savedSchedule = localStorage.getItem("adhdSchedule");

    // Load custom schedule times (persists across days)
    if (savedSchedule) {
      const schedule = JSON.parse(savedSchedule);
      setTimeBlocks(prev => prev.map(block => {
        const savedBlock = schedule.find((s: TimeBlock) => s.id === block.id);
        if (savedBlock) {
          return { ...block, startTime: savedBlock.startTime, endTime: savedBlock.endTime, name: savedBlock.name };
        }
        return block;
      }));
    }

    // Load today's tasks
    if (saved) {
      const data = JSON.parse(saved);
      if (data.date === new Date().toDateString()) {
        setTimeBlocks(prev => prev.map(block => {
          const savedBlock = data.timeBlocks.find((b: TimeBlock) => b.id === block.id);
          if (savedBlock) {
            return { ...block, tasks: savedBlock.tasks };
          }
          return block;
        }));
        setCompletedToday(data.completedToday || 0);
      }
    }
  }, []);

  // Save data
  const saveData = useCallback((blocks: TimeBlock[], completed: number) => {
    localStorage.setItem("adhdPlanner", JSON.stringify({
      date: new Date().toDateString(),
      timeBlocks: blocks,
      completedToday: completed,
    }));
  }, []);

  // Save schedule (times only, persists across days)
  const saveSchedule = useCallback((blocks: TimeBlock[]) => {
    localStorage.setItem("adhdSchedule", JSON.stringify(
      blocks.map(b => ({ id: b.id, startTime: b.startTime, endTime: b.endTime, name: b.name }))
    ));
  }, []);

  // Update block time
  const updateBlockTime = (blockId: string, field: "startTime" | "endTime" | "name", value: string) => {
    const updated = timeBlocks.map(block => {
      if (block.id === blockId) {
        return { ...block, [field]: value };
      }
      return block;
    });
    setTimeBlocks(updated);
    saveSchedule(updated);
    saveData(updated, completedToday);
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(s => {
          if (s <= 1) {
            setTimerRunning(false);
            // Play a sound or show notification
            if (focusTask) {
              completeTask(focusTask.id);
            }
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds, focusTask]);

  // Rotate encouragement
  useEffect(() => {
    const interval = setInterval(() => {
      setEncouragement(ENCOURAGING_MESSAGES[Math.floor(Math.random() * ENCOURAGING_MESSAGES.length)]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const addTask = (blockId: string, task?: { text: string; duration: number; category: Task["category"] }) => {
    const taskText = task?.text || newTaskText;
    const taskDuration = task?.duration || newTaskDuration;

    if (!taskText.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      text: taskText,
      duration: taskDuration,
      completed: false,
      category: task?.category || "work",
    };

    const updated = timeBlocks.map(block => {
      if (block.id === blockId) {
        return { ...block, tasks: [...block.tasks, newTask] };
      }
      return block;
    });

    setTimeBlocks(updated);
    saveData(updated, completedToday);
    setNewTaskText("");
    setSelectedBlock(null);
  };

  const completeTask = (taskId: string) => {
    const updated = timeBlocks.map(block => ({
      ...block,
      tasks: block.tasks.map(task =>
        task.id === taskId ? { ...task, completed: true } : task
      ),
    }));
    const newCompleted = completedToday + 1;
    setTimeBlocks(updated);
    setCompletedToday(newCompleted);
    saveData(updated, newCompleted);
    setFocusMode(false);
    setFocusTask(null);
  };

  const deleteTask = (blockId: string, taskId: string) => {
    const updated = timeBlocks.map(block => {
      if (block.id === blockId) {
        return { ...block, tasks: block.tasks.filter(t => t.id !== taskId) };
      }
      return block;
    });
    setTimeBlocks(updated);
    saveData(updated, completedToday);
  };

  const startFocusMode = (task: Task) => {
    setFocusTask(task);
    setTimerSeconds(task.duration * 60);
    setFocusMode(true);
    setTimerRunning(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getCurrentBlock = () => {
    const now = currentTime.getHours() * 60 + currentTime.getMinutes();
    return timeBlocks.find(block => {
      const [startH, startM] = block.startTime.split(":").map(Number);
      const [endH, endM] = block.endTime.split(":").map(Number);
      const start = startH * 60 + startM;
      const end = endH * 60 + endM;
      return now >= start && now < end;
    });
  };

  const currentBlock = getCurrentBlock();

  const resetDay = () => {
    const reset = DEFAULT_TIME_BLOCKS.map(b => ({ ...b, tasks: [] }));
    setTimeBlocks(reset);
    setCompletedToday(0);
    saveData(reset, 0);
  };

  // Focus Mode UI
  if (focusMode && focusTask) {
    const progress = ((focusTask.duration * 60 - timerSeconds) / (focusTask.duration * 60)) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl max-w-md w-full text-center border-4 border-pink-300">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold text-purple-600 mb-2">Focus Mode</h2>
          <p className="text-pink-500 mb-6">{focusTask.text}</p>

          {/* Timer Circle */}
          <div className="relative w-48 h-48 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="#fce7f3"
                strokeWidth="12"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={553}
                strokeDashoffset={553 - (553 * progress) / 100}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-purple-600">{formatTime(timerSeconds)}</span>
            </div>
          </div>

          <div className="flex gap-3 justify-center mb-6">
            <button
              onClick={() => setTimerRunning(!timerRunning)}
              className={`px-6 py-3 rounded-full font-bold text-white transition-all ${timerRunning
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-green-500 hover:bg-green-600"
                }`}
            >
              {timerRunning ? "⏸️ Pause" : "▶️ Resume"}
            </button>
            <button
              onClick={() => completeTask(focusTask.id)}
              className="px-6 py-3 rounded-full font-bold text-white bg-pink-500 hover:bg-pink-600 transition-all"
            >
              ✓ Done!
            </button>
          </div>

          <button
            onClick={() => {
              setFocusMode(false);
              setTimerRunning(false);
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            Cancel focus session
          </button>

          <p className="mt-6 text-purple-400 text-sm animate-pulse">{encouragement}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm shadow-lg z-50 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-pink-500 font-bold hover:text-pink-600 transition-colors">
            <span className="text-2xl">←</span>
            <span>Home</span>
          </Link>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">🧠 ADHD Day Planner</div>
            <div className="text-sm text-pink-400">
              {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
          <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
            <span className="text-lg">✓</span>
            <span className="font-bold text-green-600">{completedToday}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Encouragement Banner */}
        <div className="bg-gradient-to-r from-pink-400 to-purple-400 rounded-2xl p-4 mb-6 text-center text-white shadow-lg">
          <p className="text-lg font-medium">{encouragement}</p>
        </div>

        {/* Current Block Highlight */}
        {currentBlock && (
          <div className="bg-white/90 rounded-2xl p-4 mb-6 border-4 border-pink-400 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{currentBlock.emoji}</span>
              <div>
                <div className="font-bold text-purple-600">Right Now: {currentBlock.name}</div>
                <div className="text-sm text-pink-400">{currentBlock.startTime} - {currentBlock.endTime}</div>
              </div>
            </div>
            {currentBlock.tasks.filter(t => !t.completed).length === 0 ? (
              <p className="text-gray-400 text-sm">No tasks scheduled for this block yet!</p>
            ) : (
              <div className="flex flex-wrap gap-2 mt-2">
                {currentBlock.tasks.filter(t => !t.completed).map(task => (
                  <button
                    key={task.id}
                    onClick={() => startFocusMode(task)}
                    className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm hover:bg-pink-200 transition-colors"
                  >
                    🎯 {task.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Add Tasks */}
        <div className="bg-white/80 rounded-2xl p-4 mb-6 shadow-lg">
          <h3 className="font-bold text-purple-600 mb-3">⚡ Quick Add</h3>
          <div className="flex flex-wrap gap-2">
            {QUICK_TASKS.map((task, i) => (
              <button
                key={i}
                onClick={() => {
                  if (currentBlock) {
                    addTask(currentBlock.id, task);
                  } else if (timeBlocks[0]) {
                    addTask(timeBlocks[0].id, task);
                  }
                }}
                className="px-3 py-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full text-sm font-medium text-purple-600 hover:from-pink-200 hover:to-purple-200 transition-all hover:scale-105"
              >
                {task.text}
              </button>
            ))}
          </div>
        </div>

        {/* Time Blocks */}
        <div className="space-y-4">
          {timeBlocks.map(block => {
            const isCurrentBlock = currentBlock?.id === block.id;
            const incompleteTasks = block.tasks.filter(t => !t.completed);
            const completedTasks = block.tasks.filter(t => t.completed);
            const isEditing = editingBlock === block.id;

            return (
              <div
                key={block.id}
                className={`bg-gradient-to-r ${block.color} rounded-2xl p-4 shadow-lg transition-all ${isCurrentBlock ? "ring-4 ring-pink-400 scale-[1.02]" : ""
                  }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{block.emoji}</span>
                    {isEditing ? (
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          value={block.name}
                          onChange={e => updateBlockTime(block.id, "name", e.target.value)}
                          className="px-2 py-1 rounded-lg border-2 border-pink-300 text-sm font-bold text-gray-700 w-40"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            value={block.startTime}
                            onChange={e => updateBlockTime(block.id, "startTime", e.target.value)}
                            className="px-2 py-1 rounded-lg border-2 border-pink-300 text-sm"
                          />
                          <span className="text-gray-500">-</span>
                          <input
                            type="time"
                            value={block.endTime}
                            onChange={e => updateBlockTime(block.id, "endTime", e.target.value)}
                            className="px-2 py-1 rounded-lg border-2 border-pink-300 text-sm"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="font-bold text-gray-700">{block.name}</div>
                        <div className="text-sm text-gray-500">{block.startTime} - {block.endTime}</div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingBlock(isEditing ? null : block.id)}
                      className={`p-2 rounded-full transition-colors ${isEditing ? "bg-green-400 text-white" : "bg-white/50 text-gray-500 hover:bg-white/80"}`}
                    >
                      {isEditing ? "✓" : "⚙️"}
                    </button>
                    {isCurrentBlock && (
                      <span className="px-3 py-1 bg-pink-500 text-white text-xs font-bold rounded-full animate-pulse">
                        NOW
                      </span>
                    )}
                  </div>
                </div>

                {/* Tasks */}
                <div className="space-y-2 mb-3">
                  {incompleteTasks.map(task => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 bg-white/60 rounded-xl p-3"
                    >
                      <button
                        onClick={() => startFocusMode(task)}
                        className="w-8 h-8 rounded-full bg-pink-400 text-white flex items-center justify-center hover:bg-pink-500 transition-colors"
                      >
                        ▶
                      </button>
                      <div className="flex-1">
                        <div className="font-medium text-gray-700">{task.text}</div>
                        <div className="text-xs text-gray-500">{task.duration} min</div>
                      </div>
                      <button
                        onClick={() => completeTask(task.id)}
                        className="px-3 py-1 bg-green-400 text-white rounded-full text-sm hover:bg-green-500"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => deleteTask(block.id, task.id)}
                        className="text-gray-400 hover:text-red-400"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {completedTasks.length > 0 && (
                    <div className="text-sm text-gray-500 pl-2">
                      ✨ {completedTasks.length} task{completedTasks.length > 1 ? "s" : ""} completed
                    </div>
                  )}
                </div>

                {/* Add Task */}
                {selectedBlock === block.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTaskText}
                      onChange={e => setNewTaskText(e.target.value)}
                      placeholder="What needs to be done?"
                      className="flex-1 px-4 py-2 rounded-full border-2 border-pink-300 focus:border-pink-400 focus:outline-none"
                      autoFocus
                      onKeyDown={e => e.key === "Enter" && addTask(block.id)}
                    />
                    <select
                      value={newTaskDuration}
                      onChange={e => setNewTaskDuration(Number(e.target.value))}
                      className="px-3 py-2 rounded-full border-2 border-pink-300 focus:border-pink-400 focus:outline-none"
                    >
                      <option value={5}>5m</option>
                      <option value={10}>10m</option>
                      <option value={15}>15m</option>
                      <option value={25}>25m</option>
                      <option value={30}>30m</option>
                      <option value={45}>45m</option>
                      <option value={60}>1h</option>
                    </select>
                    <button
                      onClick={() => addTask(block.id)}
                      className="px-4 py-2 bg-pink-500 text-white rounded-full font-bold hover:bg-pink-600"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setSelectedBlock(null)}
                      className="px-3 py-2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedBlock(block.id)}
                    className="w-full py-2 border-2 border-dashed border-white/50 rounded-xl text-gray-600 hover:border-white hover:bg-white/30 transition-all"
                  >
                    + Add task
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Reset Buttons */}
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <button
            onClick={resetDay}
            className="px-6 py-3 bg-gray-200 text-gray-600 rounded-full font-medium hover:bg-gray-300 transition-colors"
          >
            🔄 Reset Tasks
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("adhdSchedule");
              setTimeBlocks(DEFAULT_TIME_BLOCKS);
              setEditingBlock(null);
            }}
            className="px-6 py-3 bg-pink-100 text-pink-600 rounded-full font-medium hover:bg-pink-200 transition-colors"
          >
            ⏰ Reset Schedule
          </button>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-white/80 rounded-2xl p-6 shadow-lg">
          <h3 className="font-bold text-purple-600 mb-4 text-lg">💡 ADHD-Friendly Tips</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-pink-50 rounded-xl p-4">
              <div className="font-bold text-pink-600 mb-1">🍅 Try Pomodoro</div>
              <p className="text-gray-600">25 min focus + 5 min break. Your brain loves this!</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="font-bold text-purple-600 mb-1">📝 Body Doubling</div>
              <p className="text-gray-600">Work alongside someone (virtually counts too!)</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4">
              <div className="font-bold text-yellow-600 mb-1">🎵 Music Helps</div>
              <p className="text-gray-600">Lo-fi, video game OSTs, or nature sounds work great!</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <div className="font-bold text-green-600 mb-1">💚 Be Kind</div>
              <p className="text-gray-600">Done is better than perfect. Progress over perfection!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
