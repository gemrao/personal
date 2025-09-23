// import { useEffect, useState } from 'react'
// import data from './quiz.json'
// import Quiz from './Quiz.jsx'
// import './App.css'

// function App() {
//   const [quiz, setQuiz] = useState(data)


//   return (
//     <div className='container'>
//       <h1>Quiz</h1>
//       {quiz && quiz.map(((data, idx) => {
//         return (
//           <Quiz key={`quiz${idx}`} quiz={data}/>

//         )
//       }))}

//       <button className='Submit' onClick={(e) => onSubmit(e)}>Submit</button>
//     </div>
//   )
// }

// export default App
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * Quiz Application — Single‑file React MVP
 * - Quiz Builder: create/edit quizzes with single/multi‑select questions
 * - Quiz Player: take quiz with timer, navigation, keyboard support
 * - Results: score + review + history persisted to localStorage
 * - Dark mode toggle, responsive layout, ARIA labels, performance optimizations
 *
 * Tailwind is assumed to be available in the host environment.
 */

// -----------------------------
// Types (JSDoc for editor hints)
// -----------------------------

/**
 * @typedef {Object} Option
 * @property {string} id
 * @property {string} text
 */

/**
 * @typedef {Object} Question
 * @property {string} id
 * @property {"single"|"multi"} type
 * @property {string} text
 * @property {Option[]} options
 * @property {string[]} correctIds // array for easy JSON serializing
 */

/**
 * @typedef {Object} Quiz
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {number} timeLimitSec // 0 for none
 * @property {boolean} shuffle
 * @property {Question[]} questions
 */

/**
 * @typedef {Object} QuizAttempt
 * @property {string} id
 * @property {string} quizId
 * @property {string} quizTitle
 * @property {Record<string,string[]>} answers // questionId -> selected optionIds
 * @property {number} score
 * @property {number} total
 * @property {number} startedAt
 * @property {number} completedAt
 */

// -----------------------------
// LocalStorage helpers
// -----------------------------
const LS_KEYS = {
  QUIZZES: "quizapp.quizzes.v1",
  ATTEMPTS: "quizapp.attempts.v1",
  THEME: "quizapp.theme",
};

/** @returns {Quiz[]} */
function loadQuizzes() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEYS.QUIZZES) || "[]");
  } catch { return []; }
}

/** @param {Quiz[]} quizzes */
function saveQuizzes(quizzes) {
  localStorage.setItem(LS_KEYS.QUIZZES, JSON.stringify(quizzes));
}

/** @returns {QuizAttempt[]} */
function loadAttempts() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEYS.ATTEMPTS) || "[]");
  } catch { return []; }
}

/** @param {QuizAttempt[]} attempts */
function saveAttempts(attempts) {
  localStorage.setItem(LS_KEYS.ATTEMPTS, JSON.stringify(attempts));
}

const uid = () => Math.random().toString(36).slice(2, 10);

