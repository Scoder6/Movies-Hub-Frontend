import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  structuredData?: object;
  noIndex?: boolean;
}

export function SEO({
  title = 'MovieHub - Discover & Rate Movies',
  description = 'Discover, rate, and discuss your favorite movies with fellow film enthusiasts.',
  keywords = 'movies, reviews, ratings, recommendations, cinema, films',
  image = '/placeholder.svg',
  url = window.location.href,
  type = 'website',
  structuredData,
  noIndex = false
}: SEOProps) {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Robots */}
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}

// Helper function to generate movie structured data
export function getMovieStructuredData(movie: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": movie.title,
    "description": movie.description,
    "director": {
      "@type": "Person",
      "name": movie.director
    },
    "datePublished": movie.releaseYear.toString(),
    "genre": movie.genre,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": movie.rating,
      "ratingCount": movie.upvotes + movie.downvotes,
      "bestRating": "10",
      "worstRating": "1"
    },
    "image": movie.posterUrl,
    "url": `${window.location.origin}/movie/${movie.id}`
  };
}