// Converted from the Stitch AI browse-listings design. Props match the
// GET /search item shape exactly (see hulurent-docs' technical/api-reference.md
// "Search" section) — this component should never need its own data
// transformation beyond what formatCurrency.js does.

import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../utils/formatCurrency';

/**
 * @param {{ item: object, isSaved: boolean, onSave: (id: string) => void, onUnsave: (id: string) => void, isSavePending: boolean }} props
 */
export function ListingCard({ item, isSaved = false, onSave, onUnsave, isSavePending = false }) {
  function handleSaveToggle(e) {
    e.preventDefault();
    e.stopPropagation();
    if (isSavePending) return;
    if (isSaved) {
      onUnsave?.(item.id);
    } else {
      onSave?.(item.id);
    }
  }

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-subtle hover:shadow-hover transition-shadow group flex flex-col h-full relative">
      {/* Save button — only rendered when parent supplies handlers (auth required) */}
      {(onSave || onUnsave) && (
        <button
          onClick={handleSaveToggle}
          aria-label={isSaved ? 'Remove from Saved List' : 'Save listing'}
          aria-pressed={isSaved}
          disabled={isSavePending}
          className="absolute top-3 right-3 z-10 p-1.5 bg-surface/80 rounded-full hover:bg-surface transition-colors disabled:opacity-50"
        >
          <span
            className={`material-symbols-outlined transition-colors ${
              isSaved ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
            }`}
            style={isSaved ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            bookmark
          </span>
        </button>
      )}

      <Link to={`/listings/${item.id}`} className="h-48 w-full bg-surface-variant relative block overflow-hidden">
        {item.thumbnailUrl ? (
          <img
            src={item.thumbnailUrl}
            alt={item.name}
            className="w-full h-full object-cover rounded-t-xl group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl">image</span>
          </div>
        )}
        <div className="absolute top-3 left-3 bg-surface-container-highest px-2 py-1 rounded-full border border-outline-variant">
          <span className="font-label-sm text-label-sm text-on-surface-variant">{item.category?.name}</span>
        </div>
      </Link>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/listings/${item.id}`}>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-1 truncate hover:underline">
              {item.name}
            </h3>
          </Link>
          <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 mb-2">
            <span className="material-symbols-outlined text-[16px]">location_on</span>
            {item.approxLocation}
          </p>
        </div>

        <div className="mt-4 flex justify-between items-end border-t border-outline-variant pt-3">
          <div>
            <span className="font-price-display text-price-display text-primary-container">
              {formatCurrency(item.pricePerUnit)}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant"> / {item.pricingUnit}</span>
          </div>
          {item.owner?.rating != null && (
            <div className="flex items-center gap-1">
              <span
                className="material-symbols-outlined text-[16px] text-[#D4A373]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span className="font-label-sm text-label-sm text-on-surface font-semibold">{item.owner.rating}</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                ({item.owner.reviewCount})
              </span>
            </div>
          )}
        </div>
      </div>

      {item.owner && (
        <div className="px-4 pb-4 flex items-center gap-2">
          <div className="relative w-6 h-6 flex-shrink-0">
            {item.owner.avatarUrl ? (
              <img
                src={item.owner.avatarUrl}
                alt={item.owner.displayName}
                className="w-6 h-6 rounded-full object-cover border border-outline-variant"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-surface-variant border border-outline-variant" />
            )}
            {item.owner.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-surface-container-lowest rounded-full">
                <span
                  className="material-symbols-outlined text-primary text-[12px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              </div>
            )}
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant truncate">
            Provided by {item.owner.displayName}
          </span>
        </div>
      )}
    </div>
  );
}