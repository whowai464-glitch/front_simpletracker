import type { AxiosError } from 'axios';

export function getErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<{ detail?: string | Array<{ msg: string }> }>;
  const detail = axiosError.response?.data?.detail;
  if (!detail) return 'Ocorreu um erro inesperado';
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) return detail.map((d) => d.msg).join('; ');
  return 'Ocorreu um erro inesperado';
}
