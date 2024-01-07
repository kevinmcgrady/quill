import { redirect } from 'next/navigation';

import Dashboard from '@/components/Dashboard.component';
import { db } from '@/db';
import { getUserSubscriptionPlan } from '@/lib/stripe';
import { getLoddedInUser } from '@/queries/user.query';

export default async function DashboardPage() {
  const { user } = await getLoddedInUser();

  if (!user || !user.id) redirect('/auth-callback?origin=dashboard');

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) redirect('/auth-callback?origin=dashboard');

  const subscriptionPlan = await getUserSubscriptionPlan();

  return <Dashboard subscriptionPlan={subscriptionPlan} />;
}
