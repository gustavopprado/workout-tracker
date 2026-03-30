'use client'

import React from 'react'
import styles from './ExerciseCard.module.css'
import type { Serie } from '@/types/workout'

interface Props {
  index: number
  name: string
  sets: Serie[]
  prevSets: Serie[] | null
  onUpdate: (serieIdx: number, field: 'kg' | 'reps', value: string) => void
}

function getDelta(curr: string, prev: string): React.ReactNode {
  const c = parseFloat(curr)
  const p = parseFloat(prev)
  if (isNaN(c) || isNaN(p) || p === 0) return null
  const d = parseFloat((c - p).toFixed(1))
  if (d > 0) return <span className={styles.pos}>▲{d}</span>
  if (d < 0) return <span className={styles.neg}>▼{Math.abs(d)}</span>
  return <span className={styles.eq}>–</span>
}

export default function ExerciseCard({ index, name, sets, prevSets, onUpdate }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.idx}>{index + 1}</span>
        <span className={styles.name}>{name}</span>
      </div>

      <div className={styles.grid}>
        <div className={styles.colHeader}>Série</div>
        <div className={styles.colHeader}>Peso kg</div>
        <div className={styles.colHeader}>Reps</div>
        {prevSets && <div className={styles.colHeader}>Ant.</div>}

        {sets.map((s, si) => (
          <React.Fragment key={si}>
            <div className={styles.serieNum}>{si + 1}</div>
            <input
              className={styles.inp}
              type="number"
              inputMode="decimal"
              placeholder="—"
              value={s.kg}
              onChange={(e) => onUpdate(si, 'kg', e.target.value)}
            />
            <input
              className={styles.inp}
              type="number"
              inputMode="numeric"
              placeholder="—"
              value={s.reps}
              onChange={(e) => onUpdate(si, 'reps', e.target.value)}
            />
            {prevSets && (
              <div className={styles.prev}>
                {prevSets[si]?.kg ? `${prevSets[si].kg}kg` : '—'}
                {prevSets[si]?.kg && getDelta(s.kg, prevSets[si].kg)}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
