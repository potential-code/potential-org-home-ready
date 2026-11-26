import type { Block, Course, CourseLevel, Localized, Module, Unit, UnitKind } from '@shared/types'
import { now } from '@/lib/clock'
import { type DemoDb, getDb, update } from '../db'

/**
 * Admin authoring: courses, modules, units and blocks. Every change writes the shared demo db, so
 * the learner's catalogue and course view show it straight away.
 */

export interface CourseDraft {
  title: Localized
  summary: Localized
  description: Localized
  level: CourseLevel
  tags: string[]
}
export type ModuleDraft = Pick<Module, 'title' | 'summary'>
export interface UnitDraft {
  title: Localized
  summary: Localized
  kind: UnitKind
  published: boolean
}
export type BlockDraft = Omit<Block, 'id'>
export type MoveDir = -1 | 1

/** Next free id with a prefix, unique across the whole course catalogue. */
function newId(prefix: string): string {
  const used = JSON.stringify(getDb().courses)
  let n = 1
  while (used.includes(`"${prefix}${n}"`)) n++
  return `${prefix}${n}`
}

function move<T extends { id: string }>(list: T[], id: string, dir: MoveDir): T[] {
  const i = list.findIndex((x) => x.id === id)
  const j = i + dir
  if (i < 0 || j < 0 || j >= list.length) return list
  const next = [...list]
  const a = next[i]
  const b = next[j]
  if (!a || !b) return list
  next[i] = b
  next[j] = a
  return next
}

/** Lesson minutes follow their blocks. */
function withMinutes(u: Unit): Unit {
  return u.kind === 'lesson' ? { ...u, minutes: u.blocks.reduce((a, b) => a + b.minutes, 0) } : u
}

function editCourse(courseId: string, fn: (c: Course) => Course) {
  update((db: DemoDb) => ({
    ...db,
    courses: db.courses.map((c) => (c.id === courseId ? { ...fn(c), updatedAt: now() } : c)),
  }))
}

function editModules(courseId: string, fn: (ms: Module[]) => Module[]) {
  editCourse(courseId, (c) => ({ ...c, modules: fn(c.modules) }))
}

function editUnits(courseId: string, moduleId: string, fn: (us: Unit[]) => Unit[]) {
  editModules(courseId, (ms) =>
    ms.map((m) => (m.id === moduleId ? { ...m, units: fn(m.units) } : m)),
  )
}

function editUnit(courseId: string, unitId: string, fn: (u: Unit) => Unit) {
  editModules(courseId, (ms) =>
    ms.map((m) => ({
      ...m,
      units: m.units.map((u) => (u.id === unitId ? withMinutes(fn(u)) : u)),
    })),
  )
}

// ---------------------------------------------------------------- courses

export function createCourse(draft: CourseDraft): string {
  const id = newId('C0')
  const course: Course = {
    id,
    ...draft,
    status: 'draft',
    seedLearners: 0,
    modules: [],
    updatedAt: now(),
  }
  update((db) => ({ ...db, courses: [course, ...db.courses] }))
  return id
}

export function updateCourse(courseId: string, draft: CourseDraft) {
  editCourse(courseId, (c) => ({ ...c, ...draft }))
}

export function setCoursePublished(courseId: string, published: boolean) {
  editCourse(courseId, (c) => ({ ...c, status: published ? 'published' : 'draft' }))
}

// ---------------------------------------------------------------- modules

export function addModule(courseId: string, draft: ModuleDraft) {
  const id = newId('M')
  editModules(courseId, (ms) => [...ms, { id, ...draft, units: [] }])
}
export function updateModule(courseId: string, moduleId: string, draft: ModuleDraft) {
  editModules(courseId, (ms) => ms.map((m) => (m.id === moduleId ? { ...m, ...draft } : m)))
}
export function deleteModule(courseId: string, moduleId: string) {
  editModules(courseId, (ms) => ms.filter((m) => m.id !== moduleId))
}
export function moveModule(courseId: string, moduleId: string, dir: MoveDir) {
  editModules(courseId, (ms) => move(ms, moduleId, dir))
}

// ---------------------------------------------------------------- units

export function addUnit(courseId: string, moduleId: string, draft: UnitDraft) {
  const id = newId('U')
  const unit: Unit = {
    id,
    ...draft,
    minutes: draft.kind === 'quiz' ? 5 : 0,
    blocks: [],
    quiz: draft.kind === 'quiz' ? { passMark: 70, questions: [] } : undefined,
  }
  editUnits(courseId, moduleId, (us) => [...us, unit])
}
export function updateUnit(courseId: string, unitId: string, draft: UnitDraft) {
  editUnit(courseId, unitId, (u) => ({
    ...u,
    ...draft,
    quiz: draft.kind === 'quiz' ? (u.quiz ?? { passMark: 70, questions: [] }) : u.quiz,
  }))
}
export function setUnitPublished(courseId: string, unitId: string, published: boolean) {
  editUnit(courseId, unitId, (u) => ({ ...u, published }))
}
export function deleteUnit(courseId: string, moduleId: string, unitId: string) {
  editUnits(courseId, moduleId, (us) => us.filter((u) => u.id !== unitId))
}
export function moveUnit(courseId: string, moduleId: string, unitId: string, dir: MoveDir) {
  editUnits(courseId, moduleId, (us) => move(us, unitId, dir))
}

// ---------------------------------------------------------------- blocks

export function addBlock(courseId: string, unitId: string, draft: BlockDraft) {
  const id = newId('B')
  editUnit(courseId, unitId, (u) => ({ ...u, blocks: [...u.blocks, { id, ...draft }] }))
}
export function updateBlock(courseId: string, unitId: string, blockId: string, draft: BlockDraft) {
  editUnit(courseId, unitId, (u) => ({
    ...u,
    blocks: u.blocks.map((b) => (b.id === blockId ? { id: b.id, ...draft } : b)),
  }))
}
export function deleteBlock(courseId: string, unitId: string, blockId: string) {
  editUnit(courseId, unitId, (u) => ({ ...u, blocks: u.blocks.filter((b) => b.id !== blockId) }))
}
export function moveBlock(courseId: string, unitId: string, blockId: string, dir: MoveDir) {
  editUnit(courseId, unitId, (u) => ({ ...u, blocks: move(u.blocks, blockId, dir) }))
}
