import { ArrowRight, Check, HelpCircle, Minus } from 'lucide-react';
import Link from 'next/link';

import MaxWidthWrapper from '@/components/layout/MaxWidthWrapper.component';
import { buttonVariants } from '@/components/ui/Button.component';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/Tooltip.component';
import UpgradeButton from '@/components/UpgradeButton.component';
import { PRICING_ITEMS } from '@/config/stripe';
import { cn } from '@/lib/utils';
import { getLoddedInUser } from '@/queries/user.query';

const PricingPage = async () => {
  const { user } = await getLoddedInUser();

  return (
    <>
      <MaxWidthWrapper className='mb-8 mt-24 text-center max-w-5xl'>
        <div className='mx-auto mb-10 sm:max-w-lg'>
          <h1 className='text-6xl font-bold sm:text-7xl'>Pricing</h1>
          <p className='mt-5 text-gray-600 sm:text-lg'>
            Whether you&apos;re just trying out our service or need more,
            we&apos;ve got your covered.
          </p>
        </div>

        <div className='pt-12 grid grid-cols-1 gap-10 lg:grid-cols-2'>
          <TooltipProvider>
            {PRICING_ITEMS.map((item) => (
              <div
                key={item.plan}
                className={cn('relative rounded-2xl bg-white shadow-lg', {
                  'border-2 border-blue-600 shadow-blue-200':
                    item.plan === 'Pro',
                  'border border-gray-200': item.plan !== 'Pro',
                })}
              >
                {item.plan === 'Pro' && (
                  <div className='absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-2 text-sm font-medium text-white'>
                    Upgrade now
                  </div>
                )}

                <div className='p-5'>
                  <h3 className='my-3 text-center font-display text-3xl font-bold'>
                    {item.plan}
                  </h3>
                  <p className='text-gray-500'>{item.tagline}</p>
                  <p className='my-5 font-display text-6xl font-semibold'>
                    £{item.price}
                  </p>
                  <p className='text-gray-500'>per month</p>
                </div>
                <div className='flex h-20 items-center justify-center border-b border-t border-gray-200 bg-gray-50'>
                  <div className='flex items-center space-x-1'>
                    <p>{item.quota.toLocaleString()} PDFs a month included</p>

                    <Tooltip delayDuration={300}>
                      <TooltipTrigger className='cursor-default ml-1.5'>
                        <HelpCircle className='h-4 w-4 text-zinc-500' />
                      </TooltipTrigger>
                      <TooltipContent className='w-80 p-2'>
                        How many PDFs you can upload per month.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                <ul className='my-10 space-y-5 px-8'>
                  {item.features.map(({ text, footnote, negative }) => (
                    <li key={text} className='flex space-x-5'>
                      <div className='flex-shrink-0'>
                        {negative ? (
                          <Minus className='h-6 w-6 text-gray-300' />
                        ) : (
                          <Check className='h-6 w-6 text-blue-500' />
                        )}
                      </div>
                      {footnote ? (
                        <div className='flex items-center space-x-1'>
                          <p
                            className={cn('text-gray-400', {
                              'text-gray-600': negative,
                            })}
                          >
                            {text}
                          </p>
                          <Tooltip delayDuration={300}>
                            <TooltipTrigger className='cursor-default ml-1.5'>
                              <HelpCircle className='h-4 w-4 text-zinc-500' />
                            </TooltipTrigger>
                            <TooltipContent className='w-80 p-2'>
                              {footnote}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      ) : (
                        <p
                          className={cn('text-gray-400', {
                            'text-gray-600': negative,
                          })}
                        >
                          {text}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
                <div className='broder-t border-gray-200' />
                <div className='p-5'>
                  {item.plan === 'Free' ? (
                    <Link
                      href={user ? '/dashboard' : '/sign-in'}
                      className={cn(
                        buttonVariants({
                          className: 'w-full',
                          variant: 'secondary',
                        }),
                      )}
                    >
                      {user ? 'Upgrade now' : 'Sign up'}
                      <ArrowRight
                        className='cl
                  h-5 w-5 ml-1.5'
                      />
                    </Link>
                  ) : user ? (
                    <UpgradeButton />
                  ) : (
                    <Link
                      href='/sign-in'
                      className={cn(buttonVariants({ className: 'w-full' }))}
                    >
                      {user ? 'Upgrade now' : 'Sign up'}
                      <ArrowRight
                        className='cl
                    h-5 w-5 ml-1.5'
                      />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </TooltipProvider>
        </div>
      </MaxWidthWrapper>
    </>
  );
};

export default PricingPage;
