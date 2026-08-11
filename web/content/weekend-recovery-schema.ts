/* The Offer nodes mirror the prices printed on the page, which are transcribed
   from the clinic's launch sheets in site/assets/img/promo/. A price change has to
   be made in both the visible markup and here, or the structured data drifts. */

export const WEEKEND_RECOVERY_EXTRA_SCHEMA = [
  {
    "@type": "Service",
    "@id": "https://bodyforgept.com/weekend-recovery/#offers",
    "name": "Recovery Program",
    "serviceType": "Recovery and manual therapy session",
    "provider": {
      "@id": "https://bodyforgept.com/#clinic"
    },
    "areaServed": {
      "@type": "City",
      "name": "Miami"
    },
    "hoursAvailable": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "07:00",
        "closes": "14:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Sunday",
        "opens": "13:00",
        "closes": "19:00"
      }
    ],
    "offers": [
      {
        "@type": "Offer",
        "name": "Founding member first session",
        "price": "49",
        "priceCurrency": "USD",
        "description": "First session for new clients during the founding member launch. Limited to the first 25 members."
      },
      {
        "@type": "Offer",
        "name": "Founding membership",
        "price": "169",
        "priceCurrency": "USD",
        "description": "Founding monthly rate, locked for 12 months."
      },
      {
        "@type": "Offer",
        "name": "Single session",
        "price": "85",
        "priceCurrency": "USD"
      },
      {
        "@type": "Offer",
        "name": "Eight session pack",
        "price": "600",
        "priceCurrency": "USD"
      },
      {
        "@type": "Offer",
        "name": "Membership",
        "price": "199",
        "priceCurrency": "USD",
        "description": "Four sessions a month."
      },
      {
        "@type": "Offer",
        "name": "Performance membership",
        "price": "349",
        "priceCurrency": "USD",
        "description": "Eight sessions a month."
      },
      {
        "@type": "Offer",
        "name": "First responder single visit",
        "price": "70",
        "priceCurrency": "USD",
        "eligibleCustomerType": "First responders"
      },
      {
        "@type": "Offer",
        "name": "First responder four-visit pack",
        "price": "240",
        "priceCurrency": "USD",
        "eligibleCustomerType": "First responders"
      },
      {
        "@type": "Offer",
        "name": "First responder monthly membership",
        "price": "160",
        "priceCurrency": "USD",
        "eligibleCustomerType": "First responders"
      },
      {
        "@type": "Offer",
        "name": "First responder performance membership",
        "price": "280",
        "priceCurrency": "USD",
        "eligibleCustomerType": "First responders"
      }
    ]
  },
  {
    "@type": "FAQPage",
    "@id": "https://bodyforgept.com/weekend-recovery/#faq",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What happens in a BodyForge recovery session?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A thirty-minute session built from manual massage, assisted stretching, joint mobilization, cupping, Theragun percussive therapy and Normatec compression boots, using whichever of those your body needs that day."
        }
      },
      {
        "@type": "Question",
        "name": "How much does the Recovery Program cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A single session is $85, an eight-session pack is $600, membership is $199 a month for four sessions and performance membership is $349 a month for eight. During the founding member launch the first session is $49 for new clients and founding membership is $169 a month locked for twelve months, limited to the first 25 members."
        }
      },
      {
        "@type": "Question",
        "name": "Is there a first responder discount?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Police, fire, EMS and paramedics, 911 dispatch and corrections all qualify. A single visit is $70, a four-visit pack is $240, monthly membership is $160 and performance membership is $280. Show a valid first-responder ID when you book or check in."
        }
      },
      {
        "@type": "Question",
        "name": "When is the Recovery Program open?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Saturday 7am to 2pm and Sunday 1pm to 7pm, by appointment. Physical therapy runs Monday to Friday."
        }
      }
    ]
  }
] as const;
