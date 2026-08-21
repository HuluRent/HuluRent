import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../utils/formatCurrency';
import { getImageUrl } from '../../../utils/getImageUrl';

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
    <Link to={`/listings/${item.id}`} className="group bg-white border border-surface-border rounded-xl overflow-hidden shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col h-full relative">

      {/* Save Button */}
      {(onSave || onUnsave) && (
        <button
          onClick={handleSaveToggle}
          disabled={isSavePending}
          className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-105 transition-all shadow-sm border border-surface-border disabled:opacity-50"
          aria-label={isSaved ? 'Unsave' : 'Save'}
        >
          <span
            className={`material-symbols-outlined text-[20px] transition-colors ${
              isSaved ? 'text-primary' : 'text-text-muted hover:text-primary'
            }`}
            style={isSaved ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            bookmark
          </span>
        </button>
      )}

      {/* Image Area */}
      <div className="relative aspect-[4/3] w-full bg-surface-muted overflow-hidden">
        {item.images?.[0]?.url ? (
          <img
            src={getImageUrl(item.images[0].url)}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted bg-surface-muted">
            <span className="material-symbols-outlined text-4xl opacity-20">image</span>
          </div>
        )}

        {/* Category Badge */}
        {item.category?.name && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wider uppercase text-text border border-surface-border">
            {item.category.name}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="mb-4">
          <div className="flex items-center gap-1.5 text-text-muted text-sm mb-1.5 font-medium">
            <span className="material-symbols-outlined text-[16px]">location_on</span>
            <span className="truncate">{item.approxLocation}</span>
          </div>
          <h3 className="text-lg font-semibold text-text line-clamp-1 group-hover:text-primary transition-colors">
            {item.name}
          </h3>
        </div>

        <div className="flex items-end justify-between mt-auto">
          <div>
            <div className="text-xl font-bold text-primary tracking-tight">
              {formatCurrency(item.pricePerUnit)}
            </div>
            <div className="text-sm text-text-muted font-medium">
              / {item.pricingUnit}
            </div>
          </div>

          {item.owner?.rating != null && (
            <div className="flex items-center gap-1 bg-surface-muted px-2 py-1 rounded-md">
              <span className="material-symbols-outlined text-[16px] text-accent-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
              <span className="text-sm font-semibold text-text">{item.owner.rating}</span>
              {item.owner.reviewCount > 0 && (
                <span className="text-sm text-text-muted">({item.owner.reviewCount})</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Owner Strip */}
      {item.owner && (
        <div className="px-4 py-3 bg-surface-muted border-t border-surface-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              {item.owner.avatarUrl ? (
                <img src={item.owner.avatarUrl} alt={item.owner.displayName} className="w-6 h-6 rounded-full object-cover border border-surface-border" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center border border-surface-border">
                  <span className="material-symbols-outlined text-[12px] text-white">person</span>
                </div>
              )}
              {item.owner.isVerified && (
                <span className="material-symbols-outlined absolute -bottom-1 -right-1 text-[12px] text-primary bg-white rounded-full" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
              )}
            </div>
            <span className="text-xs text-text-muted font-medium truncate max-w-[100px]">
              {item.owner.displayName}
            </span>
          </div>

          <button
            className="text-text-muted hover:text-primary transition-colors flex items-center"
            title="Message Owner"
            aria-label="Message Owner"
          >
            <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
          </button>
        </div>
      )}
    </Link>
  );
}