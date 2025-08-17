import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

interface MetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

/**
 * Component for managing dynamic meta tags based on the current route
 * This enables proper social media previews for all pages and sub-links
 */
const MetaTags: React.FC<MetaTagsProps> = ({
  title = "Victor's Wedding Invitation",
  description = "You're invited to celebrate our special day",
  image = "images/social/preview.jpg",
  url,
}) => {
  const location = useLocation();
  const currentUrl = url || `https://vmataba.github.io/victors-wedding${location.pathname}`;
  const imageUrl = image.startsWith('http') 
    ? image 
    : `https://vmataba.github.io/victors-wedding/${image.startsWith('/') ? image.substring(1) : image}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:secure_url" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={imageUrl} />
      
      {/* LinkedIn */}
      <meta property="linkedin:title" content={title} />
      <meta property="linkedin:description" content={description} />
      <meta property="linkedin:image" content={imageUrl} />
    </Helmet>
  );
};

export default MetaTags;
