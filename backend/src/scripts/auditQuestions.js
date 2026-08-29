import { APTITUDE_QUESTIONS, TECHNICAL_QUESTIONS } from '../lib/placementQuestionsData.js';
import { SAMPLE_QUESTIONS } from '../lib/seedPlacementData.js';
import { CODING_QUESTIONS } from '../lib/placementCodingQuestionsData.js';
import { NEW_MNC_QUESTIONS } from '../lib/newMncQuestionsData.js';
import { PLACEMENT_2026_QUESTIONS, CODING_2026_QUESTIONS } from '../lib/newPlacement2026Data.js';
import { INTERVIEW_QUESTIONS_DATA } from '../lib/interviewQuestionsData.js';

const allQuestions = [
  ...SAMPLE_QUESTIONS,
  ...APTITUDE_QUESTIONS,
  ...TECHNICAL_QUESTIONS,
  ...CODING_QUESTIONS,
  ...NEW_MNC_QUESTIONS,
  ...PLACEMENT_2026_QUESTIONS,
  ...CODING_2026_QUESTIONS,
  ...INTERVIEW_QUESTIONS_DATA,
];

console.log(`Total questions loaded: ${allQuestions.length}`);

let errors = [];

allQuestions.forEach((q, idx) => {
  if (!q.title) errors.push(`[${idx}] Missing title`);
  if (!q.category) errors.push(`[${idx}] Missing category: ${q.title}`);
  
  if (q.category === 'coding') {
    if (!q.testCases || q.testCases.length === 0) {
      errors.push(`[Coding][${idx}] Missing testCases: "${q.title}"`);
    }
    if (!q.starterCode || Object.keys(q.starterCode).length === 0) {
      errors.push(`[Coding][${idx}] Missing starterCode: "${q.title}"`);
    }
  } else if (q.category === 'interview') {
    if (!q.question && !q.description) {
      errors.push(`[Interview][${idx}] Missing question/description: "${q.title}"`);
    }
  } else {
    // MCQ category (aptitude, english, technical)
    if (!q.options || q.options.length < 2) {
      errors.push(`[MCQ][${idx}] Insufficient options: "${q.title}"`);
    }
    if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer >= q.options.length) {
      errors.push(`[MCQ][${idx}] Invalid correctAnswer (${q.correctAnswer}) for options length ${q.options?.length}: "${q.title}"`);
    }
  }
});

if (errors.length === 0) {
  console.log('✅ ALL QUESTIONS VALIDATED PERFECTLY! No structural or index errors found.');
} else {
  console.log(`❌ Found ${errors.length} errors:`);
  errors.forEach(e => console.log(e));
}
