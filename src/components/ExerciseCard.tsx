'use client'

import styles from './ExerciseCard.module.css'
import type { Serie } from '@/types/workout'

interface Props {
  index: number
  name: string
  sets: Serie[]
  prevSets: Serie[] | null
  onUpdate: (serieIdx: number, field: 'kg' | 'reps', value: string) => void
}

function getDelta(curr: string, prev: string) {
  const c = parseFloat(curr)
  const p = parseFloat(prev)
  if (isNaN(c) || isNaN(p) || p === 0) return null
  const d = parseFloat((c - p).toFixed(1))
  if (d > 0) return <span className={styles.pos}> ▲{d}</span>
  if (d < 0) return <span className={styles.neg}> ▼{Math.abs(d)}</span>
  return null
}

export default function ExerciseCard({ index, name, sets, prevSets, onUpdate }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.idx}>{index + 1}</span>
        <span className={styles.name}>{name}</span>
      </div>

      <div className={styles.sets}>
        {sets.map((s, si) => {
          const ps = prevSets?.[si]
          return (
            <div key={si} className={styles.setRow}>
              <span className={styles.setBadge}>S{si + 1}</span>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Peso</label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.inp}
                    type="number"
                    inputMode="decimal"
                    placeholder="0"
                    value={s.kg}
                    onChange={(e) => onUpdate(si, 'kg', e.target.value)}
                  />
                  <span className={styles.unit}>kg</span>
                </div>
                {ps?.kg && (
                  <span className={styles.prev}>
                    ant: {ps.kg}kg{getDelta(s.kg, ps.kg)}
                  </span>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Reps</label>
                <div className={styles.inputWrap}>
                  <input
                    className={styles.inp}
                    type="number"
                    inputMode="numeric"
                    placeholder="0"
                    value={s.reps}
                    onChange={(e) => onUpdate(si, 'reps', e.target.value)}
                  />
                  <span className={styles.unit}>×</span>
                </div>
                {ps?.reps && (
                  <span className={styles.prev}>ant: {ps.reps}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
