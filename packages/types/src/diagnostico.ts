export type QuestionType = 'text' | 'textarea' | 'select' | 'single' | 'multi' | 'contact'

export interface RichOption {
  e: string
  l: string
  d: string
}

export interface ContactField {
  id: string
  label: string
  placeholder?: string
  inputType: 'text' | 'email' | 'tel'
  required?: boolean
}

export interface QuestionBase {
  id: string
  type: QuestionType
  text: string
  hint?: string
  placeholder?: string
}

export interface TextQuestion extends QuestionBase {
  type: 'text'
  placeholder?: string
}

export interface TextareaQuestion extends QuestionBase {
  type: 'textarea'
  placeholder?: string
  minLength?: number
  maxLength?: number
  required?: boolean
}

export interface SelectQuestion extends QuestionBase {
  type: 'select'
  options: string[]
}

export interface SingleQuestion extends QuestionBase {
  type: 'single'
  options: RichOption[]
}

export interface MultiQuestion extends QuestionBase {
  type: 'multi'
  options: RichOption[]
}

export interface ContactQuestion extends QuestionBase {
  type: 'contact'
  fields: ContactField[]
}

export type Question =
  | TextQuestion
  | TextareaQuestion
  | SelectQuestion
  | SingleQuestion
  | MultiQuestion
  | ContactQuestion

export interface QuestionSection {
  label: string
  questions: Question[]
}

export type FlatQuestion = Question & {
  sectionLabel: string
}

export type Answers = Record<string, string | string[]>

export type DiagnosticoScreen = 'intro' | 'quiz' | 'loading' | 'report'

export interface ScoreInfo {
  label: string
  color: string
  desc: string
}

export interface Pillar {
  icon: string
  name: string
  score: number
}

export interface DiagnosticoReport {
  score: number
  scoreInfo: ScoreInfo
  pillars: Pillar[]
  reportHtml: string
  aiGenerated?: boolean
}

export interface DiagnosticoApiResponse {
  reportHtml: string
  score: number
  scoreInfo: ScoreInfo
  pillars: Pillar[]
  aiGenerated: boolean
  sheetSaved?: boolean
  sheetQueued?: boolean
  error?: string
}
