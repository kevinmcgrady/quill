import { inferRouterOutputs } from '@trpc/server';
import { JSX } from 'react';

import { AppRouter } from '@/trpc';

type RouterOutput = inferRouterOutputs<AppRouter>;

type Messages = RouterOutput['message']['getFileMessages']['messages'];

type OmitText = Omit<Messages[number], 'text'>;

type ExtendedText = {
  text: string | JSX.Element;
};

export type ExtendedMessage = OmitText & ExtendedText;
