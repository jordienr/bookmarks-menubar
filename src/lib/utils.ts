import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createId() {
  return crypto.randomUUID();
}

export function isURL(str: string) {
  try {
    const _ = new URL(str);
    return true;
  } catch {
    return false;
  }
}

export function getFaviconURL(url: string) {
  const { host } = new URL(url);
  const faviconURL = `https://api.faviconkit.com/${host}/144`;
  console.log(faviconURL);
  return faviconURL;
}
