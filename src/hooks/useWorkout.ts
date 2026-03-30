'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { initAuth, loadSession, saveSession, markSessionComplete } from '@/lib/firebase'
import { PLAN, DAYS, JS_DAY_MAP, emptyExercises, DayKey } from '@/lib/workout-data'
import type { Serie, SessionData } from '@/types/workout'

// Cache local em memória durante a sessão
type Cache = Record<string, Record<string, SessionData>>

export function useWorkout() {
  const [uid, setUid] = useState<string | null>(null)
  const [currentWeek, setCurrentWeek] = useState(1)
  const [selectedDay, setSelectedDay] = useState<DayKey>(
    JS_DAY_MAP[new Date().getDay()] ?? 'Seg'
  )
  const [compareMode, setCompareMode] = useState(false)
  const [cache, setCache] = useState<Cache>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const saveTimer = useRef<NodeJS.Timeout | null>(null)

  // Inicializa auth anônimo
  useEffect(() => {
    initAuth().then((id) => {
      setUid(id)
      setLoading(false)
    })
  }, [])

  function cacheKey(week: number) {
    return `w${week}`
  }

  function getSession(week: number, day: DayKey): SessionData {
    const wk = cache[cacheKey(week)]
    if (wk?.[day]) return wk[day]
    return {
      exercises: emptyExercises(PLAN[day].exercises),
      completedAt: null,
    }
  }

  // Carrega sessão do Firestore (se não estiver em cache)
  const ensureLoaded = useCallback(
    async (week: number, day: DayKey) => {
      if (!uid) return
      const wk = cacheKey(week)
      if (cache[wk]?.[day] !== undefined) return

      const data = await loadSession(uid, week, day)
      const session: SessionData = data ?? {
        exercises: emptyExercises(PLAN[day].exercises),
        completedAt: null,
      }
      setCache((prev) => ({
        ...prev,
        [wk]: { ...prev[wk], [day]: session },
      }))
    },
    [uid, cache]
  )

  // Toda vez que semana/dia muda, carrega do Firebase
  useEffect(() => {
    if (!uid) return
    ensureLoaded(currentWeek, selectedDay)
    if (compareMode && currentWeek > 1) {
      ensureLoaded(currentWeek - 1, selectedDay)
    }
  }, [uid, currentWeek, selectedDay, compareMode])

  // Atualiza valor de uma série e agenda save com debounce
  function updateSerie(
    exerciseIdx: number,
    serieIdx: number,
    field: 'kg' | 'reps',
    value: string
  ) {
    if (!uid) return
    const wk = cacheKey(currentWeek)
    const current = getSession(currentWeek, selectedDay)
    const updated: SessionData = {
      ...current,
      exercises: current.exercises.map((ex, ei) =>
        ei === exerciseIdx
          ? ex.map((s, si) =>
              si === serieIdx ? { ...s, [field]: value } : s
            )
          : ex
      ),
    }

    setCache((prev) => ({
      ...prev,
      [wk]: { ...prev[wk], [selectedDay]: updated },
    }))

    // Debounce save: espera 1.5s sem digitar para salvar
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      setSaving(true)
      await saveSession(uid, currentWeek, selectedDay, updated)
      setSaving(false)
    }, 1500)
  }

  async function markDone() {
    if (!uid) return
    setSaving(true)
    const session = getSession(currentWeek, selectedDay)
    await markSessionComplete(uid, currentWeek, selectedDay, session.exercises)
    const wk = cacheKey(currentWeek)
    setCache((prev) => ({
      ...prev,
      [wk]: {
        ...prev[wk],
        [selectedDay]: { ...session, completedAt: new Date().toISOString() },
      },
    }))
    setSaving(false)
  }

  function changeWeek(dir: number) {
    const next = Math.max(1, currentWeek + dir)
    setCurrentWeek(next)
    setCompareMode(false)
  }

  const currentSession = getSession(currentWeek, selectedDay)
  const prevSession =
    compareMode && currentWeek > 1
      ? getSession(currentWeek - 1, selectedDay)
      : null

  return {
    uid,
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
    todayKey: JS_DAY_MAP[new Date().getDay()] ?? ('Seg' as DayKey),
  }
}
