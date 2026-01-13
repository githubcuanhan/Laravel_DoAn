import jwt from 'jsonwebtoken';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { toast } from 'sonner';
import { UseFormSetError } from 'react-hook-form';
import { EntityError } from '@/lib/http';

export const decodeJWT = <PayLoad = Record<string, unknown>>(token: string) => {
  return jwt.decode(token) as PayLoad;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// xoá dấu / đầu tiên của path
export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path;
};

type ApiErrorPayload = {
  message?: string;
  errors?: { field: string; message: string }[];
};

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: unknown;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    Object.entries(error.payload.errors).forEach(([field, messages]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError(field as any, {
        type: 'server',
        message: messages[0],
      });
    });
    return;
  }

  const apiError = error as { payload?: ApiErrorPayload };
  toast.error({
    title: 'Error',
    description: apiError?.payload?.message || 'Something went wrong',
  });
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // 24h format
  });
};
