export const MAX_LEVEL = 30;
// ****** ADJUST THIS SIGNIFICANTLY ******
export const XP_PER_LEVEL_BASE = 300; // Example: Start with 300 XP for Level 1 -> 2
// ****************************************
export const XP_LEVEL_MULTIPLIER = 1.03; // Example: Slightly gentler multiplier

// Your functions calculateLevel, calculateXpThresholdForLevel, getXpNeededForNextLevel
// are logically sound and will work correctly with these new constants.

/**
 * Calculates the user's current level based on their total XP.
 * The level is capped at MAX_LEVEL.
 */
export function calculateLevel(xp: number): number {
  if (xp < 0) xp = 0; // Ensure XP isn't negative
  let level = 1;
  let xpForNextLevelCost = XP_PER_LEVEL_BASE; // Cost to advance from current level to next
  let accumulatedXpToReachCurrentLevel = 0; // XP needed to reach the *start* of the current 'level'

  while (
    level < MAX_LEVEL &&
    xp >= accumulatedXpToReachCurrentLevel + xpForNextLevelCost
  ) {
    accumulatedXpToReachCurrentLevel += xpForNextLevelCost;
    level++;
    // Ensure cost doesn't grow ridiculously large if multiplier is high or becomes 0
    const nextCost = Math.floor(xpForNextLevelCost * XP_LEVEL_MULTIPLIER);
    xpForNextLevelCost = Math.max(1, nextCost); // Ensure cost is at least 1
  }
  return level;
}

/**
 * Calculates the total accumulated XP required to reach a specific targetLevel.
 */
export function calculateXpThresholdForLevel(targetLevel: number): number {
  if (targetLevel <= 1) {
    return 0;
  }
  if (targetLevel > MAX_LEVEL + 1) {
    // Cap to avoid excessive calculation if asking for level beyond max
    // Or calculate for MAX_LEVEL and add a symbolic "infinity" for anything beyond
    // For now, let's calculate up to MAX_LEVEL's threshold
    targetLevel = MAX_LEVEL;
  }

  let accumulatedXp = 0;
  let costToCompletePreviousLevel = XP_PER_LEVEL_BASE;

  for (let l = 1; l < targetLevel; l++) {
    if (l >= MAX_LEVEL && targetLevel > MAX_LEVEL) {
      // Stop accumulating if we are calculating for beyond MAX_LEVEL
      // This indicates XP for "level MAX_LEVEL+1", which is effectively infinite or not applicable
      // For getXpNeededForNextLevel, this means if currentLevel is MAX_LEVEL, it uses threshold for MAX_LEVEL+1
      // which will be the total XP to complete MAX_LEVEL.
    }
    accumulatedXp += costToCompletePreviousLevel;
    const nextCost = Math.floor(
      costToCompletePreviousLevel * XP_LEVEL_MULTIPLIER
    );
    costToCompletePreviousLevel = Math.max(1, nextCost); // Ensure cost is at least 1
  }
  return accumulatedXp;
}

/**
 * Calculates how much more XP a user needs to reach the next level from their current state.
 */
export function getXpNeededForNextLevel(
  totalUserXp: number,
  currentLevel: number
): number {
  if (currentLevel >= MAX_LEVEL) {
    return 0; // Already at max level, no more XP needed for a "next" level.
  }

  // Total XP required to ding to the (currentLevel + 1)
  const xpToReachNextLevelThreshold = calculateXpThresholdForLevel(
    currentLevel + 1
  );
  const xpNeeded = xpToReachNextLevelThreshold - totalUserXp;

  return Math.max(0, xpNeeded); // Ensure it's not negative (e.g. if user somehow has more XP than needed for next level but calculateLevel hasn't updated)
}
