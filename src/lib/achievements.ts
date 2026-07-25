export interface Achievement {
  id: string;
  category: 'SOLVE' | 'MASTERY' | 'STREAK' | 'CORE' | 'DAILY' | 'UNIQUE';
  name: string;
  desc: string;
  target: number;
  current: number;
  isUnlocked: boolean;
  badgeCode: string;
}

export function calculateAchievements(params: {
  solvedCount: number;
  masteredCount: number;
  streak: number;
  maxStreak: number;
  problemsSolvedToday?: number;
  dailyGoal?: number;
}): Achievement[] {
  const { solvedCount, masteredCount, streak, maxStreak, problemsSolvedToday = 0, dailyGoal = 0 } = params;
  const bestStreak = Math.max(streak, maxStreak);

  return [
    // === SOLVE MILESTONES ===
    {
      id: 'FIRST_BLOOD',
      category: 'SOLVE',
      name: 'FIRST BLOOD',
      desc: 'Solve your first DSA problem in Space A',
      target: 1,
      current: solvedCount,
      isUnlocked: solvedCount >= 1,
      badgeCode: '[ ACH-01 ]',
    },
    {
      id: 'NOVICE_SOLVER',
      category: 'SOLVE',
      name: 'NOVICE SOLVER',
      desc: 'Solve 10 DSA problems across active sheets',
      target: 10,
      current: solvedCount,
      isUnlocked: solvedCount >= 10,
      badgeCode: '[ ACH-02 ]',
    },
    {
      id: 'HALF_CENTURY',
      category: 'SOLVE',
      name: 'HALF CENTURY',
      desc: 'Solve 50 DSA problems across active sheets',
      target: 50,
      current: solvedCount,
      isUnlocked: solvedCount >= 50,
      badgeCode: '[ ACH-03 ]',
    },
    {
      id: 'CENTURION',
      category: 'SOLVE',
      name: 'CENTURION SOLVER',
      desc: 'Solve 100 DSA problems across active sheets',
      target: 100,
      current: solvedCount,
      isUnlocked: solvedCount >= 100,
      badgeCode: '[ ACH-04 ]',
    },

    // === MASTERY MILESTONES ===
    {
      id: 'FIRST_MASTERED',
      category: 'MASTERY',
      name: 'FIRST MASTERY',
      desc: 'Reach Mastered status on 1 problem (Interval > 120d or EF >= 4.0)',
      target: 1,
      current: masteredCount,
      isUnlocked: masteredCount >= 1,
      badgeCode: '[ MST-01 ]',
    },
    {
      id: 'MASTER_MINDS',
      category: 'MASTERY',
      name: 'MASTER MINDS',
      desc: 'Reach Mastered status on 10 problems',
      target: 10,
      current: masteredCount,
      isUnlocked: masteredCount >= 10,
      badgeCode: '[ MST-02 ]',
    },

    // === 3D CORE UNLOCK ACHIEVEMENTS ===
    {
      id: 'CORE_OCTAHEDRON',
      category: 'CORE',
      name: 'UNLOCKED OCTAHEDRON CORE',
      desc: 'Reach a 1-Day Solve Streak to unlock 3D Octahedron Core',
      target: 1,
      current: bestStreak,
      isUnlocked: bestStreak >= 1,
      badgeCode: '[ CORE-01 ]',
    },
    {
      id: 'CORE_ICOSAHEDRON',
      category: 'CORE',
      name: 'UNLOCKED ICOSAHEDRON CORE',
      desc: 'Reach a 4-Day Solve Streak to unlock 3D Icosahedron Core',
      target: 4,
      current: bestStreak,
      isUnlocked: bestStreak >= 4,
      badgeCode: '[ CORE-02 ]',
    },
    {
      id: 'CORE_TESSERACT',
      category: 'CORE',
      name: 'UNLOCKED 4D TESSERACT CORE',
      desc: 'Reach a 7-Day Solve Streak to unlock 4D Hypercube Tesseract Core',
      target: 7,
      current: bestStreak,
      isUnlocked: bestStreak >= 7,
      badgeCode: '[ CORE-03 ]',
    },
    {
      id: 'CORE_STAR_POLYHEDRON',
      category: 'CORE',
      name: 'UNLOCKED STAR POLYHEDRON CORE',
      desc: 'Reach a 15-Day Solve Streak to unlock 3D Stellarated Star Core',
      target: 15,
      current: bestStreak,
      isUnlocked: bestStreak >= 15,
      badgeCode: '[ CORE-04 ]',
    },
    {
      id: 'CORE_QUANTUM_GEODESIC',
      category: 'CORE',
      name: 'UNLOCKED QUANTUM GEODESIC CORE',
      desc: 'Reach a 30-Day Solve Streak to unlock Quantum Geodesic Core',
      target: 30,
      current: bestStreak,
      isUnlocked: bestStreak >= 30,
      badgeCode: '[ CORE-05 ]',
    },

    // === DAILY SOLVE MILESTONES ===
    {
      id: 'VIBE_CHECK',
      category: 'DAILY',
      name: 'VIBE CHECK',
      desc: 'Solve 2 problems in a single day',
      target: 2,
      current: problemsSolvedToday,
      isUnlocked: problemsSolvedToday >= 2,
      badgeCode: '[ DLY-01 ]',
    },
    {
      id: 'LOCKED_IN',
      category: 'DAILY',
      name: 'LOCKED IN',
      desc: 'Solve 5 problems in a single day',
      target: 5,
      current: problemsSolvedToday,
      isUnlocked: problemsSolvedToday >= 5,
      badgeCode: '[ DLY-02 ]',
    },
    {
      id: 'TOUCH_GRASS',
      category: 'DAILY',
      name: 'TOUCH GRASS',
      desc: 'Solve 10 problems in a single day',
      target: 10,
      current: problemsSolvedToday,
      isUnlocked: problemsSolvedToday >= 10,
      badgeCode: '[ DLY-03 ]',
    },
    {
      id: 'UNEXISTING_ENTITY',
      category: 'DAILY',
      name: 'UNEXISTING ENTITY',
      desc: 'Solve 20 problems in a single day (Are you hacking?!)',
      target: 20,
      current: problemsSolvedToday,
      isUnlocked: problemsSolvedToday >= 20,
      badgeCode: '[ DLY-04 ]',
    },

    // === UNIQUE GOAL MILESTONES ===
    {
      id: 'ABSOLUTE_ZERO',
      category: 'UNIQUE',
      name: 'ABSOLUTE ZERO',
      desc: 'Hit exactly your daily goal amount!',
      target: dailyGoal > 0 ? dailyGoal : 1,
      current: problemsSolvedToday,
      isUnlocked: dailyGoal > 0 && problemsSolvedToday >= dailyGoal,
      badgeCode: '[ UNQ-01 ]',
    },
    {
      id: 'PUSHING_PAST_THE_LIMITS',
      category: 'UNIQUE',
      name: 'PUSHING PAST THE LIMITS',
      desc: 'Surpass your daily goal and trigger the glitched counter!',
      target: dailyGoal > 0 ? dailyGoal + 1 : 2,
      current: problemsSolvedToday,
      isUnlocked: dailyGoal > 0 && problemsSolvedToday > dailyGoal,
      badgeCode: '[ UNQ-02 ]',
    },
  ];
}