// -----------------------------
// Presentational helpers
// -----------------------------
const Card = React.memo(function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl shadow p-4 md:p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 ${className}`}>
      {children}
    </div>
  );
});

const Field = React.memo(function Field({ label, children, hint, id }) {
  return (
    <label htmlFor={id} className="block mb-3">
      <div className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</div>
      {children}
      {hint && <div className="mt-1 text-xs text-zinc-500">{hint}</div>}
    </label>
  );
});

const Button = React.memo(function Button({ children, onClick, type = "button", variant = "primary", className = "", disabled }) {
  const base = "px-4 py-2 rounded-xl text-sm font-medium focus:outline-none focus:ring aria-[pressed]:ring-2";
  const variants = {
    primary: "bg-zinc-900 text-white hover:bg-zinc-800 disabled:bg-zinc-400 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white",
    outline: "border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800",
    ghost: "text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800",
    danger: "bg-red-600 text-white hover:bg-red-500",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
});

// -----------------------------
// Quiz Builder
// -----------------------------
function QuizBuilder({ initial, onSave }) {
  const [quiz, setQuiz] = useState(() => initial ?? /** @type {Quiz} */({
    id: uid(), title: "", description: "", timeLimitSec: 0, shuffle: false, questions: []
  }));

  const addQuestion = useCallback((type) => {
    setQuiz(q => ({
      ...q,
      questions: [...q.questions, {
        id: uid(), type, text: "", options: [
          { id: uid(), text: "Option 1" }, { id: uid(), text: "Option 2" }
        ], correctIds: []
      }]
    }));
  }, []);

  const updateQuestion = useCallback((qid, patch) => {
    setQuiz(q => ({ ...q, questions: q.questions.map(qq => qq.id === qid ? { ...qq, ...patch } : qq) }));
  }, []);

  const removeQuestion = useCallback((qid) => {
    setQuiz(q => ({ ...q, questions: q.questions.filter(qq => qq.id !== qid) }));
  }, []);

  const updateOption = useCallback((qid, oid, text) => {
    setQuiz(q => ({
      ...q,
      questions: q.questions.map(qq => qq.id !== qid ? qq : {
        ...qq,
        options: qq.options.map(o => o.id === oid ? { ...o, text } : o)
      })
    }));
  }, []);

  const addOption = useCallback((qid) => {
    setQuiz(q => ({ ...q, questions: q.questions.map(qq => qq.id === qid ? { ...qq, options: [...qq.options, { id: uid(), text: `Option ${qq.options.length + 1}` }] } : qq) }));
  }, []);

  const removeOption = useCallback((qid, oid) => {
    setQuiz(q => ({ ...q, questions: q.questions.map(qq => qq.id === qid ? { ...qq, options: qq.options.filter(o => o.id !== oid), correctIds: qq.correctIds.filter(id => id !== oid) } : qq) }));
  }, []);

  const toggleCorrect = useCallback((qid, oid) => {
    setQuiz(q => ({
      ...q, questions: q.questions.map(qq => {
        if (qq.id !== qid) return qq;
        const isMulti = qq.type === "multi";
        if (isMulti) {
          const has = qq.correctIds.includes(oid);
          return { ...qq, correctIds: has ? qq.correctIds.filter(id => id !== oid) : [...qq.correctIds, oid] };
        } else {
          return { ...qq, correctIds: [oid] };
        }
      })
    }));
  }, []);

  const valid = quiz.title.trim() && quiz.questions.length > 0 && quiz.questions.every(q => q.text.trim() && q.options.length >= 2 && q.correctIds.length >= 1);

  const handleSave = useCallback(() => {
    if (!valid) return;
    onSave(quiz);
  }, [onSave, quiz, valid]);

  return (
    <Card className="space-y-4" aria-label="Quiz Builder">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Quiz Builder</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => addQuestion("single")}>+ Single choice</Button>
          <Button variant="outline" onClick={() => addQuestion("multi")}>+ Multiple choice</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Field id="title" label="Title" hint="A short, descriptive title">
          <input id="title" className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-700"
            value={quiz.title} onChange={e => setQuiz({ ...quiz, title: e.target.value })} aria-required />
        </Field>
        <Field id="time" label="Time limit (minutes)" hint="0 = no limit">
          <input id="time" type="number" min={0} className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-700"
            value={Math.round(quiz.timeLimitSec / 60)} onChange={e => setQuiz({ ...quiz, timeLimitSec: Math.max(0, Number(e.target.value || 0)) * 60 })} />
        </Field>
        <Field id="desc" label="Description">
          <textarea id="desc" rows={2} className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-700"
            value={quiz.description} onChange={e => setQuiz({ ...quiz, description: e.target.value })} />
        </Field>
        <Field id="shuffle" label="Shuffle questions?">
          <div className="flex items-center gap-2">
            <input id="shuffle" type="checkbox" checked={quiz.shuffle} onChange={e => setQuiz({ ...quiz, shuffle: e.target.checked })} aria-checked={quiz.shuffle} />
            <span className="text-sm">Randomize order for each attempt</span>
          </div>
        </Field>
      </div>

      <div className="space-y-4">
        {quiz.questions.map((q, idx) => (
          <Card key={q.id} className="bg-zinc-50/50 dark:bg-zinc-900/50 border-dashed">
            <div className="flex items-start gap-3 justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-zinc-500">Question {idx + 1} · {q.type === "single" ? "Single choice" : "Multiple choice"}</div>
                <input aria-label={`Question ${idx + 1} text`} className="mt-2 w-full px-3 py-2 rounded-lg border bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-700"
                  value={q.text} onChange={(e) => updateQuestion(q.id, { text: e.target.value })} placeholder="Enter question text" />

                <div className="mt-3 space-y-2">
                  {q.options.map((o, i) => (
                    <div key={o.id} className="flex items-center gap-2">
                      <input type={q.type === "single" ? "radio" : "checkbox"}
                        checked={q.correctIds.includes(o.id)}
                        onChange={() => toggleCorrect(q.id, o.id)}
                        name={`correct-${q.id}`} aria-label={`Mark option ${i + 1} as correct`} />
                      <input className="flex-1 px-3 py-2 rounded-lg border bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-700"
                        value={o.text} onChange={(e) => updateOption(q.id, o.id, e.target.value)} />
                      <Button variant="ghost" onClick={() => removeOption(q.id, o.id)} aria-label="Remove option">🗑️</Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={() => addOption(q.id)}>+ Add option</Button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="danger" onClick={() => removeQuestion(q.id)} aria-label="Delete question">Delete</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={!valid} aria-disabled={!valid}>Save quiz</Button>
      </div>
    </Card>
  );
}

// -----------------------------
// Quiz Player
// -----------------------------
function QuizPlayer({ quiz, onExit, onSubmit }) {
  const questionOrder = useMemo(() => {
    const ids = quiz.questions.map(q => q.id);
    if (!quiz.shuffle) return ids;
    // Fisher-Yates
    for (let i = ids.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[ids[i], ids[j]] = [ids[j], ids[i]]; }
    return ids;
  }, [quiz]);

  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState(() => /** @type {Record<string,string[]>} */({}));
  const startedAt = useRef(Date.now());

  const timeLimit = quiz.timeLimitSec;
  const [remaining, setRemaining] = useState(timeLimit || 0);

  useEffect(() => {
    if (!timeLimit) return; // no timer
    setRemaining(timeLimit);
    const t = setInterval(() => {
      setRemaining(prev => {
        const next = Math.max(0, prev - 1);
        if (next === 0) {
          clearInterval(t);
          handleSubmit();
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLimit]);

  const qMap = useMemo(() => new Map(quiz.questions.map(q => [q.id, q])), [quiz.questions]);
  const currentQ = qMap.get(questionOrder[idx]);

  const setAnswer = useCallback((qid, oid, checked) => {
    setAnswers(a => {
      const prev = a[qid] || [];
      const q = qMap.get(qid);
      if (!q) return a;
      if (q.type === "single") {
        return { ...a, [qid]: [oid] };
      } else {
        const next = new Set(prev);
        checked ? next.add(oid) : next.delete(oid);
        return { ...a, [qid]: Array.from(next) };
      }
    });
  }, [qMap]);

  const next = useCallback(() => setIdx(i => Math.min(i + 1, questionOrder.length - 1)), [questionOrder.length]);
  const prev = useCallback(() => setIdx(i => Math.max(i - 1, 0)), []);

  const handleSubmit = useCallback(() => {
    // compute score
    let score = 0;
    for (const q of quiz.questions) {
      const ans = new Set(answers[q.id] || []);
      const correct = new Set(q.correctIds);
      const allMatch = ans.size === correct.size && [...ans].every(x => correct.has(x));
      if (allMatch) score++;
    }
    onSubmit({
      id: uid(),
      quizId: quiz.id,
      quizTitle: quiz.title,
      answers,
      score,
      total: quiz.questions.length,
      startedAt: startedAt.current,
      completedAt: Date.now(),
    });
  }, [answers, onSubmit, quiz]);

  // keyboard navigation: Left/Right arrows, 1-9 to select option
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      const num = Number(e.key);
      if (currentQ && num >= 1 && num <= currentQ.options.length) {
        const option = currentQ.options[num - 1];
        const isChecked = (answers[currentQ.id] || []).includes(option.id);
        setAnswer(currentQ.id, option.id, !isChecked);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [answers, currentQ, next, prev, setAnswer]);

  if (!currentQ) return null;

  return (
    <Card className="space-y-4" aria-label="Quiz Player">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">{quiz.title}</h2>
          <div className="text-sm text-zinc-500">Question {idx + 1} / {questionOrder.length}</div>
        </div>
        <div className="flex items-center gap-2">
          {timeLimit > 0 && (
            <div aria-live="polite" className={`px-3 py-1 rounded-full text-sm font-medium border ${remaining <= 10 ? "animate-pulse border-red-500 text-red-600" : "border-zinc-300 dark:border-zinc-700"}`}>
              ⏱️ {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")}
            </div>
          )}
          <Button variant="outline" onClick={onExit}>Exit</Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-base md:text-lg font-medium" aria-label="Question text">{currentQ.text}</div>
        <div role="group" aria-label="Answer options" className="grid gap-2">
          {currentQ.options.map((o, i) => {
            const selected = (answers[currentQ.id] || []).includes(o.id);
            const inputType = currentQ.type === "single" ? "radio" : "checkbox";
            return (
              <label key={o.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer select-none ${selected ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-400 dark:border-zinc-600" : "border-zinc-300 dark:border-zinc-700"}`}
                aria-checked={selected}>
                <input
                  type={inputType}
                  name={`q-${currentQ.id}`}
                  checked={selected}
                  onChange={(e) => setAnswer(currentQ.id, o.id, e.target.checked)}
                  className="accent-zinc-900 dark:accent-zinc-100"
                  aria-label={`Option ${i + 1}: ${o.text}`}
                />
                <span className="flex-1">{o.text}</span>
                <kbd className="text-xs px-2 py-1 rounded border">{i + 1}</kbd>
              </label>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={prev} disabled={idx === 0} aria-disabled={idx === 0}>← Prev</Button>
        {idx < questionOrder.length - 1 ? (
          <Button onClick={next}>Next →</Button>
        ) : (
          <Button onClick={handleSubmit}>Submit</Button>
        )}
      </div>
    </Card>
  );
}

