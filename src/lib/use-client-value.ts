"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * Reads a browser-only value (e.g. today's date) without baking it into prerendered HTML.
 * The server snapshot is used while prerendering/hydrating; the client value afterwards.
 */
export function useClientValue<T>(getClient: () => T, serverValue: T): T {
  return useSyncExternalStore(noopSubscribe, getClient, () => serverValue);
}
