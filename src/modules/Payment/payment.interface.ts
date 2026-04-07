// payment.interface.ts

export type TCreateCheckoutSession = {
  mediaId?: string;           // এটা অপশনাল (?) কারণ সাবস্ক্রিপশনে মিডিয়া আইডি থাকবে না
  subscriptionPlan?: 'FREE' | 'PREMIUM' | 'FAMILY'; // এই লাইনটা যোগ করুন
};