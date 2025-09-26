'use client';

export async function checkOnlineStatus() {
  if (!window.navigator.onLine) return false;

  try {
    const res = await fetch("/api/ping", { cache: "no-store" });
    return res.ok; // true if server reachable
  } catch {
    return false;
  }
}
