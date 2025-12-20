#!/usr/bin/env node

/**
 * Test script to verify habit strength formula behavior
 * Run: node test-habit-strength.js
 */

// Constants from habitStrength.ts
const GROWTH_RATE = 0.03;
const BASE_DECAY = 0.02;
const SHIELD_EFFECTIVENESS = 0.7;

function calculateNewStrength(currentStrength, completed, completionsLast7Days) {
  const strength = Math.max(0, Math.min(100, currentStrength));
  const recentCompletions = Math.max(0, Math.min(7, completionsLast7Days));

  if (completed) {
    const gap = 100 - strength;
    const growth = gap * GROWTH_RATE;
    return Math.min(100, strength + growth);
  } else {
    const streakShield = recentCompletions / 7;
    const protectedDecay = BASE_DECAY * (1 - streakShield * SHIELD_EFFECTIVENESS);
    return Math.max(0, strength * (1 - protectedDecay));
  }
}

function getStrengthLevel(strength) {
  const normalized = strength > 1 ? strength / 100 : strength;
  if (normalized < 0.3) return '🌱 Starting';
  if (normalized < 0.6) return '🌿 Building';
  if (normalized < 0.85) return '💪 Strong';
  return '⚡ Automatic';
}

console.log('🧪 Habit Strength Formula Test\n');
console.log('Formula: v2.0 Momentum-Based');
console.log(`Constants: GROWTH=${GROWTH_RATE}, DECAY=${BASE_DECAY}, SHIELD=${SHIELD_EFFECTIVENESS}\n`);

// Test 1: First completion (AC3)
console.log('📊 Test 1: First Habit Completion');
const firstCompletion = calculateNewStrength(0, true, 0);
console.log(`Starting: 0%`);
console.log(`After 1st completion: ${firstCompletion.toFixed(2)}%`);
console.log(`Expected: ~3% ✓`);
console.log(`Result: ${firstCompletion >= 2.9 && firstCompletion <= 3.1 ? '✅ PASS' : '❌ FAIL'}\n`);

// Test 2: Perfect compliance progression
console.log('📊 Test 2: Perfect Compliance Progression');
let strength = 0;
const milestones = [1, 7, 14, 21, 30, 45, 60, 66];
const expected = [3, 19.2, 34.7, 47.3, 59.9, 74.6, 83.9, 86.6];

console.log('Day  | Strength | Level        | Expected');
console.log('-----|----------|--------------|----------');

for (let day = 1; day <= 66; day++) {
  strength = calculateNewStrength(strength, true, Math.min(day - 1, 7));

  if (milestones.includes(day)) {
    const idx = milestones.indexOf(day);
    const level = getStrengthLevel(strength / 100);
    const withinRange = Math.abs(strength - expected[idx]) < 2;
    const status = withinRange ? '✓' : '✗';
    console.log(
      `${String(day).padStart(4)} | ${strength.toFixed(1).padStart(8)}% | ${level.padEnd(12)} | ${expected[idx]}% ${status}`
    );
  }
}

console.log('\n📊 Test 3: Miss Protection (AC5)');
// Start at ~78% (after ~45 days)
strength = 0;
for (let i = 0; i < 45; i++) {
  strength = calculateNewStrength(strength, true, 7);
}
const beforeMiss = strength;
const afterMiss = calculateNewStrength(strength, false, 7);
const drop = beforeMiss - afterMiss;

console.log(`Before miss: ${beforeMiss.toFixed(2)}%`);
console.log(`After 1 miss (7/7 streak): ${afterMiss.toFixed(2)}%`);
console.log(`Drop: ${drop.toFixed(2)}%`);
console.log(`Expected: <0.5% drop ✓`);
console.log(`Result: ${drop < 0.5 ? '✅ PASS' : '❌ FAIL'}\n`);

// Test 4: 3 consecutive misses
console.log('📊 Test 4: 3 Consecutive Misses');
strength = 0;
for (let i = 0; i < 30; i++) {
  strength = calculateNewStrength(strength, true, 7);
}
const before3Misses = strength;
strength = calculateNewStrength(strength, false, 7);
strength = calculateNewStrength(strength, false, 6);
strength = calculateNewStrength(strength, false, 5);
const totalDrop = before3Misses - strength;

console.log(`Before misses: ${before3Misses.toFixed(2)}%`);
console.log(`After 3 misses: ${strength.toFixed(2)}%`);
console.log(`Total drop: ${totalDrop.toFixed(2)}%`);
console.log(`Expected: <2% total drop ✓`);
console.log(`Result: ${totalDrop < 2 ? '✅ PASS' : '❌ FAIL'}\n`);

console.log('✨ All tests completed!\n');
