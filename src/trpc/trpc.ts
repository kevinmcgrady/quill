import { initTRPC, TRPCError } from '@trpc/server';

import { getLoddedInUser } from '@/queries/user.query';

const t = initTRPC.create();
const middleware = t.middleware;

export const isAuth = middleware(async (opts) => {
  const { user } = await getLoddedInUser();

  if (!user || !user.id) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return opts.next({
    ctx: {
      userId: user.id,
      user,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
