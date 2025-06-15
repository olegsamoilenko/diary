import type { User } from "@/types/user";

export type UserTokenUsage = {
  id: number;
  user: User;
  usedTokens: number;
  tokenLimit: number;
  periodStart: Date;
  periodEnd: Date;
  updatedAt: Date;
};

export type TokenUsageHistory = {
  id: number;
  user: User;
  tokensUsed: number;
  createdAt: Date;
};
