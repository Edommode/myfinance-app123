drop policy if exists "Users create their own coaching requests"
on public.coaching_requests;

create policy "Coaching Plus users create their own coaching requests"
on public.coaching_requests
for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and exists (
    select 1
    from public.user_subscriptions subscription
    where subscription.user_id = (select auth.uid())
      and subscription.plan = 'coaching_plus'
      and subscription.status in ('active', 'trialing')
      and (
        subscription.current_period_end is null
        or subscription.current_period_end > now()
      )
  )
);
