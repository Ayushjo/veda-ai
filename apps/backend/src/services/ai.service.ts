import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { config } from '../config.js';
import { IAssignment } from '../models/Assignment.model.js';

// ─── Zod schemas ────────────────────────────────────────────────────────────

const QuestionSchema = z.object({
  id: z.number(),
  text: z.string().min(1),
  type: z.enum(['mcq', 'short', 'long', 'true-false']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  marks: z.number().min(1),
  options: z.array(z.string()).optional().default([]),
});

const SectionSchema = z.object({
  title: z.string(),
  instruction: z.string(),
  questions: z.array(QuestionSchema),
});

const PaperSchema = z.object({
  duration: z.string(),
  sections: z.array(SectionSchema),
});

export type ParsedPaper = z.infer<typeof PaperSchema>;

// ─── Prompt builder ──────────────────────────────────────────────────────────

function buildPrompt(assignment: IAssignment): string {
  const questionRequirements = assignment.questionTypes
    .map(
      (qt) =>
        `  - ${qt.type.toUpperCase()}: ${qt.count} question(s), ${qt.marksEach} mark(s) each`,
    )
    .join('\n');

  const referenceBlock = assignment.fileText
    ? `\nReference Material:\n---\n${assignment.fileText}\n---`
    : '';

  return `You are an expert academic paper generator. Create a question paper for the following assignment.

Assignment Details:
- Subject: ${assignment.subject}
- Grade Level: ${assignment.gradeLevel}
- Additional Instructions: ${assignment.additionalInstructions || 'None'}
${referenceBlock}

Question Requirements:
${questionRequirements}

Rules:
1. Group MCQ and True/False questions into Section A ("Objective Questions").
2. Group Short Answer questions into Section B ("Short Answer Questions").
3. Group Long Answer questions into Section C ("Long Answer Questions").
4. Only include sections that actually have questions.
5. Each question must have a difficulty field: "easy", "medium", or "hard".
6. Distribute difficulty per section: ~40% easy, 40% medium, 20% hard (round naturally).
7. MCQ questions must have exactly 4 options formatted as: ["A. text", "B. text", "C. text", "D. text"].
8. True/False questions must have exactly: ["A. True", "B. False"].
9. Question id must be a sequential integer starting from 1 and continuing across ALL sections (never reset).
10. Return ONLY valid JSON. No markdown fences, no explanation, no extra text outside the JSON.

Output Format (return exactly this shape):
{
  "duration": "2 hours",
  "sections": [
    {
      "title": "Section A: Objective Questions",
      "instruction": "Choose the best answer for each question.",
      "questions": [
        {
          "id": 1,
          "text": "Question text here",
          "type": "mcq",
          "difficulty": "easy",
          "marks": 2,
          "options": ["A. Option one", "B. Option two", "C. Option three", "D. Option four"]
        },
        {
          "id": 2,
          "text": "True or False: Statement here",
          "type": "true-false",
          "difficulty": "easy",
          "marks": 1,
          "options": ["A. True", "B. False"]
        }
      ]
    },
    {
      "title": "Section B: Short Answer Questions",
      "instruction": "Answer each question briefly in 2–4 sentences.",
      "questions": [
        {
          "id": 3,
          "text": "Short answer question here",
          "type": "short",
          "difficulty": "medium",
          "marks": 5,
          "options": []
        }
      ]
    }
  ]
}`;
}

// ─── Main export ─────────────────────────────────────────────────────────────

export async function generateQuestionPaper(assignment: IAssignment): Promise<ParsedPaper> {
  const client = new Anthropic({ apiKey: config.anthropicApiKey });
  const prompt = buildPrompt(assignment);

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 8000,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = response.content[0].type === 'text' ? response.content[0].text : '';

  // Strip any accidental markdown fences
  const cleaned = raw.replace(/```json|```/g, '').trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error('AI returned invalid JSON');
  }

  // Zod validates shape and throws a descriptive error if wrong
  const validated = PaperSchema.parse(parsed);
  return validated;
}
