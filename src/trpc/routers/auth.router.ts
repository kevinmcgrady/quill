import { TRPCError } from '@trpc/server';

import { db } from '@/db';
import { getLoddedInUser } from '@/queries/user.query';

import { publicProcedure, router } from '../trpc';

export const authRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { user } = await getLoddedInUser();

    if (!user || !user.email || !user.id) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });

    if (!dbUser) {
      await db.user.create({
        data: {
          id: user.id,
          email: user.email,
        },
      });
    }

    return { success: true };
  }),
});
