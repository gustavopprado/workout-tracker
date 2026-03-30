'use client'

import { useWorkout } from '@/hooks/useWorkout'
import { DAYS, PLAN, TYPE_COLOR } from '@/lib/workout-data'
import type { DayKey } from '@/lib/workout-data'
import ExerciseCard from './ExerciseCard'
import styles from './WorkoutTracker.module.css'

export default function WorkoutTracker() {
  const {
    loading,
    saving,
    currentWeek,
    selectedDay,
    compareMode,
    currentSession,
    prevSession,
    changeWeek,
    setSelectedDay,
    setCompareMode,
    updateSerie,
    markDone,
    todayKey,
  } = useWorkout()

  if (loading) {
    return (
      <div className={styles.splash}>
        <div className={styles.splashDot} />
        <span className={styles.splashText}>Carregando...</span>
      </div>
    )
  }

  const plan = PLAN[selectedDay]
  const accentColor = TYPE_COLOR[plan.type]
  const isCompleted = !!currentSession.completedAt
  const isRest = plan.type === 'rest'

  return (
    <div className={styles.root}>
      {/* ── Header fixo ── */}
      <header className={styles.header}>
        <div className={styles.appName}>Workout Tracker</div>
        <div className={styles.weekNav}>
          <button className={styles.navBtn} onClick={() => changeWeek(-1)}>‹</button>
          <span className={styles.weekLabel}>Semana {currentWeek}</span>
          <button className={styles.navBtn} onClick={() => changeWeek(1)}>›</button>
        </div>
        {saving && <div className={styles.savingDot} title="Salvando..." />}
      </header>

      {/* ── Abas dos dias ── */}
      <div className={styles.dayTabs}>
        {DAYS.map((day) => {
          const dp = PLAN[day]
          const isActive = day === selectedDay
          const isToday = day === todayKey
          return (
            <button
              key={day}
              className={`${styles.dayTab} ${isActive ? styles.dayTabActive : ''} ${isToday ? styles.dayTabToday : ''}`}
              style={isActive ? { background: TYPE_COLOR[dp.type], borderColor: TYPE_COLOR[dp.type] } : {}}
              onClick={() => {
                setSelectedDay(day as DayKey)
                setCompareMode(false)
              }}
            >
              <span className={styles.dayName}>{day}</span>
              <span className={styles.dayWorkout}>{dp.name}</span>
              {isToday && <span className={styles.todayDot} style={isActive ? { background: '#fff' } : { background: TYPE_COLOR[dp.type] }} />}
            </button>
          )
        })}
      </div>

      {/* ── Conteúdo scrollável ── */}
      <main className={styles.main}>

        {/* Toggle comparar */}
        {currentWeek > 1 && !isRest && (
          <label className={styles.compareToggle}>
            <input
              type="checkbox"
              checked={compareMode}
              onChange={(e) => setCompareMode(e.target.checked)}
            />
            <span>Comparar com Semana {currentWeek - 1}</span>
          </label>
        )}

        {isRest ? (
          <div className={styles.restView}>
            <div className={styles.restIcon}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="23" stroke="var(--brd2)" strokeWidth="1.5" />
                <path d="M16 24h16M24 16v16" stroke="var(--brd2)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p className={styles.restTitle}>Dia de descanso</p>
            <p className={styles.restSub}>Recuperação é parte do treino. Descanse bem!</p>
          </div>
        ) : (
          <>
            {/* Cabeçalho do treino */}
            <div className={styles.trainHeader}>
              <div>
                <h1 className={styles.trainName} style={{ color: accentColor }}>{plan.name}</h1>
                <p className={styles.trainFocus}>{plan.focus}</p>
              </div>
              <div className={styles.trainMeta}>
                {isCompleted && (
                  <span className={styles.completedBadge}>✓ Concluído</span>
                )}
                <span className={styles.metaText}>{plan.exercises.length} ex · 3 séries</span>
              </div>
            </div>

            {/* Cards de exercícios */}
            {plan.exercises.map((ex, ei) => (
              <ExerciseCard
                key={ei}
                index={ei}
                name={ex}
                sets={currentSession.exercises[ei] ?? []}
                prevSets={prevSession ? (prevSession.exercises[ei] ?? null) : null}
                onUpdate={(si, field, value) => updateSerie(ei, si, field, value)}
              />
            ))}

            {/* Botão concluir */}
            <button
              className={styles.doneBtn}
              style={{ background: isCompleted ? 'var(--bg3)' : accentColor }}
              onClick={markDone}
            >
              {isCompleted ? 'Treino já concluído ✓' : 'Marcar como concluído'}
            </button>
          </>
        )}
      </main>
    </div>
  )
}
