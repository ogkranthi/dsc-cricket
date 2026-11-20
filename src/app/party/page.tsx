import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { PartyQuiz } from "./PartyQuiz";
import { facts, questions } from "./season-quiz";
import styles from "./party.module.css";

export const metadata: Metadata = {
  title: "DSC Year-End Party | DSC Cricket",
  description: "Relive the 2026 DSC season with a six-ball pub quiz and a few numbers worth raising a glass to.",
};

export default function PartyPage() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <div>
            <p className={styles.eyebrow}><span /> DECCAN SPORTS CLUB <b> / </b> 2026</p>
            <h1>Year-End<br /><em>Party.</em></h1>
            <p className={styles.intro}>One more over, this time with no fielding. Put your season memory to the test.</p>
            <a className={styles.solidButton} href="#quiz">Play the quiz <ArrowDown size={17} aria-hidden="true" /></a>
          </div>
          <div className={styles.heroGraphic} aria-hidden="true">
            <div className={styles.pitch}>
              <span className={styles.crease} />
              <span className={styles.wicket}><i /><i /><i /></span>
              <span className={styles.wicket}><i /><i /><i /></span>
              <span className={styles.crease} />
            </div>
            <div className={styles.ball}><span /></div>
            <span className={styles.heroTag}>ONE OVER <b>/</b> 06 BALLS</span>
          </div>
        </div>
      </header>

      <div className={styles.body}>
        <PartyQuiz questions={questions} />
        <section className={styles.facts} aria-labelledby="party-facts">
          <div className={styles.factsHeading}>
            <div>
              <p className={styles.overline}>THE SEASON, IN NUMBERS</p>
              <h2 id="party-facts">Worth a cheer.</h2>
            </div>
            <Link href="/season-2026" className={styles.factsLink}>Full season archive <ArrowUpRight size={17} aria-hidden="true" /></Link>
          </div>
          <ul>
            {facts.map((fact, index) => (
              <li key={fact.label}>
                <span className={styles.factIndex}>0{index + 1}</span>
                <div className={styles.factValue}>{fact.value}</div>
                <h3>{fact.label}</h3>
                <p>{fact.detail}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
