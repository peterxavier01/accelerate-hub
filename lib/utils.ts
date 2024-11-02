import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formateDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  })
}
export function pluralizeWord(text: string, value: number): string {
  return value > 1 ? text.concat("s") : text
}

export function parseServerActionResponse<T>(response: T) {
  return JSON.parse(JSON.stringify(response))
}