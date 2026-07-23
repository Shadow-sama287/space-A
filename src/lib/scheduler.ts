import { calculateSM2 } from './sm2';
import { calculateFSRS } from './fsrs';

export interface ReviewScheduleInput {
  algorithm?: 'sm2' | 'fsrs' | string;
  targetRetention?: number;
  rating: number; // 0 = Again, 1 = Hard, 2 = Good, 3 = Easy
  currentInterval: number;
  currentEF: number;
  currentReps: number;
  stability?: number | null;
  difficulty?: number | null;
  lastReviewedAt?: string | null;
}

export interface ReviewScheduleResult {
  intervalDays: number;
  nextReviewDate: Date;
  easeFactor: number;
  repetitions: number;
  stability: number | null;
  difficulty: number | null;
  status: string;
}

/**
 * Calculates the next review parameters according to the selected algorithm (SM-2 or FSRS v5).
 */
export function calculateNextReview(input: ReviewScheduleInput): ReviewScheduleResult {
  const {
    algorithm = 'sm2',
    targetRetention = 0.90,
    rating,
    currentInterval,
    currentEF,
    currentReps,
    stability,
    difficulty,
    lastReviewedAt,
  } = input;

  let intervalDays: number;
  let easeFactor = currentEF;
  let repetitions = currentReps;
  let nextStability: number | null = stability ?? null;
  let nextDifficulty: number | null = difficulty ?? null;
  let nextReviewDate: Date;

  if (algorithm === 'fsrs') {
    const fsrsRes = calculateFSRS(
      rating,
      {
        currentInterval,
        stability,
        difficulty,
        repetitions: currentReps,
        lastReviewedAt,
      },
      targetRetention
    );

    intervalDays = fsrsRes.intervalDays;
    nextStability = fsrsRes.stability;
    nextDifficulty = fsrsRes.difficulty;
    repetitions = fsrsRes.repetitions;
    nextReviewDate = fsrsRes.nextReviewDate;

    // Keep SM-2 ease factor in sync for backwards compatibility
    if (rating === 0) {
      easeFactor = Math.max(1.3, easeFactor - 0.2);
    } else if (rating === 3) {
      easeFactor = easeFactor + 0.15;
    }
    easeFactor = Math.round(easeFactor * 100) / 100;
  } else {
    // Standard SM-2 algorithm
    const sm2Res = calculateSM2(rating, currentInterval, currentEF, currentReps);
    intervalDays = sm2Res.intervalDays;
    easeFactor = sm2Res.easeFactor;
    repetitions = sm2Res.repetitions;

    nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays);
  }

  // Determine status (mastered if interval > 120 days or ease factor / stability is very high)
  let status = 'reviewing';
  if (intervalDays > 120 || easeFactor >= 4.0 || (nextStability && nextStability > 180)) {
    status = 'mastered';
  }

  return {
    intervalDays,
    nextReviewDate,
    easeFactor,
    repetitions,
    stability: nextStability,
    difficulty: nextDifficulty,
    status,
  };
}

/**
 * Predicts next review intervals for all 4 ratings (0=Again, 1=Hard, 2=Good, 3=Easy)
 * to display dynamic badges on review UI buttons.
 */
export function predictAllIntervals(input: Omit<ReviewScheduleInput, 'rating'>): Record<number, number> {
  const ratings = [0, 1, 2, 3];
  const predictions: Record<number, number> = {};

  for (const r of ratings) {
    const res = calculateNextReview({ ...input, rating: r });
    predictions[r] = res.intervalDays;
  }

  return predictions;
}
