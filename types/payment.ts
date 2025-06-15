import type { User } from "@/types/user";
import type { Plan } from "@/types/plan";

export type Payment = {
  id: string;
  user: User;
  amount: number;
  currency: string;
  plan: Plan;
  provider: string;
  createdAt: Date;
};
