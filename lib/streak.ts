function localKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function completionStreak(isoTimestamps: string[], today = new Date()): number {
  const days = new Set<string>();
  for (const value of isoTimestamps) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) days.add(localKey(date));
  }
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (!days.has(localKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(localKey(cursor))) return 0;
  }
  let count = 0;
  while (days.has(localKey(cursor))) {
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}
