// web-app/src/components/SEO.tsx
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
}

export default function SEO({
    title = 'Dating App - Find Your Perfect Match',
    description = 'Connect with amazing people nearby. Swipe, match, and chat with singles looking for love, friendship, or meaningful relationships.',
    keywords = 'dating, dating app, match, singles, relationships, chat, meet people, online dating',
    image = '/og-image.jpg',
    url = 'https://yourdomain.com',
    type = 'website'
}: SEOProps) {
    const fullTitle = title.includes('Dating App') ? title : `${title} | Dating App`;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />

            {/* Additional Meta Tags */}
            <meta name="robots" content="index, follow" />
            <meta name="language" content="English" />
            <meta name="author" content="Dating App Team" />
            <link rel="canonical" href={url} />
        </Helmet>
    );
}