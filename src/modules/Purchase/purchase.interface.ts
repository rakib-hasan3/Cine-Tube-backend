import { PurchaseType } from '../../../generated/prisma/client';

export interface IPurchase {
  mediaId: string;
  type: PurchaseType;
  expiresAt?: Date;
  subscriptionPlan?: string; // e.g., 'MONTHLY' or 'YEARLY'
}
