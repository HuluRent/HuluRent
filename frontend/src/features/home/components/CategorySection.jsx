import { useState } from 'react';
import './CategorySection.css';

const categories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    icon: 'devices',
    subcategories: [
      { name: 'Phones & Tablets', slug: 'phones-tablets' },
      { name: 'Laptops & Computers', slug: 'laptops-computers' },
      { name: 'Cameras & Photography', slug: 'cameras-photography' },
      { name: 'Audio & Music', slug: 'audio-music' },
      { name: 'TVs & Video', slug: 'tvs-video' },
      { name: 'Gaming', slug: 'gaming' },
      { name: 'Other Electronics', slug: 'other-electronics' },
    ],
  },
{
  name: 'Books & Education',
  slug: 'books-education',
  icon: 'menu_book',
  subcategories: [
    { name: 'Textbooks', slug: 'textbooks' },
    { name: 'Academic Books', slug: 'academic-books' },
    { name: 'Professional Books', slug: 'professional-books' },
    { name: 'Exam Preparation', slug: 'exam-preparation' },
    { name: 'Novels & Literature', slug: 'novels-literature' },
    { name: 'Children’s Books', slug: 'childrens-books' },
    { name: 'Other Books', slug: 'other-books' },
  ],
},
{
  name: 'Musical Instruments',
  slug: 'musical-instruments',
  icon: 'music_note',
  subcategories: [
    { name: 'Guitars', slug: 'guitars' },
    { name: 'Keyboards & Pianos', slug: 'keyboards-pianos' },
    { name: 'Drums & Percussion', slug: 'drums-percussion' },
    { name: 'String Instruments', slug: 'string-instruments' },
    { name: 'Wind Instruments', slug: 'wind-instruments' },
    { name: 'DJ Equipment', slug: 'dj-equipment' },
    { name: 'Other Instruments', slug: 'other-instruments' },
  ],
},
  {
    name: 'Furniture',
    slug: 'furniture',
    icon: 'chair',
    subcategories: [
      { name: 'Sofas & Couches', slug: 'sofas-couches' },
      { name: 'Tables & Chairs', slug: 'tables-chairs' },
      { name: 'Beds & Mattresses', slug: 'beds-mattresses' },
      { name: 'Office Furniture', slug: 'office-furniture' },
      { name: 'Event Furniture', slug: 'event-furniture' },
      { name: 'Other Furniture', slug: 'other-furniture' },
    ],
  },

  {
    name: 'Fashion',
    slug: 'fashion',
    icon: 'checkroom',
    subcategories: [
      { name: 'Dresses & Gowns', slug: 'dresses-gowns' },
      { name: 'Suits & Formal Wear', slug: 'suits-formal-wear' },
      { name: 'Traditional Clothing', slug: 'traditional-clothing' },
      { name: 'Shoes', slug: 'shoes' },
      { name: 'Bags & Accessories', slug: 'bags-accessories' },
      { name: 'Costumes', slug: 'costumes' },
      { name: 'Wedding Wear', slug: 'wedding-wear' },
    ],
  },

  {
    name: 'Tools & Equipment',
    slug: 'tools-equipment',
    icon: 'handyman',
    subcategories: [
      { name: 'Power Tools', slug: 'power-tools' },
      { name: 'Hand Tools', slug: 'hand-tools' },
      { name: 'Generators', slug: 'generators' },
      { name: 'Welding Equipment', slug: 'welding-equipment' },
      { name: 'Ladders & Scaffolding', slug: 'ladders-scaffolding' },
      { name: 'Construction Equipment', slug: 'construction-equipment' },
      { name: 'Gardening Equipment', slug: 'gardening-equipment' },
    ],
  },

  {
    name: 'Events & Party',
    slug: 'events-party',
    icon: 'celebration',
    subcategories: [
      { name: 'Event Furniture', slug: 'event-furniture' },
      { name: 'Tents & Canopies', slug: 'tents-canopies' },
      { name: 'Catering Equipment', slug: 'catering-equipment' },
      { name: 'Sound & DJ Equipment', slug: 'sound-dj-equipment' },
      { name: 'Lighting Equipment', slug: 'lighting-equipment' },
      { name: 'Decoration', slug: 'decoration' },
      { name: 'Party Equipment', slug: 'party-equipment' },
    ],
  },

  {
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    icon: 'sports_soccer',
    subcategories: [
      { name: 'Sports Equipment', slug: 'sports-equipment' },
      { name: 'Camping Equipment', slug: 'camping-equipment' },
      { name: 'Bicycles', slug: 'bicycles' },
      { name: 'Outdoor Equipment', slug: 'outdoor-equipment' },
      { name: 'Fitness Equipment', slug: 'fitness-equipment' },
   
      { name: 'Other Outdoor Gear', slug: 'other-outdoor-gear' },
    ],
  },

  {
    name: 'Baby & Kids',
    slug: 'baby-kids',
    icon: 'child_care',
    subcategories: [
      { name: 'Baby Strollers', slug: 'baby-strollers' },
      { name: 'Car Seats', slug: 'car-seats' },
      { name: 'Cribs & Cots', slug: 'cribs-cots' },
      { name: 'Baby Equipment', slug: 'baby-equipment' },
      { name: 'Toys & Games', slug: 'toys-games' },
      { name: 'Kids Party Equipment', slug: 'kids-party-equipment' },
    ],
  },

  {
    name: 'Agriculture',
    slug: 'agriculture',
    icon: 'agriculture',
    subcategories: [
      { name: 'Farming Tools', slug: 'farming-tools' },
      { name: 'Agricultural Equipment', slug: 'agricultural-equipment' },
      { name: 'Irrigation Equipment', slug: 'irrigation-equipment' },
      { name: 'Harvesting Equipment', slug: 'harvesting-equipment' },
      { name: 'Livestock Equipment', slug: 'livestock-equipment' },
      { name: 'Food Processing Equipment', slug: 'food-processing-equipment' },
    ],
  },

  {
    name: 'Other',
    slug: 'other',
    icon: 'category',
    subcategories: [
      { name: 'Other Items', slug: 'other-items' },
    ],
  },
];

function CategorySection({ onCategorySelect }) {
  const [openCategory, setOpenCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setOpenCategory((current) =>
      current === category.slug ? null : category.slug
    );
  };

  const handleSubcategoryClick = (category, subcategory) => {
    if (onCategorySelect) {
      onCategorySelect({
        category,
        subcategory,
      });
    }
  };

  return (
    <section className="categories">
      <h2>Explore Categories</h2>

      <div className="categories__grid">
        {categories.map((category) => (
          <div
            className={`category-wrapper ${
              openCategory === category.slug
                ? 'category-wrapper--open'
                : ''
            }`}
            key={category.slug}
          >
            <button
              type="button"
              className="category-card"
              onClick={() => handleCategoryClick(category)}
            >
              <div className="category-card__icon">
                <span className="material-symbols-outlined">
                  {category.icon}
                </span>
              </div>

              <span>{category.name}</span>
            </button>

            <div className="subcategory-menu">
              {category.subcategories.map((subcategory) => (
                <button
                  type="button"
                  className="subcategory-card"
                  key={subcategory.slug}
                  onClick={() =>
                    handleSubcategoryClick(
                      category,
                      subcategory
                    )
                  }
                >
                  {subcategory.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CategorySection;