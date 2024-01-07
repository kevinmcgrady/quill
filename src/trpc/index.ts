import { authRouter } from './routers/auth.router';
import { fileRouter } from './routers/file.router';
import { messageRouter } from './routers/message.router';
import { paymentRouter } from './routers/payment.router';
import { router } from './trpc';

export const appRouter = router({
  auth: authRouter,
  payment: paymentRouter,
  file: fileRouter,
  message: messageRouter,
});

export type AppRouter = typeof appRouter;
