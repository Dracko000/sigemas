export const cx = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(' ');

export const initials = (name: string) =>
  name
    .replace(/,.*$/, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

const AVATAR_COLORS = [
  ['#1E88E5', '#0D47A1'],
  ['#FF9800', '#E65100'],
  ['#16A34A', '#166534'],
  ['#8E24AA', '#4A148C'],
  ['#00ACC1', '#006064'],
  ['#3949AB', '#1A237E'],
  ['#D81B60', '#880E4F'],
  ['#00897B', '#004D40'],
];

export const avatarGradient = (seed: string) => {
  const index = [...seed].reduce((sum, c) => sum + c.charCodeAt(0), 0) % AVATAR_COLORS.length;
  const [from, to] = AVATAR_COLORS[index];
  return `linear-gradient(135deg, ${from}, ${to})`;
};

export const formatDate = (value?: string, options?: Intl.DateTimeFormatOptions) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(
    'id-ID',
    options ?? { day: 'numeric', month: 'short', year: 'numeric' }
  );
};

export const formatDateShort = (value?: string) =>
  formatDate(value, { day: 'numeric', month: 'short' });

export const formatTime = (value?: string) => {
  if (!value) return '—';
  return new Date(value).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

export const formatDateTime = (value?: string) =>
  value ? `${formatDateShort(value)} · ${formatTime(value)}` : '—';

export const relativeDate = (value?: string) => {
  if (!value) return '—';
  const diff = new Date(value).getTime() - Date.now();
  const days = Math.round(diff / 86400000);
  const rtf = new Intl.RelativeTimeFormat('id-ID', { numeric: 'auto' });
  if (Math.abs(days) >= 1) return rtf.format(days, 'day');
  const hours = Math.round(diff / 3600000);
  if (Math.abs(hours) >= 1) return rtf.format(hours, 'hour');
  return rtf.format(Math.round(diff / 60000), 'minute');
};

export const deadlineLabel = (value?: string) => {
  if (!value) return '—';
  const diff = new Date(value).getTime() - Date.now();
  const days = Math.ceil(diff / 86400000);
  if (diff < 0) return 'Lewat tenggat';
  if (days <= 1) return 'Kurang dari 1 hari';
  return `${days} hari lagi`;
};

export const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 11) return 'Selamat pagi';
  if (hour < 15) return 'Selamat siang';
  if (hour < 18) return 'Selamat sore';
  return 'Selamat malam';
};

export const roleLabel: Record<string, string> = {
  student: 'Siswa',
  teacher: 'Pengajar',
  parent: 'Orang Tua',
  admin: 'Administrator',
};

export const downloadCsv = (filename: string, rows: (string | number)[][]) => {
  const csv = rows
    .map((row) =>
      row
        .map((cell) => {
          const text = String(cell ?? '').replace(/"/g, '""');
          return /[",\n;]/.test(text) ? `"${text}"` : text;
        })
        .join(';')
    )
    .join('\n');
  const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

export const clamp = (value: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, value));

export const progressTone = (value: number) => {
  if (value >= 85) return 'success';
  if (value >= 70) return 'primary';
  if (value >= 60) return 'warning';
  return 'danger';
};
