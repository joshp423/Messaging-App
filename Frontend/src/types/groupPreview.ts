// import type { messageSolo } from "./messageSolo";
import type { messageGroup } from "./messageGroup";

interface groupPreview {
  id: number;
  name: string;
  messages: messageGroup [];
}

export type { groupPreview };
