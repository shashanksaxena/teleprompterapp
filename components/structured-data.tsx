import { getSiteUrl, siteConfig } from "@/lib/site";

export function StructuredData() {
  const siteUrl = getSiteUrl();

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: siteConfig.name,
        url: siteUrl,
        description: siteConfig.description,
        author: {
          "@type": "Person",
          name: siteConfig.author
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "SoftwareApplication",
        name: siteConfig.name,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "INR"
        },
        creator: {
          "@type": "Person",
          name: siteConfig.author
        },
        description: siteConfig.description,
        url: siteUrl,
        featureList: [
          "Auto-scrolling teleprompter",
          "Mirror mode",
          "Voice-assisted scrolling",
          "Video and audio recording",
          "Saved scripts",
          "Dark and light mode"
        ]
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is FreeTeleprompter.in?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "FreeTeleprompter.in is a browser-based teleprompter for reading scripts, recording takes, and preparing camera-ready content from desktop or mobile."
            }
          },
          {
            "@type": "Question",
            name: "Can I use this teleprompter on mobile?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. The interface is mobile-friendly and optimized for quick prompting, editing, and reading on smaller screens."
            }
          },
          {
            "@type": "Question",
            name: "Does it support mirrored text for camera rigs?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Mirror mode is built in so you can flip the script for compatible teleprompter glass setups."
            }
          }
        ]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data)
      }}
    />
  );
}
