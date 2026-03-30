const CREDITS_KEY = 'ratten_credits';
const INITIALIZED_KEY = 'ratten_initialized';

export function getCredits(): number {
  const stored = localStorage.getItem(CREDITS_KEY);
  if (stored !== null) return parseInt(stored, 10);
  
  if (!localStorage.getItem(INITIALIZED_KEY)) {
    localStorage.setItem(INITIALIZED_KEY, 'true');
    localStorage.setItem(CREDITS_KEY, '2');
    return 2;
  }
  return 0;
}

export function useCredit(): boolean {
  const current = getCredits();
  if (current <= 0) return false;
  localStorage.setItem(CREDITS_KEY, String(current - 1));
  return true;
}

export function addCredits(amount: number): void {
  const current = getCredits();
  localStorage.setItem(CREDITS_KEY, String(current + amount));
}