// -----------------------------
// Results View
// -----------------------------
function ResultsView({ attempt, quiz, onClose }) {
  return (
    <Card className="space-y-4" aria-label="Results">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Results — {attempt.quizTitle}</h2>
          <div className="text-sm text-zinc-500">Score: {attempt.score} / {attempt.total}</div>
        </div>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>

      <div className="space-y-3">
        {quiz.questions.map((q, i) => {
          const ans = new Set(attempt.answers[q.id] || []);
          const correct = new Set(q.correctIds);
          const correctAll = ans.size === correct.size && [...ans].every(x => correct.has(x));
          return (
            <div key={q.id} className={`p-3 rounded-xl border ${correctAll ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20" : "border-red-400 bg-red-50 dark:bg-red-900/20"}`}>
              <div className="font-medium">Q{i + 1}. {q.text}</div>
              <ul className="mt-2 space-y-1">
                {q.options.map(o => {
                  const chosen = ans.has(o.id);
                  const isCorrect = correct.has(o.id);
                  return (
                    <li key={o.id} className="flex items-center gap-2">
                      <span>{chosen ? (isCorrect ? "✅" : "❌") : (isCorrect ? "☑️" : "▫️")}</span>
                      <span>{o.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// -----------------------------
// Main App Shell
// -----------------------------
export default function QuizApp() {
  const [quizzes, setQuizzes] = useState(loadQuizzes);
  const [attempts, setAttempts] = useState(loadAttempts);
  const [view, setView] = useState(/** @type{"home"|"builder"|"play"|"results"} */("home"));
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [pendingAttempt, setPendingAttempt] = useState(null);

  // Dark mode
  const [dark, setDark] = useState(() => localStorage.getItem(LS_KEYS.THEME) === "dark" || window.matchMedia?.("(prefers-color-scheme: dark)").matches);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem(LS_KEYS.THEME, dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => saveQuizzes(quizzes), [quizzes]);
  useEffect(() => saveAttempts(attempts), [attempts]);

  const selectedQuiz = useMemo(() => quizzes.find(q => q.id === selectedQuizId) || null, [quizzes, selectedQuizId]);

  const onSaveQuiz = useCallback((quiz) => {
    setQuizzes(prev => {
      const idx = prev.findIndex(q => q.id === quiz.id);
      if (idx === -1) return [...prev, quiz];
      const next = [...prev]; next[idx] = quiz; return next;
    });
    setView("home");
  }, []);

  const onStartQuiz = useCallback((quizId) => { setSelectedQuizId(quizId); setView("play"); }, []);

  const onSubmitAttempt = useCallback((attempt) => {
    setAttempts(prev => [attempt, ...prev].slice(0, 100));
    setPendingAttempt(attempt);
    setView("results");
  }, []);

  const deleteQuiz = useCallback((quizId) => {
    if (!confirm("Delete this quiz?")) return;
    setQuizzes(prev => prev.filter(q => q.id !== quizId));
    setAttempts(prev => prev.filter(a => a.quizId !== quizId));
  }, []);

  // Seed sample quiz button for quick demo
  const seed = useCallback(() => {
    const qz = /** @type {Quiz} */({
      id: uid(),
      title: "Frontend Basics",
      description: "A quick check on JS & React",
      timeLimitSec: 180,
      shuffle: true,
      questions: [
        {
          id: uid(), type: "single", text: "Which hook manages local component state?", options: [
            { id: uid(), text: "useEffect" }, { id: uid(), text: "useState" }, { id: uid(), text: "useMemo" }
          ], correctIds: []
        },
        {
          id: uid(), type: "multi", text: "Select performance hooks:", options: [
            { id: uid(), text: "useMemo" }, { id: uid(), text: "useCallback" }, { id: uid(), text: "useReducer" }
          ], correctIds: []
        },
        {
          id: uid(), type: "single", text: "Array method to create a new array without mutation?", options: [
            { id: uid(), text: "push" }, { id: uid(), text: "map" }, { id: uid(), text: "splice" }
          ], correctIds: []
        },
      ]
    });
    // set correct answers after options are created
    qz.questions[0].correctIds = [qz.questions[0].options[1].id];
    qz.questions[1].correctIds = [qz.questions[1].options[0].id, qz.questions[1].options[1].id];
    qz.questions[2].correctIds = [qz.questions[2].options[1].id];
    setQuizzes(prev => [qz, ...prev]);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold">QuizApp</span>
            <span className="text-xs px-2 py-1 rounded-full border">MVP</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setDark(d => !d)} aria-pressed={dark} aria-label="Toggle dark mode">{dark ? "🌙" : "☀️"}</Button>
            <Button variant="outline" onClick={() => { setView("builder"); }} aria-label="Create quiz">+ New Quiz</Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 grid gap-6">
        {view === "home" && (
          <>
            <Card className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">Your Quizzes</div>
                <div className="text-sm text-zinc-500">Create, play, and track results. Use keyboard: ← → 1..9</div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={seed}>Seed sample</Button>
                <Button onClick={() => setView("builder")}>Create quiz</Button>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              {quizzes.length === 0 && (
                <Card><div className="text-sm text-zinc-500">No quizzes yet. Create one to get started.</div></Card>
              )}
              {quizzes.map(q => (
                <Card key={q.id} className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-lg font-semibold">{q.title}</div>
                      <div className="text-sm text-zinc-500">{q.description || "No description"}</div>
                      <div className="mt-1 text-xs text-zinc-500">{q.questions.length} questions · {q.timeLimitSec ? `${Math.round(q.timeLimitSec / 60)} min` : "No time limit"} · {q.shuffle ? "Shuffled" : "Fixed order"}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => { setSelectedQuizId(q.id); setView("builder"); }}>Edit</Button>
                      <Button variant="danger" onClick={() => deleteQuiz(q.id)}>Delete</Button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => onStartQuiz(q.id)}>Start →</Button>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-2">
              <div className="text-lg font-semibold mb-2">Recent Attempts</div>
              <div className="grid md:grid-cols-2 gap-4">
                {attempts.length === 0 && <Card><div className="text-sm text-zinc-500">No attempts yet.</div></Card>}
                {attempts.map(a => (
                  <Card key={a.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{a.quizTitle}</div>
                      <div className="text-sm text-zinc-500">Score {a.score}/{a.total} · {new Date(a.completedAt).toLocaleString()}</div>
                    </div>
                    <Button variant="outline" onClick={() => { setSelectedQuizId(a.quizId); setPendingAttempt(a); setView("results"); }}>Review</Button>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}

        {view === "builder" && (
          <QuizBuilder
            initial={selectedQuizId ? quizzes.find(q => q.id === selectedQuizId) : undefined}
            onSave={onSaveQuiz}
          />
        )}

        {view === "play" && selectedQuiz && (
          <QuizPlayer
            quiz={selectedQuiz}
            onExit={() => setView("home")}
            onSubmit={onSubmitAttempt}
          />
        )}

        {view === "results" && selectedQuiz && pendingAttempt && (
          <ResultsView attempt={pendingAttempt} quiz={selectedQuiz} onClose={() => setView("home")} />
        )}
      </main>

      <footer className="max-w-5xl mx-auto px-4 py-8 text-xs text-zinc-500">
        <p>Built for machine‑coding + system design discussion: accessible, responsive, and optimized for minimal re‑renders (memoized components, stable callbacks, derived state).</p>
      </footer>
    </div>
  );
}
