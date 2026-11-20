"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowRight, Check, Maximize2, Minimize2, RotateCcw, X } from "lucide-react";
import type { Question } from "./season-quiz";
import styles from "./party.module.css";

function subscribeFullscreen(callback: () => void) {
  document.addEventListener("fullscreenchange", callback);
  return () => document.removeEventListener("fullscreenchange", callback);
}

function getFullscreenState() {
  if (!document.fullscreenEnabled || !HTMLElement.prototype.requestFullscreen) return 0;
  return document.fullscreenElement?.id === "quiz" ? 2 : 1;
}

export function PartyQuiz({ questions }: { questions: Question[] }) {
  const [round, setRound] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const fullscreen = useSyncExternalStore(subscribeFullscreen, getFullscreenState, () => 0);
  const bigScreen = fullscreen === 2;
  const panel = useRef<HTMLElement>(null);
  const headline = useRef<HTMLHeadingElement>(null);
  const moveFocus = useRef(false);
  const picked = useRef(false);
  const question = questions[round];

  useEffect(() => {
    if (moveFocus.current) {
      headline.current?.focus();
      moveFocus.current = false;
    }
  }, [round]);

  function select(index: number) {
    if (!question || picked.current) return;
    picked.current = true;
    setChoice(index);
    if (index === question.correct) setScore((previous) => previous + 1);
  }

  function next() {
    if (choice === null) return;
    moveFocus.current = true;
    picked.current = false;
    setChoice(null);
    setRound((previous) => previous + 1);
  }

  function replay() {
    moveFocus.current = true;
    picked.current = false;
    setRound(0);
    setChoice(null);
    setScore(0);
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement === panel.current) await document.exitFullscreen();
      else await panel.current?.requestFullscreen();
    } catch {
      // The regular layout remains usable if this device declines fullscreen.
    }
  }

  return (
    <section id="quiz" ref={panel} className={styles.quiz} aria-label="DSC season quiz">
      <div className={styles.quizBoard}>
        <div className={styles.quizTop}>
          <span className={styles.quizLabel}>THE DSC PUB QUIZ</span>
          {fullscreen > 0 && (
            <button type="button" onClick={toggleFullscreen} className={styles.screenButton} aria-pressed={bigScreen}>
              {bigScreen ? <Minimize2 size={16} aria-hidden="true" /> : <Maximize2 size={16} aria-hidden="true" />}
              {bigScreen ? "Exit fullscreen" : "Big screen"}
            </button>
          )}
        </div>
        <div className={styles.quizInner}>
          <div className={styles.progress} aria-hidden="true">
            {questions.map((_, index) => <span key={index} data-active={index <= round} />)}
          </div>
          {question ? (
            <>
              <p className={styles.overline}>BALL {round + 1} OF {questions.length} <span> / </span> {question.category}</p>
              <h2 ref={headline} tabIndex={-1} className={styles.question}>{question.prompt}</h2>
              <div className={styles.options} aria-label="Choose an answer">
                {question.options.map((option, index) => {
                  const correct = choice !== null && index === question.correct;
                  const wrong = choice === index && index !== question.correct;
                  return (
                    <button
                      type="button"
                      key={option}
                      onClick={() => select(index)}
                      aria-disabled={choice !== null}
                      className={styles.answer}
                      data-state={correct ? "correct" : wrong ? "wrong" : "neutral"}
                    >
                      <span className={styles.optionNumber} aria-hidden="true">{String.fromCharCode(65 + index)}</span>
                      <span>{option}</span>
                      {correct && <Check size={19} aria-hidden="true" className={styles.answerIcon} />}
                      {wrong && <X size={19} aria-hidden="true" className={styles.answerIcon} />}
                    </button>
                  );
                })}
              </div>
              <div className={styles.feedback} role="status" aria-live="polite" aria-atomic="true">
                {choice !== null && (
                  <p><strong>{choice === question.correct ? "That’s runs on the board!" : "Not quite."}</strong> {question.detail}</p>
                )}
              </div>
              <div className={styles.controls}>
                <span className={styles.score}>SCORE <strong>{score} / {questions.length}</strong></span>
                <button type="button" className={styles.solidButton} onClick={next} disabled={choice === null}>
                  {round === questions.length - 1 ? "See final score" : "Next ball"} <ArrowRight size={17} aria-hidden="true" />
                </button>
              </div>
            </>
          ) : (
            <div className={styles.finished}>
              <p className={styles.overline}>FINAL SCORECARD</p>
              <h2 ref={headline} tabIndex={-1} className={styles.question}>
                {score === questions.length ? "You hit every ball." : score >= 3 ? "That’s a solid innings." : "The pitch had a bit in it."}
              </h2>
              <p className={styles.finalScore}>{score}<span> / {questions.length}</span></p>
              <p className={styles.result}>You got {score} of {questions.length} questions right.</p>
              <button type="button" className={styles.solidButton} onClick={replay}><RotateCcw size={17} aria-hidden="true" /> Play again</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
