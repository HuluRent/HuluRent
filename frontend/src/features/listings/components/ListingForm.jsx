import { useEffect, useState } from 'react';
import { useCategories } from '../../../hooks/useCategories';

const initialValues = {
  title: '',
  description: '',
  categoryId: '',
  price: '',
  deposit: '',
};

function validatePositiveDecimal(value) {
  if (value === '') return 'This field is required.';

  const number = Number(value);

  if (!Number.isFinite(number) || number <= 0) {
    return 'Must be a positive decimal.';
  }

  return '';
}

export default function ListingForm({
  initialData = {},
  onSubmit,
  submitLabel = 'Save Listing',
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState({
    ...initialValues,
    ...initialData,
  });
  const [errors, setErrors] = useState({});

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategories();

  useEffect(() => {
    setFormData({
      ...initialValues,
      ...initialData,
    });
  }, [initialData]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: '',
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {
      price: validatePositiveDecimal(formData.price),
      deposit: validatePositiveDecimal(formData.deposit),
    };

    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    onSubmit?.(formData);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="listing-title">Title</label>
        <input
          id="listing-title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="listing-description">Description</label>
        <textarea
          id="listing-description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="listing-category">Category</label>
        <select
          id="listing-category"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          disabled={categoriesLoading || categoriesError}
          required
        >
          <option value="">
            {categoriesLoading ? 'Loading categories...' : 'Select a category'}
          </option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {categoriesError && <p>Unable to load categories.</p>}
      </div>

      <div>
        <label htmlFor="listing-price">Price</label>
        <input
          id="listing-price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
          required
        />
        {errors.price && <p>{errors.price}</p>}
      </div>

      <div>
        <label htmlFor="listing-deposit">Deposit</label>
        <input
          id="listing-deposit"
          name="deposit"
          type="number"
          min="0"
          step="0.01"
          value={formData.deposit}
          onChange={handleChange}
          required
        />
        {errors.deposit && <p>{errors.deposit}</p>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
