import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Check } from 'lucide-react';

const plans = [
  {
    id: 'free',
    price: 0,
    features: ['Basic tournament access', 'Join up to 2 teams', 'Community support'],
  },
  {
    id: 'pro',
    price: 9.99,
    features: ['All free features', 'Join unlimited teams', 'Create tournaments', 'Priority support', 'Advanced statistics'],
  },
  {
    id: 'premium',
    price: 19.99,
    features: ['All pro features', 'Custom branding', 'API access', 'Dedicated support', 'Early feature access'],
  },
];

export default function SubscriptionPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: subscriptions, loading, update } = useSupabaseData('subscriptions', { user_id: user?.id });
  const [updating, setUpdating] = useState(false);

  const currentSubscription = subscriptions?.[0];

  const handleUpgrade = async (planType: string) => {
    if (!user) {
      toast.error('Please sign in to upgrade');
      return;
    }

    setUpdating(true);
    try {
      if (currentSubscription) {
        await update(currentSubscription.id, {
          plan_type: planType,
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        });
      } else {
        // Create new subscription via Supabase
        const { error } = await supabase.from('subscriptions').insert({
          user_id: user.id,
          plan_type: planType,
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        });
        
        if (error) throw error;
      }
      
      toast.success(t('subscription.upgradeSuccess'));
    } catch (error) {
      toast.error('Failed to update subscription');
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = async () => {
    if (!currentSubscription) return;

    setUpdating(true);
    try {
      await update(currentSubscription.id, { status: 'canceled' });
      toast.success(t('subscription.cancelSuccess'));
    } catch (error) {
      toast.error('Failed to cancel subscription');
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">{t('common.loading')}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{t('subscription.title')}</h1>

      {currentSubscription && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('subscription.currentPlan')}</CardTitle>
            <CardDescription>
              {t(`subscription.${currentSubscription.plan_type}`)} - {t(`subscription.status`)}: {t(`subscription.${currentSubscription.status}`)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentSubscription.plan_type !== 'free' && currentSubscription.status === 'active' && (
              <Button variant="destructive" onClick={handleCancel} disabled={updating}>
                {t('subscription.cancel')}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.id} className={currentSubscription?.plan_type === plan.id ? 'border-primary' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t(`subscription.${plan.id}`)}</span>
                {currentSubscription?.plan_type === plan.id && (
                  <Badge variant="default">{t('subscription.active')}</Badge>
                )}
              </CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold">${plan.price}</span>
                {plan.price > 0 && <span className="text-muted-foreground">/{t('subscription.perMonth')}</span>}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                onClick={() => handleUpgrade(plan.id)}
                disabled={currentSubscription?.plan_type === plan.id || updating}
              >
                {currentSubscription?.plan_type === plan.id
                  ? t('subscription.active')
                  : t('subscription.selectPlan')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
