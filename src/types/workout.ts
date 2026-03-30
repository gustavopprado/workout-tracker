export type Serie = {
  kg: string
  reps: string
}

export type SessionData = {
  exercises: Serie[][]
  completedAt: string | null
}

export type WeekData = Record<string, SessionData>
