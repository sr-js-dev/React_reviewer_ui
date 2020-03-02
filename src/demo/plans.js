export default [
  {
    id: 1,
    name: 'Free',
    plan_type: 'free',
    amountMonthly: '0.0',
    amountAnnually: '0.0',
    allowed_products: 3,
    active: true,
    can_select: true,
    can_view: true,
    features: [
      {
        body: 'Review Analytics',
      },
      {
        body: 'Weekly Report',
      },
      {
        body: 'Respond to Reviews',
      },
      {
        body: 'Alerts/Notifications',
        disabled: true,
      },
      {
        body: 'Comment Tracking',
        disabled: true,
      },
      {
        body: 'API Access',
        disabled: true,
      },
    ],
  },
  {
    id: 2,
    name: 'Basic',
    plan_type: 'basic',
    amountMonthly: '29.95',
    amountAnnually: '24.95',
    allowed_products: 25,
    active: true,
    can_select: true,
    can_view: true,
    features: [
      {
        body: 'Review Analytics',
      },
      {
        body: 'Weekly Report',
      },
      {
        body: 'Respond to Reviews',
      },
      {
        body: 'Alerts/Notifications',
      },
      {
        body: 'Comment Tracking',
      },
      {
        body: 'API Access',
        disabled: true,
      },
    ],
  },
  {
    id: 3,
    name: 'Advanced',
    plan_type: 'advanced',
    amountMonthly: '39.95',
    amountAnnually: '32.95',
    allowed_products: 100,
    active: true,
    can_select: true,
    can_view: true,
    features: [
      {
        body: 'Review Analytics',
      },
      {
        body: 'Weekly Report',
      },
      {
        body: 'Respond to Reviews',
      },
      {
        body: 'Alerts/Notifications',
      },
      {
        body: 'Comment Tracking',
      },
      {
        body: 'API Access',
        disabled: true,
      },
    ],
  },
  {
    id: 3,
    name: 'Pro',
    plan_type: 'pro',
    amountMonthly: '79.95',
    amountAnnually: '72.95',
    allowed_products: 250,
    active: true,
    can_select: true,
    can_view: true,
    features: [
      {
        body: 'Review Analytics',
      },
      {
        body: 'Weekly Report',
      },
      {
        body: 'Respond to Reviews',
      },
      {
        body: 'Alerts/Notifications',
      },
      {
        body: 'Comment Tracking',
      },
      {
        body: 'API Access',
        disabled: true,
      },
    ],
  },
  {
    id: 4,
    name: 'Enterprise',
    plan_type: 'enterprise',
    amountMonthly: '10000.0',
    amountAnnually: '10000.0',
    allowed_products: 'unlimited',
    active: true,
    can_select: false,
    can_view: true,
    features: [
      {
        body: 'Review Analytics',
      },
      {
        body: 'Weekly Report',
      },
      {
        body: 'Respond to Reviews',
      },
      {
        body: 'Alerts/Notifications',
      },
      {
        body: 'Comment Tracking',
      },
      {
        body: 'API Access',
      },
    ],
  },
];
