export interface SM2Result {
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
}

/**
 * Calculates the next review interval, ease factor, and repetition count
 * using the SuperMemo-2 (SM-2) algorithm.
 * 
 * @param rating User rating of recall quality:
 *               0 = Again (fail, forgot the problem)
 *               1 = Hard (passed, but with significant difficulty)
 *               2 = Good (passed, normal recall)
 *               3 = Easy (passed, perfect/instant recall)
 * @param currentInterval Current interval in days
 * @param currentEF Current ease factor
 * @param currentRepetitions Current consecutive correct repetitions
 */
export function calculateSM2(
  rating: number,
  currentInterval: number,
  currentEF: number,
  currentRepetitions: number
): SM2Result {
  // Map rating (0-3) to standard SM-2 quality rating (0-5)
  // 0 -> 0 (Forgot completely)
  // 1 -> 3 (Correct after serious difficulty)
  // 2 -> 4 (Correct after hesitation / normal response)
  // 3 -> 5 (Perfect recall)
  let q: number;
  if (rating === 0) {
    q = 0;
  } else if (rating === 1) {
    q = 3;
  } else if (rating === 2) {
    q = 4;
  } else {
    q = 5;
  }

  let easeFactor = currentEF;
  let repetitions = currentRepetitions;
  let intervalDays = currentInterval;

  if (q < 3) {
    // Fail: reset repetitions and schedule for tomorrow
    repetitions = 0;
    intervalDays = 1;
  } else {
    // Pass: increment repetitions and schedule accordingly
    if (repetitions === 0) {
      intervalDays = 1;
    } else if (repetitions === 1) {
      intervalDays = 4; // Use 4 days instead of 6 for a tighter initial coding review
    } else {
      intervalDays = Math.ceil(currentInterval * easeFactor);
    }
    repetitions = repetitions + 1;
  }

  // Adjust Ease Factor (standard SM-2 formula)
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  
  // SM-2 specifies ease factor should not fall below 1.3
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  // Keep ease factor clean (round to 2 decimal places)
  easeFactor = Math.round(easeFactor * 100) / 100;

  return {
    intervalDays,
    easeFactor,
    repetitions,
  };
}
