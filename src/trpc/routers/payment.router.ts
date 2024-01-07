import { TRPCError } from '@trpc/server';

import { PLANS } from '@/config/stripe';
import { db } from '@/db';
import { getUserSubscriptionPlan, stripe } from '@/lib/stripe';
import { absoluteUrl } from '@/lib/utils';

import { privateProcedure, router } from '../trpc';

export const paymentRouter = router({
  createStripeSession: privateProcedure.mutation(async ({ ctx }) => {
    const { userId } = ctx;

    const billingUrl = absoluteUrl('/dashboard/billing');

    if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED' });

    const dbUser = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!dbUser) throw new TRPCError({ code: 'UNAUTHORIZED' });

    const subscriptionPlan = await getUserSubscriptionPlan();

    if (subscriptionPlan.isSubscribed && dbUser.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: dbUser.stripeCustomerId,
        return_url: billingUrl,
      });

      return {
        url: stripeSession.url,
      };
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ['card', 'paypal'],
      mode: 'subscription',
      billing_address_collection: 'auto',
      line_items: [
        {
          price: PLANS.pro.price.priceIds.test,
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId,
      },
    });

    return { url: stripeSession.url };
  }),
});
