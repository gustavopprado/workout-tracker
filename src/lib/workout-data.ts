export type DayKey = 'Seg' | 'Ter' | 'Qua' | 'Qui' | 'Sex' | 'Sab' | 'Dom'

export interface DayPlan {
  name: string
  focus: string
  type: 'push' | 'pull' | 'legs' | 'rest'
  exercises: string[]
}

export const DAYS: DayKey[] = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']

// Mapeia getDay() do JS para o índice em DAYS
export const JS_DAY_MAP: Record<number, DayKey> = {
  1: 'Seg',
  2: 'Ter',
  3: 'Qua',
  4: 'Qui',
  5: 'Sex',
  6: 'Sab',
  0: 'Dom',
}

export const PLAN: Record<DayKey, DayPlan> = {
  Seg: {
    name: 'Push A',
    focus: 'Peito · Ombro · Tríceps',
    type: 'push',
    exercises: [
      'Supino Reto com barra',
      'Supino Inclinado com halteres',
      'Crucifixo na polia',
      'Desenvolvimento com halteres',
      'Elevação lateral com halteres',
      'Tríceps corda na polia',
      'Tríceps testa',
    ],
  },
  Ter: {
    name: 'Pull A',
    focus: 'Costas · Bíceps',
    type: 'pull',
    exercises: [
      'Puxada frontal aberta',
      'Remada curvada com barra',
      'Remada na máquina',
      'Puxada fechada (pegada neutra)',
      'Crucifixo invertido na máquina',
      'Rosca direta com barra',
      'Rosca martelo',
    ],
  },
  Qua: {
    name: 'Legs A',
    focus: 'Quadríceps · Posterior',
    type: 'legs',
    exercises: [
      'Hack Squat',
      'Leg press 45°',
      'Cadeira extensora',
      'Cadeira adutora',
      'Mesa flexora',
      'Stiff com barra',
      'Panturrilha em pé',
    ],
  },
  Qui: {
    name: 'Push B',
    focus: 'Ombro · Peito · Tríceps',
    type: 'push',
    exercises: [
      'Desenvolvimento na máquina',
      'Supino Inclinado com barra',
      'Elevação lateral com halteres',
      'Supino fechado com barra',
      'Elevação frontal com halteres',
      'Tríceps na máquina',
      'Tríceps francês',
    ],
  },
  Sex: {
    name: 'Pull B',
    focus: 'Costas · Bíceps · Trapézio',
    type: 'pull',
    exercises: [
      'Barra fixa ou assistida',
      'Remada cavalinho',
      'Puxada aberta na polia',
      'Remada na máquina / barra T',
      'Rosca concentrada',
      'Rosca Scott',
      'Encolhimento com barra',
    ],
  },
  Sab: {
    name: 'Legs B',
    focus: 'Posterior · Glúteo',
    type: 'legs',
    exercises: [
      'Stiff com halteres',
      'Cadeira flexora',
      'Hip Thrust',
      'Leg press pegada fechada e alta',
      'Abdução na máquina',
      'Panturrilha sentado',
      'Prancha abdominal',
    ],
  },
  Dom: {
    name: 'Descanso',
    focus: '',
    type: 'rest',
    exercises: [],
  },
}

export const TYPE_COLOR: Record<string, string> = {
  push: '#CA3E47',
  pull: '#1D9E75',
  legs: '#BA7517',
  rest: '#525252',
}

export const SERIES_COUNT = 3

export function emptyExercises(exercises: string[]) {
  return exercises.map(() =>
    Array.from({ length: SERIES_COUNT }, () => ({ kg: '', reps: '' }))
  )
}
