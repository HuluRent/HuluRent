import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../../../hooks/useCategories';

// Fallback icons for known categories
const ICON_MAP = {
  'Electronics': 'devices',
  'Tools': 'handyman',
  'Events': 'celebration',
  'Vehicles': 'directions_car',
  'Sports': 'sports_soccer',
  'Furniture': 'chair',
  'Fashion': 'checkroom',
  'Instruments': 'music_note',
  'Baby & Kids': 'child_care',
};

function CategorySection() {
  const navigate = useNavigate();
  const { data: categoriesData, isLoading } = useCategories();
  const [expandedCategory, setExpandedCategory] = useState(null);

  const categories = categoriesData?.items || categoriesData || [];

  // Build parent-child tree
  const parents = categories.filter(c => !c.parentId);
  const getChildren = (parentId) => categories.filter(c => c.parentId === parentId);

  if (isLoading) {
    return (
      <section className="py-16 bg-surface-muted">
        <div className="hr-container animate-pulse">
          <div className="h-8 bg-surface-border rounded w-48 mb-8"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-32 bg-surface-border rounded-xl"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-surface-muted">
      <div className="hr-container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-text">Popular Categories</h2>
          <button
            onClick={() => navigate('/search')}
            className="text-primary font-medium hover:text-primary-hover flex items-center gap-1 transition-colors"
          >
            View all <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {parents.map((category) => {
            const children = getChildren(category.id);
            const isExpanded = expandedCategory === category.id;
            const icon = ICON_MAP[category.name] || 'category';

            return (
              <div
                key={category.id}
                className="relative flex flex-col"
                onMouseEnter={() => setExpandedCategory(category.id)}
                onMouseLeave={() => setExpandedCategory(null)}
              >
                <button
                  onClick={() => navigate(`/search?categoryId=${category.id}`)}
                  className={`flex flex-col items-center justify-center p-6 bg-white rounded-xl border transition-all h-full text-center ${isExpanded ? 'border-primary shadow-md' : 'border-surface-border hover:border-primary/30 hover:shadow-card'}`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${isExpanded ? 'bg-primary/10 text-primary' : 'bg-surface-muted text-text-muted'}`}>
                    <span className="material-symbols-outlined text-3xl">
                      {icon}
                    </span>
                  </div>
                  <h3 className={`font-semibold text-sm mb-1 transition-colors ${isExpanded ? 'text-primary' : 'text-text'}`}>
                    {category.name}
                  </h3>
                </button>

                {/* Subcategories Dropdown for Desktop */}
                {isExpanded && children.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-surface-border rounded-xl shadow-elevated z-20 py-2 hidden md:block">
                    {children.map(child => (
                      <button
                        key={child.id}
                        onClick={() => navigate(`/search?categoryId=${child.id}`)}
                        className="w-full text-left px-4 py-2 text-sm text-text hover:bg-surface-muted hover:text-primary transition-colors"
                      >
                        {child.name}
                      </button>
                    ))}
                  </div>
                )}

                {/* Inline Subcategories for Mobile */}
                {isExpanded && children.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1 md:hidden">
                    {children.map(child => (
                      <button
                        key={child.id}
                        onClick={() => navigate(`/search?categoryId=${child.id}`)}
                        className="text-left px-3 py-2 text-sm text-text-muted bg-white border border-surface-border rounded-lg hover:text-primary hover:border-primary/30"
                      >
                        {child.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default CategorySection;