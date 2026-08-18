import './ListingGallery.css';
import { useState } from 'react';
function GalleryImage({ image, alt, index }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="listing-gallery__image-fallback">
        <span>Image unavailable</span>
      </div>
    );
  }

  return (
    <img
      src={image.url}
      alt={`${alt} ${index + 1}`}
      onError={() => setFailed(true)}
    />
  );
}

export function ListingGallery({ images = [], alt = 'Listing image' }) {
  if (images.length === 0) {
    return (
      <div className="listing-gallery listing-gallery--empty">
        <span>No images available</span>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="listing-gallery listing-gallery--single">
        <GalleryImage
          image={images[0]}
          alt={alt}
          index={0}
        />
      </div>
    );
  }

  return (
    <div className="listing-gallery listing-gallery--grid">
      {images.map((image, index) => (
        <GalleryImage
          key={image.id ?? image.url ?? index}
          image={image}
          alt={alt}
          index={index}
        />
      ))}
    </div>
  );
}