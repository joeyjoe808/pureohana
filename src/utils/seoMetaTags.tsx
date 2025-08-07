import React from 'react';
import { Helmet } from 'react-helmet-async';

// SEO Component with all high-value keywords
export const SEOMetaTags = ({ page = 'home' }) => {
  const pages = {
    home: {
      title: 'Hawaii Wedding Photographer | Oahu Luxury Photography | Pure Ohana Treasures',
      description: 'Hawaii wedding photographer specializing in luxury weddings, elopements & family portraits. Serving Oahu, Maui, Kauai & Big Island. Collections from $8,000.',
      keywords: 'hawaii wedding photographer, oahu photographer, maui wedding photographer, hawaii photographer, wedding photographer hawaii, hawaii wedding photography, oahu wedding photographer, kauai wedding photographer, big island wedding photographer, hawaii family photographer, waikiki photographer, honolulu wedding photographer, hawaii beach wedding, hawaii elopement photographer, north shore photographer oahu, hawaii engagement photographer, destination wedding hawaii, hawaii wedding videographer, luxury hawaii photographer'
    },
    portfolio: {
      title: 'Hawaii Wedding Photography Portfolio | Luxury Oahu Weddings | Pure Ohana',
      description: 'View our luxury Hawaii wedding photography portfolio. Featured venues: Four Seasons Maui, Montage Kapalua, Turtle Bay Resort. Professional wedding photographer Oahu.',
      keywords: 'hawaii wedding photos, oahu wedding photography, maui wedding pictures, kauai wedding photographer portfolio, hawaii photographer portfolio, luxury wedding photography hawaii, four seasons maui photographer, ko olina wedding photographer, turtle bay wedding photographer, lanikai beach photographer'
    },
    about: {
      title: 'About | Hawaii Luxury Wedding Photographer | Pure Ohana Treasures',
      description: 'Award-winning Hawaii wedding photographer based in Aiea, Oahu. Specializing in intimate luxury weddings and elopements across all Hawaiian islands.',
      keywords: 'about hawaii photographer, professional photographer hawaii, experienced photographer hawaii, award winning photographer hawaii, aiea photographer, oahu based photographer, hawaii wedding specialist, luxury photographer hawaii'
    },
    investment: {
      title: 'Hawaii Wedding Photography Pricing | Investment | Pure Ohana Treasures',
      description: 'Hawaii wedding photography collections starting at $8,000. Luxury wedding photographer serving Oahu, Maui, Kauai. Limited bookings for 2025-2026.',
      keywords: 'hawaii wedding photographer pricing, hawaii wedding photography cost, how much wedding photographer hawaii, affordable luxury photographer hawaii, hawaii wedding packages, wedding photography investment hawaii'
    }
  };

  const currentPage = pages[page] || pages.home;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{currentPage.title}</title>
      <meta name="title" content={currentPage.title} />
      <meta name="description" content={currentPage.description} />
      <meta name="keywords" content={currentPage.keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://pureohanatreasures.com/" />
      <meta property="og:title" content={currentPage.title} />
      <meta property="og:description" content={currentPage.description} />
      <meta property="og:image" content="https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/untitled-1720.jpg" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://pureohanatreasures.com/" />
      <meta property="twitter:title" content={currentPage.title} />
      <meta property="twitter:description" content={currentPage.description} />
      <meta property="twitter:image" content="https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/untitled-1720.jpg" />
      
      {/* Local SEO Schema Markup */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "name": "Pure Ohana Treasures",
          "image": "https://ujpvlaaitdudcawgcyik.supabase.co/storage/v1/object/public/pureohanatreasures/untitled-1720.jpg",
          "@id": "https://pureohanatreasures.com",
          "url": "https://pureohanatreasures.com",
          "telephone": "808-123-4567",
          "email": "pureohanatreasures@gmail.com",
          "priceRange": "$$$$$",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Aiea",
            "addressLocality": "Aiea",
            "addressRegion": "HI",
            "postalCode": "96701",
            "addressCountry": "US"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 21.3851,
            "longitude": -157.9313
          },
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday"
            ],
            "opens": "00:00",
            "closes": "23:59"
          },
          "sameAs": [
            "https://www.instagram.com/pureohanatreasures",
            "https://www.pinterest.com/pureohanatreasures",
            "https://www.facebook.com/pureohanatreasures"
          ],
          "areaServed": [
            {
              "@type": "Place",
              "name": "Oahu"
            },
            {
              "@type": "Place",
              "name": "Maui"
            },
            {
              "@type": "Place",
              "name": "Kauai"
            },
            {
              "@type": "Place",
              "name": "Big Island"
            }
          ],
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Photography Services",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Wedding Photography",
                  "description": "Luxury wedding photography in Hawaii"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Elopement Photography",
                  "description": "Intimate elopement photography Hawaii"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Family Photography",
                  "description": "Hawaii family portrait sessions"
                }
              }
            ]
          }
        })}
      </script>
    </Helmet>
  );
};

// Hidden SEO Footer with location keywords
export const SEOFooter = () => (
  <div className="hidden">
    <h2>Hawaii Wedding Photographer Serving All Islands</h2>
    <p>
      Professional wedding photographer based in Aiea, Oahu, Hawaii. 
      Specializing in luxury weddings at Four Seasons Maui, Montage Kapalua Bay, 
      Turtle Bay Resort, Ko Olina, and private estates across Hawaii.
    </p>
    <h3>Oahu Photography Locations</h3>
    <p>
      Waikiki, Honolulu, North Shore, Kailua, Lanikai Beach, Diamond Head, 
      Haleiwa, Pearl Harbor, Hawaii Kai, Kahala, Kaneohe, Mililani, Kapolei, 
      Ewa Beach, Ko Olina, Magic Island, Ala Moana, Tantalus, Manoa Falls
    </p>
    <h3>Maui Photography Services</h3>
    <p>
      Wailea, Kaanapali, Kapalua, Lahaina, Kihei, Makena, Hana, Paia, 
      Grand Wailea, Four Seasons Maui, Montage Kapalua Bay
    </p>
    <h3>Photography Services</h3>
    <p>
      Wedding photography, elopement photographer, engagement photos, 
      family portraits, maternity photography, couples sessions, 
      vow renewal photography, proposal photographer, beach weddings, 
      sunset photography, sunrise sessions, destination weddings
    </p>
  </div>
);