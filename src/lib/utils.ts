import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

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
    console.log('isURL: not a url');
    return false;
  }
}

export function getFaviconURL(url: string) {
  try {
    const { host } = new URL(url);
    const faviconURL = `https://api.faviconkit.com/${host}/144`;
    return faviconURL;
  } catch (error) {
    console.error('getFaviconURL: error', error);
    return '';
  }
}

export function getTitleFromURL(url: string) {
  const { host } = new URL(url);
  // without subdomain
  // const title = host.split('.').slice(-2).join('.');
  // without tld
  const title = host.split('.').slice(-2)[0];
  return capitalize(title);
}

export function prettyURL(url: string) {
  try {
    const { host } = new URL(url);
    return host;
  } catch (error) {
    console.error('prettyURL: error', error);
    return url;
  }
}
