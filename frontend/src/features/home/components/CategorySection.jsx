import './CategorySection.css';

const categories = [
  { name: 'Electronics', icon: 'devices' },
  { name: 'Cameras', icon: 'photo_camera' },
  { name: 'Tools', icon: 'handyman' },
  { name: 'Camping', icon: 'camping' },
  { name: 'Event Gear', icon: 'celebration' },
  { name: 'Furniture', icon: 'chair' },
];

function CategorySection() {
  return (
    <section className="categories">
      <h2>Explore Categories</h2>

      <div className="categories__grid">
        {categories.map((category) => (
          <button
            type="button"
            className="category-card"
            key={category.name}
          >
            <div className="category-card__icon">
              <span className="material-symbols-outlined">
                {category.icon}
              </span>
            </div>

            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default CategorySection;