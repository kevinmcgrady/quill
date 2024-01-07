import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs/server';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import MaxWidthWrapper from '@/components/layout/MaxWidthWrapper.component';
import { buttonVariants } from '@/components/ui/Button.component';
import { getLoddedInUser } from '@/queries/user.query';

import Icons from '../Icons.component';
import UserAccountNav from '../UserAccountNav.component';
import MobileNavbar from './MobileNavbar.component';

const Navbar = async () => {
  const { user } = await getLoddedInUser();

  const formatUserName = () => {
    if (!user || !user.given_name || !user.family_name) {
      return 'Your Account';
    }

    return `${user.given_name} ${user.family_name}`;
  };

  return (
    <nav className='sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all'>
      <MaxWidthWrapper>
        <div className='flex h-14 items-center justify-between border-b border-zinc-200'>
          <div className='flex items-center'>
            <Icons.logo className='fill-zinc-800 w-7 h-7 rounded-sm mr-3' />
            <Link href='/' className='flex z-40 font-semibold'>
              Quill.
            </Link>
          </div>

          <MobileNavbar isAuth={!!user} />
          <div className='hidden items-center space-x-4 sm:flex'>
            {!user && (
              <>
                <Link
                  href='/pricing'
                  className={buttonVariants({ variant: 'ghost', size: 'sm' })}
                >
                  Pricing
                </Link>
                <LoginLink
                  className={buttonVariants({ variant: 'ghost', size: 'sm' })}
                >
                  Sign in
                </LoginLink>
                <RegisterLink className={buttonVariants({ size: 'sm' })}>
                  Get started <ArrowRight className='ml-1.5 h-5 w-5' />
                </RegisterLink>
              </>
            )}
            {user && (
              <>
                <Link
                  href='/dashboard'
                  className={buttonVariants({ variant: 'ghost', size: 'sm' })}
                >
                  Dashboard
                </Link>
                <UserAccountNav
                  email={user.email ?? ''}
                  imageUrl={user.picture ?? ''}
                  name={formatUserName()}
                />
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
