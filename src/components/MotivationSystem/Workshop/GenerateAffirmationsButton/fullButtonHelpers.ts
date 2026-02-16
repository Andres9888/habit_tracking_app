import { clsx } from 'clsx';

export function getButtonClassName(
  isPremium: boolean,
  isGenerating: boolean,
  showSuccess: boolean,
  canGenerate: boolean
) {
  const base = 'flex-row items-center justify-center gap-2 rounded-xl py-3';
  if (!isPremium) return clsx(base, 'bg-stone-100');
  if (isGenerating) return base;
  if (showSuccess) return clsx(base, 'bg-emerald-500');
  if (canGenerate) return base;
  return clsx(base, 'bg-stone-300');
}

export function shouldShowGradient(
  isPremium: boolean,
  isGenerating: boolean,
  canGenerate: boolean,
  showSuccess: boolean
) {
  return isPremium && !showSuccess && (isGenerating || canGenerate);
}

export function getGradientColors(isGenerating: boolean): [string, string] {
  return isGenerating ? ['#a78bfa', '#c084fc'] : ['#7c3aed', '#a855f7'];
}
