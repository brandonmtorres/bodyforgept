/* The structured data graph, carried over from the static build. Asset URLs are
   rewritten to /media/, which is where public/ serves them from.

   The Offer nodes mirror the prices printed on /weekend-recovery/. A price change
   has to be made in both places or the structured data drifts from the page.
   Opening hours must stay in step with lib/hours.ts. */

export const HOME_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": [
        "MedicalBusiness",
        "PhysicalTherapy"
      ],
      "@id": "https://bodyforgept.com/#clinic",
      "name": "BodyForge Physical Therapy",
      "slogan": "Build Stronger. Live Better.",
      "url": "https://bodyforgept.com/",
      "image": "https://bodyforgept.com/media/og.jpg",
      "logo": "https://bodyforgept.com/media/mark-dark.png",
      "telephone": "+1-305-456-1004",
      "email": "info@bodyforgept.com",
      "priceRange": "$$",
      "currenciesAccepted": "USD",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "3600 West Flagler Street",
        "addressLocality": "Miami",
        "addressRegion": "FL",
        "postalCode": "33135",
        "addressCountry": "US"
      },
      "areaServed": [
        {
          "@type": "City",
          "name": "Miami"
        },
        {
          "@type": "City",
          "name": "Coral Gables"
        },
        {
          "@type": "City",
          "name": "South Miami"
        },
        {
          "@type": "City",
          "name": "Little Havana"
        }
      ],
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Wednesday",
            "Friday"
          ],
          "opens": "07:00",
          "closes": "16:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Tuesday",
            "Thursday"
          ],
          "opens": "10:00",
          "closes": "19:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "Saturday",
          "opens": "07:00",
          "closes": "14:00",
          "description": "Recovery sessions by appointment"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "Sunday",
          "opens": "13:00",
          "closes": "19:00",
          "description": "Recovery sessions by appointment"
        }
      ],
      "sameAs": [
        "https://www.instagram.com/bodyforge_physical_therapy/"
      ],
      "founder": {
        "@id": "https://bodyforgept.com/#david"
      },
      "employee": {
        "@id": "https://bodyforgept.com/#david"
      },
      "availableService": [
        {
          "@type": "MedicalTherapy",
          "name": "Personalized Physical Therapy",
          "description": "One-on-one evaluation and treatment with a licensed clinician, including manual therapy, exercise programming and outcome tracking."
        },
        {
          "@type": "MedicalTherapy",
          "name": "Strength and Conditioning",
          "description": "One-on-one personal training, asynchronous programming, and prehab screening with a strength and conditioning specialist."
        },
        {
          "@type": "MedicalTherapy",
          "name": "Sport-Specific Rehabilitation",
          "description": "Evidence-based return-to-sport testing and rehabilitation for field, water, court and combat sport athletes."
        },
        {
          "@type": "MedicalTherapy",
          "name": "One-on-One Pilates",
          "description": "Private Pilates instruction with a Polestar-educated instructor and Doctor of Physical Therapy on mat, reformer, trapeze and spine corrector."
        },
        {
          "@id": "https://bodyforgept.com/#recovery"
        }
      ]
    },
    {
      "@type": "Service",
      "@id": "https://bodyforgept.com/#recovery",
      "name": "Recovery Program",
      "serviceType": "Recovery and manual therapy session",
      "description": "A 30-minute recovery session delivered by the clinical team at BodyForge Physical Therapy: manual massage, assisted stretching, joint mobilization, cupping, Theragun percussive therapy and Normatec compression boots. Weekends by appointment.",
      "url": "https://bodyforgept.com/#recovery",
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
          "name": "Founding member monthly",
          "price": "169",
          "priceCurrency": "USD",
          "description": "Founding monthly rate, locked for 12 months. Limited to the first 25 members."
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
          "name": "Monthly membership",
          "price": "199",
          "priceCurrency": "USD"
        }
      ]
    },
    {
      "@type": "Physician",
      "@id": "https://bodyforgept.com/#david",
      "name": "Dr. David Perez-Espinosa, PT, DPT",
      "honorificPrefix": "Dr.",
      "jobTitle": "Doctor of Physical Therapy",
      "image": "https://bodyforgept.com/media/doctor-780.webp",
      "medicalSpecialty": "PhysicalTherapy",
      "worksFor": {
        "@id": "https://bodyforgept.com/#clinic"
      },
      "memberOf": {
        "@type": "Organization",
        "name": "Florida Physical Therapy Association",
        "description": "Program Director, Geriatrics Special Interest Group"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://bodyforgept.com/#website",
      "url": "https://bodyforgept.com/",
      "name": "BodyForge Physical Therapy",
      "publisher": {
        "@id": "https://bodyforgept.com/#clinic"
      },
      "inLanguage": "en-US"
    },
    {
      "@type": "FAQPage",
      "@id": "https://bodyforgept.com/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Who will I actually work with at BodyForge?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A licensed clinician from the BodyForge team, one-to-one for the whole visit. You are matched with the clinician who fits what you are dealing with, and you stay with that same person from your first visit to your last. You are not handed off to an assistant or shared with two other patients."
          }
        },
        {
          "@type": "Question",
          "name": "What happens at the first visit?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A full one-on-one visit where we measure how the joint moves, how strong it is and how much it can handle, then check how the areas around it are coping. You leave the same day with your exercise plan, not weeks later."
          }
        },
        {
          "@type": "Question",
          "name": "What conditions does BodyForge treat?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Recovery after surgery, including knee, hip and shoulder replacements, ACL, MCL and LCL surgery, labral tears, spinal fusion and broken bones. Joint and muscle problems including arthritis, bursitis, osteoporosis, low back pain, SI joint pain, plantar fasciitis and neck pain. Balance and dizziness problems including vertigo, inner-ear balance problems, and unsteadiness after a stroke or head injury. Neurological conditions including Parkinson's disease, foot drop and Ehlers-Danlos syndrome. And sports injuries including rotator cuff pain, tennis and golfer's elbow, achilles tendonitis, sciatica and runner's knee."
          }
        },
        {
          "@type": "Question",
          "name": "Do you treat Parkinson's disease, foot drop or Ehlers-Danlos syndrome?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. BodyForge treats Parkinson's disease, foot drop and Ehlers-Danlos syndrome. Care is one-to-one and built around gait, balance, joint control and the strength needed to keep you moving safely day to day."
          }
        },
        {
          "@type": "Question",
          "name": "What is the BodyForge Recovery Program and what does it cost?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A 30-minute recovery session run by the clinical team: manual massage, assisted stretching, joint mobilization, cupping, Theragun and Normatec compression boots. It runs Saturdays 7am to 2pm and Sundays 1pm to 7pm by appointment. A single session is $85, an eight-session pack is $600, and membership is $199 a month. During the founding member launch, the first session is $49 for new clients and the founding membership is $169 a month locked for 12 months, limited to the first 25 members."
          }
        },
        {
          "@type": "Question",
          "name": "Where is BodyForge Physical Therapy located and where do I park?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "3600 West Flagler Street, Miami, FL 33135. Parking is inside the gated building area, with elevator access to the second floor."
          }
        },
        {
          "@type": "Question",
          "name": "What are your hours?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Physical therapy runs Monday, Wednesday and Friday 7am to 4pm, and Tuesday and Thursday 10am to 7pm. Recovery Program sessions run Saturday 7am to 2pm and Sunday 1pm to 7pm, by appointment."
          }
        },
        {
          "@type": "Question",
          "name": "Do you offer Pilates?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. One-on-one Pilates taught by a doctor of physical therapy who trained through Polestar, using mat, spine corrector, reformer and trapeze. Sessions suit all levels and are adapted for long-standing back pain or thinning bones."
          }
        }
      ]
    }
  ]
} as const;
