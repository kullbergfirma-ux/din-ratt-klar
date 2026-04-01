export type Tier = 'free' | 'bas' | 'komplett';

function key(caseId: string): string {
  return `tier_${caseId}`;
}

export function getTier(caseId: string): Tier {
  return (localStorage.getItem(key(caseId)) as Tier) || 'free';
}

export function setTier(caseId: string, tier: Tier): void {
  localStorage.setItem(key(caseId), tier);
}

export function generateCaseId(): string {
  return `case_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
