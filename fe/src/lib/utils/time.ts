function parseServerDate(dateStr: string) {
  if (dateStr.endsWith('Z')) {
    return new Date(dateStr.replace('Z', ''));
  }
  return new Date(dateStr);
}

export function timeAgo(date: string | number | Date) {
  const d = typeof date === 'string' ? parseServerDate(date) : new Date(date);
  const now = new Date();
  let diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 0) diffInSeconds = 0;

  const diffInDays = diffInSeconds / (60 * 60 * 24);

  if (diffInDays >= 30) {
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['week', 60 * 60 * 24 * 7],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
    ['second', 1],
  ];

  for (const [unit, secondsInUnit] of units) {
    const relative = Math.floor(diffInSeconds / secondsInUnit);
    if (relative >= 1) {
      return new Intl.RelativeTimeFormat('vi', { numeric: 'auto' }).format(
        -relative,
        unit
      );
    }
  }

  return 'vừa xong';
}
