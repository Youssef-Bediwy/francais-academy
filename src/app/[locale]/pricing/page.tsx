import { Check } from 'lucide-react';
import { resolveLocale } from '@/lib/i18n/config';
import { getTranslator } from '@/lib/i18n/dictionaries';
import { routes } from '@/constants/routes';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/section-heading';

export default async function PricingPage({ params }: { params: { locale: string } }) {
  const locale = resolveLocale(params.locale);
  const t = await getTranslator(locale);

  const plans = [
    {
      name: t('pricing.freeName'),
      price: '0 EUR',
      features: ['pricing.free1', 'pricing.free2', 'pricing.free3'],
      highlighted: false,
    },
    {
      name: t('pricing.proName'),
      price: '9,90 EUR',
      features: ['pricing.pro1', 'pricing.pro2', 'pricing.pro3', 'pricing.pro4'],
      highlighted: true,
    },
    {
      name: t('pricing.teamName'),
      price: '29 EUR',
      features: ['pricing.team1', 'pricing.team2', 'pricing.team3'],
      highlighted: false,
    },
  ];

  return (
    <div className="container-page py-14">
      <SectionHeading
        eyebrow={t('pricing.eyebrow')}
        title={t('pricing.title')}
        description={t('pricing.subtitle')}
        align="center"
      />
      <div className="grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={plan.highlighted ? 'border-brand-400 p-6 shadow-lift' : 'p-6'}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{plan.name}</h2>
              {plan.highlighted ? <Badge variant="brand" size="sm">{t('pricing.popular')}</Badge> : null}
            </div>
            <p className="mt-4 font-display text-4xl font-bold">
              {plan.price}
              <span className="text-sm font-normal text-foreground-muted"> / {t('pricing.month')}</span>
            </p>
            <ul className="mt-6 space-y-2.5 text-sm">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" aria-hidden="true" />
                  {t(feature)}
                </li>
              ))}
            </ul>
            <ButtonLink
              href={routes.register(locale)}
              variant={plan.highlighted ? 'primary' : 'outline'}
              block
              className="mt-7"
            >
              {t('pricing.cta')}
            </ButtonLink>
          </Card>
        ))}
      </div>
    </div>
  );
}
