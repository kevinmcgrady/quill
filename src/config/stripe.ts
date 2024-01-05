export const PLANS = {
  free: {
    name: 'Free',
    slug: 'free',
    quota: 10,
    pagesPerPdf: 5,
    price: {
      amount: 0,
      priceIds: {
        test: '',
        production: '',
      },
    },
  },
  pro: {
    name: 'Pro',
    slug: 'pro',
    quota: 50,
    pagesPerPdf: 20,
    price: {
      amount: 14,
      priceIds: {
        test: 'price_1OVDaeGPOBqpgvtEC0aafsIF',
        production: '',
      },
    },
  },
};

export const PRICING_ITEMS = [
  {
    plan: 'Free',
    tagline: 'For small side projects.',
    quota: PLANS.free.quota,
    price: PLANS.free.price.amount,
    features: [
      {
        text: '5 pages per PDF',
        footnote: 'The maximum amount of pages per PDF-file.',
      },
      {
        text: '4MB file size limit',
        footnote: 'The maximum file size of a single PDF file.',
      },
      {
        text: 'Mobile-friendly interface',
      },
      {
        text: 'Higher-quality responses',
        footnote: 'Better algorithmic responses for enhanced content quality',
        negative: true,
      },
      {
        text: 'Priority support',
        negative: true,
      },
    ],
  },
  {
    plan: 'Pro',
    tagline: 'For larger projects with higher needs.',
    price: PLANS.pro.price.amount,
    quota: PLANS.pro.quota,
    features: [
      {
        text: '25 pages per PDF',
        footnote: 'The maximum amount of pages per PDF-file.',
      },
      {
        text: '16MB file size limit',
        footnote: 'The maximum file size of a single PDF file.',
      },
      {
        text: 'Mobile-friendly interface',
      },
      {
        text: 'Higher-quality responses',
        footnote: 'Better algorithmic responses for enhanced content quality',
      },
      {
        text: 'Priority support',
      },
    ],
  },
];
