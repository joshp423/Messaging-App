import type { messageSolo } from "./messageSolo";

interface conversation {
  id: number;
  userA: number;
  userB: number;
  messages: messageSolo[];
}

export type { conversation };
