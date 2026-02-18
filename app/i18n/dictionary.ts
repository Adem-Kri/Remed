export type Dictionary = {
  hero: {
    trustLine: string;
    title: string;
    subtitle: string;
    bullets: string[];
    offer: string;
    cta: string;
  };
  sections: {
    whyDangerous: {
      title: string;
      body: string[];
      bullets: string[];
      footer: string;
    };
    whoFor: {
      title: string;
      body: string[];
    };
    withMeds: {
      title: string;
      body: string[];
      bullets: string[];
      footer: string;
    };
    ingredients: {
      title: string;
      bullets: string[];
    };
    usage: {
      title: string;
      body: string[];
    };
    expectedResults: {
      title: string;
      bullets: string[];
    };
    guarantee: {
      title: string;
      body: string[];
      cta: string;
    };
    faq: {
      title: string;
      items: Array<{ q: string; a: string }>;
    };
    finalCta: {
      title: string;
      body: string;
      cta: string;
    };
    microCopy: {
      items: string[];
    };
  };
  order: {
    title: string;
    subtitle: string;
    fields: {
      name: string;
      phone: string;
      address: string;
      notes: string;
      pack: string;
    };
    submit: string;
    submitting: string;
    successTitle: string;
    successBody: string;
    errorGeneric: string;
    fullDetailsNote: string;
  };
  ui: {
    buyNow: string;
    close: string;
    language: string;
  };
};
