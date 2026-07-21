import { allQuestions, questionSections } from '@dupply/diagnostico'

export function stripSectionEmoji(label: string): string {
  return label.replace(/^\S+\s+/, '').trim() || label
}

export function getQuestionSectionMeta(questionIndex: number) {
  const question = allQuestions[questionIndex]
  const sectionIndex = questionSections.findIndex((section) => section.label === question?.sectionLabel)
  const section = sectionIndex >= 0 ? questionSections[sectionIndex] : undefined
  const questionId = question && 'id' in question ? question.id : undefined

  let positionInSection = 1
  if (section && questionId) {
    const idx = section.questions.findIndex((item) => item.id === questionId)
    positionInSection = idx >= 0 ? idx + 1 : 1
  }

  return {
    sectionIndex: sectionIndex >= 0 ? sectionIndex + 1 : 1,
    sectionCount: questionSections.length,
    sectionLabel: stripSectionEmoji(question?.sectionLabel ?? ''),
    sectionLabelRaw: question?.sectionLabel ?? '',
    positionInSection,
    sectionQuestionCount: section?.questions.length ?? 1,
    questionId: questionId ?? `step_${questionIndex}`,
  }
}
