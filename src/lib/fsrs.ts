import { fsrs, generatorParameters, Rating, State, Card, createEmptyCard } from 'ts-fsrs';

export interface FSRSResult {
  intervalDays: number;
  stability: number;
  difficulty: number;
  nextReviewDate: Date;
  repetitions: number;
}

export interface FSRSInputState {
  currentInterval?: number;
  stability?: number | null;
  difficulty?: number | null;
  repetitions?: number;
  lastReviewedAt?: string | null;
}

/**
 * Calculates next review parameters using FSRS-v5 algorithm.
 * 
 * @param rating User rating: 0 = Again, 1 = Hard, 2 = Good, 3 = Easy
 * @param state Current card memory state (stability, difficulty, interval, repetitions)
 * @param targetRetention Desired retention probability (0.80 - 0.95, default 0.90)
 */
export function calculateFSRS(
  rating: number,
  state: FSRSInputState,
  targetRetention: number = 0.90
): FSRSResult {
  // Clamp targetRetention between 0.70 and 0.97
  const requestRetention = Math.min(Math.max(targetRetention, 0.70), 0.97);

  // Initialize FSRS engine with target retention
  const params = generatorParameters({ request_retention: requestRetention });
  const f = fsrs(params);

  // Map 0-3 rating to ts-fsrs Rating enum
  // 0 -> Rating.Again
  // 1 -> Rating.Hard
  // 2 -> Rating.Good
  // 3 -> Rating.Easy
  const ratingMap: Record<number, Rating> = {
    0: Rating.Again,
    1: Rating.Hard,
    2: Rating.Good,
    3: Rating.Easy,
  };
  const fsrsRating = ratingMap[rating] ?? Rating.Good;

  const now = new Date();

  // Reconstruct card state
  let card: Card = createEmptyCard(now);

  if (state.stability && state.difficulty) {
    card = {
      ...card,
      stability: Number(state.stability),
      difficulty: Number(state.difficulty),
      reps: state.repetitions || 0,
      state: (state.repetitions || 0) > 0 ? State.Review : State.New,
      last_review: state.lastReviewedAt ? new Date(state.lastReviewedAt) : now,
    };
  } else if (state.currentInterval && state.currentInterval > 0) {
    // Smooth Auto-Conversion: infer initial stability from existing SM-2 interval
    const initialStability = Math.max(state.currentInterval, 1);
    card = {
      ...card,
      stability: initialStability,
      difficulty: 5.0, // Baseline average difficulty
      reps: state.repetitions || 1,
      state: State.Review,
      last_review: state.lastReviewedAt ? new Date(state.lastReviewedAt) : now,
    };
  }

  // Calculate repeat schedules for current card at time 'now'
  const itemRecords = (f.repeat(card, now) as unknown) as Record<number, any>;
  const scheduledItem = itemRecords[fsrsRating] || itemRecords[Rating.Good];

  const updatedCard = scheduledItem.card;
  const intervalDays = Math.max(1, Math.round(updatedCard.scheduled_days));
  const nextReviewDate = updatedCard.due;

  return {
    intervalDays,
    stability: Math.round(updatedCard.stability * 100) / 100,
    difficulty: Math.round(updatedCard.difficulty * 100) / 100,
    nextReviewDate,
    repetitions: updatedCard.reps,
  };
}
