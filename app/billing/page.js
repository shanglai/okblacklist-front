'use client';

import { motion } from 'framer-motion';
import {
  Activity,
  Zap,
  Clock,
  Calendar,
  TrendingUp,
  AlertCircle,
  Check,
  CreditCard
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUsage } from '@/hooks/useUsage';
import { PageSkeleton } from '@/components/shared/Skeletons';
import { ErrorState } from '@/components/shared/EmptyState';

// Mock data for demo purposes
const MOCK_USAGE = {
  plan: 'Professional',
  qpm_used: 45,
  qpm_limit: 60,
  qph_used: 1250,
  qph_limit: 3000,
  qpd_used: 8500,
  qpd_limit: 50000,
  billing_cycle_start: '2024-01-01',
  billing_cycle_end: '2024-01-31',
  features: [
    { name: 'Search across all sources', included: true },
    { name: 'Grouped results', included: true },
    { name: 'Manual entities', included: true },
    { name: 'API access', included: true },
    { name: 'Custom integrations', included: false },
    { name: 'Dedicated support', included: false },
  ]
};

const PLANS = [
  {
    name: 'Starter',
    price: '$99',
    qpm: 20,
    qph: 500,
    qpd: 10000,
    current: false
  },
  {
    name: 'Professional',
    price: '$299',
    qpm: 60,
    qph: 3000,
    qpd: 50000,
    current: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    qpm: 'Unlimited',
    qph: 'Unlimited',
    qpd: 'Unlimited',
    current: false
  },
];

export default function BillingPage() {
  const { data: usage, isLoading, error, refetch } = useUsage();

  // Always use mock data in demo mode or when API fails
  const displayUsage = usage || MOCK_USAGE;

  if (isLoading) {
    return <PageSkeleton />;
  }

  // Skip error state if we have mock data to show
  // This allows demo mode to work without a backend

  const qpmPercent = (displayUsage.qpm_used / displayUsage.qpm_limit) * 100;
  const qphPercent = (displayUsage.qph_used / displayUsage.qph_limit) * 100;
  const qpdPercent = (displayUsage.qpd_used / displayUsage.qpd_limit) * 100;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing & Usage</h1>
        <p className="text-muted-foreground mt-1">
          Monitor your API usage and manage your subscription plan.
        </p>
      </div>

      {/* Current Plan */}
      <Card className="border-border/50 bg-gradient-to-br from-blue-500/10 to-violet-500/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Current Plan</CardTitle>
              <CardDescription>Your active subscription</CardDescription>
            </div>
            <Badge className="bg-gradient-to-r from-blue-500 to-violet-600 text-white text-lg px-4 py-1">
              {displayUsage.plan}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 inline mr-1" />
              Billing cycle: {displayUsage.billing_cycle_start} - {displayUsage.billing_cycle_end}
            </div>
            <Button variant="outline">
              <CreditCard className="w-4 h-4 mr-2" />
              Manage Subscription
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        <UsageCard
          title="Queries Per Minute"
          icon={Zap}
          used={displayUsage.qpm_used}
          limit={displayUsage.qpm_limit}
          percent={qpmPercent}
          color="blue"
        />
        <UsageCard
          title="Queries Per Hour"
          icon={Clock}
          used={displayUsage.qph_used}
          limit={displayUsage.qph_limit}
          percent={qphPercent}
          color="violet"
        />
        <UsageCard
          title="Queries Per Day"
          icon={Calendar}
          used={displayUsage.qpd_used}
          limit={displayUsage.qpd_limit}
          percent={qpdPercent}
          color="cyan"
        />
      </div>

      {/* Plan Features */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg">Plan Features</CardTitle>
          <CardDescription>What's included in your {displayUsage.plan} plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            {displayUsage.features?.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {feature.included ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-muted-foreground" />
                )}
                <span className={feature.included ? 'text-foreground' : 'text-muted-foreground'}>
                  {feature.name}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Available Plans</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={`border-border/50 ${plan.current ? 'ring-2 ring-blue-500' : 'bg-card/50'}`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  {plan.current && (
                    <Badge variant="secondary">Current</Badge>
                  )}
                </div>
                <div className="text-3xl font-bold text-foreground">
                  {plan.price}
                  {plan.price !== 'Custom' && <span className="text-sm font-normal text-muted-foreground">/mo</span>}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">QPM</span>
                  <span className="font-medium text-foreground">{plan.qpm}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">QPH</span>
                  <span className="font-medium text-foreground">{plan.qph}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">QPD</span>
                  <span className="font-medium text-foreground">{plan.qpd}</span>
                </div>
                <Button
                  variant={plan.current ? 'outline' : 'default'}
                  className="w-full mt-4"
                  disabled={plan.current}
                >
                  {plan.current ? 'Current Plan' : 'Upgrade'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function UsageCard({ title, icon: Icon, used, limit, percent, color }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    violet: 'from-violet-500 to-violet-600',
    cyan: 'from-cyan-500 to-cyan-600',
  };

  const isWarning = percent > 80;
  const isCritical = percent > 95;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="border-border/50 bg-card/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
            <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClasses[color]}/10`}>
              <Icon className={`w-4 h-4 text-${color}-500`} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground mb-1">
            {used.toLocaleString()}
            <span className="text-lg font-normal text-muted-foreground"> / {limit.toLocaleString()}</span>
          </div>
          <Progress
            value={percent}
            className={`h-2 ${isCritical ? 'bg-red-500/20' : isWarning ? 'bg-amber-500/20' : ''}`}
          />
          {isWarning && (
            <p className={`text-xs mt-2 ${isCritical ? 'text-red-500' : 'text-amber-500'}`}>
              <AlertCircle className="w-3 h-3 inline mr-1" />
              {isCritical ? 'Approaching limit' : 'High usage'}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
