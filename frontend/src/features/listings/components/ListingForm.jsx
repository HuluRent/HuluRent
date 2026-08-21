import { useEffect, useState } from 'react';
import { useCategories } from '../../../hooks/useCategories';
import './ListingForm.css';

// Maps category slug → Material Symbols icon name
const CATEGORY_ICONS = {
  'electronics':         'devices',
  'books-education':     'menu_book',
  'musical-instruments': 'music_note',
  'furniture':           'chair',
  'fashion':             'checkroom',
  'tools-equipment':     'handyman',
  'events-party':        'celebration',
  'sports-outdoors':     'sports_soccer',
  'baby-kids':           'child_care',
  'agriculture':         'agriculture',
  'other':               'category',
};

const initialValues = {
  name: '',
  description: '',
  categoryId: '',
  pricePerUnit: '',
  pricingUnit: 'day',
  depositAmount: '',
  approxLocation: '',
  availableFrom: '',
  availableTo: '',
};

function validatePositiveDecimal(value, required = true) {
  if (value === '') {
    return required ? 'This field is required.' : '';
  }

  const number = Number(value);

  if (!Number.isFinite(number) || number <= 0) {
    return 'Must be a positive number.';
  }

  return '';
}

const EMPTY_INITIAL_DATA = {};

export default function ListingForm({
  initialData = EMPTY_INITIAL_DATA,
  onSubmit,
  submitLabel = 'Save Listing',
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState({
    ...initialValues,
    ...initialData,
  });

  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

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

  function handleImageChange(event) {
    const selectedFiles = Array.from(event.target.files || []);
    setImageError('');

    if (images.length + selectedFiles.length > 5) {
      setImageError('You can upload a maximum of 5 images.');
      event.target.value = '';
      return;
    }

    const invalidFile = selectedFiles.find(
      (file) => !file.type.startsWith('image/')
    );

    if (invalidFile) {
      setImageError('Only image files are allowed.');
      event.target.value = '';
      return;
    }

    const oversizedFile = selectedFiles.find(
      (file) => file.size > 5 * 1024 * 1024
    );

    if (oversizedFile) {
      setImageError('Each image must be 5 MB or smaller.');
      event.target.value = '';
      return;
    }

    setImages((current) => [...current, ...selectedFiles]);
    event.target.value = '';
  }

  function removeImage(index) {
    setImages((current) =>
      current.filter((_, fileIndex) => fileIndex !== index)
    );
    setImageError('');
  }

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
      name:
        formData.name.trim().length < 3
          ? 'Name must be at least 3 characters.'
          : '',
      description:
        formData.description.trim().length < 10
          ? 'Description must be at least 10 characters.'
          : '',
      categoryId: !formData.categoryId ? 'Please select a category.' : '',
      pricePerUnit: validatePositiveDecimal(formData.pricePerUnit),
      depositAmount: validatePositiveDecimal(formData.depositAmount, false),
      approxLocation:
        formData.approxLocation.trim().length < 2
          ? 'Please provide an approximate location.'
          : '',
      availableFrom: !formData.availableFrom ? 'Please set an availability start date.' : '',
      availableTo: (() => {
        if (!formData.availableTo) return 'Please set an availability end date.';
        if (formData.availableFrom && formData.availableTo <= formData.availableFrom)
          return 'End date must be after start date.';
        return '';
      })(),
    };

    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    setUploadProgress(0);

    onSubmit?.({
      ...formData,
      images,
      onUploadProgress: (progressEvent) => {
        if (!progressEvent.total) return;

        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );

        setUploadProgress(progress);
      },
    });
  }

  return (
    <form className="listing-form" onSubmit={handleSubmit}>
      <div className="listing-form__section">

        <div className="listing-form__field">
          <label className="listing-form__label" htmlFor="listing-name">
            Listing Name
          </label>

          <input
            className="hr-input"
            id="listing-name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="What are you renting?"
            required
          />

          {errors.name && (
            <p className="listing-form__error">{errors.name}</p>
          )}
        </div>

        <div className="listing-form__field">
          <label
            className="listing-form__label"
            htmlFor="listing-description"
          >
            Description
          </label>

          <textarea
            className="hr-input hr-input--textarea"
            id="listing-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the item, its condition, and anything renters should know."
            required
          />

          {errors.description && (
            <p className="listing-form__error">{errors.description}</p>
          )}
        </div>

        <div className="listing-form__field">
          <label className="listing-form__label">
            Category
          </label>

          {categoriesLoading && (
            <p className="listing-form__hint">Loading categories…</p>
          )}

          {categoriesError && (
            <p className="listing-form__error">Unable to load categories.</p>
          )}

          {!categoriesLoading && !categoriesError && (
            <div className="listing-form__category-grid" role="radiogroup" aria-label="Category">
              {categories.map((category) => {
                const isSelected = formData.categoryId === category.id;
                const icon = CATEGORY_ICONS[category.slug] || 'category';
                return (
                  <button
                    key={category.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() =>
                      handleChange({ target: { name: 'categoryId', value: category.id } })
                    }
                    className={`listing-form__category-card${isSelected ? ' listing-form__category-card--selected' : ''}`}
                  >
                    <span className="material-symbols-outlined listing-form__category-icon">
                      {icon}
                    </span>
                    <span className="listing-form__category-name">{category.name}</span>
                  </button>
                );
              })}
            </div>
          )}

          {errors.categoryId && (
            <p className="listing-form__error">{errors.categoryId}</p>
          )}
        </div>

        <div className="listing-form__field">
          <label
            className="listing-form__label"
            htmlFor="listing-location"
          >
            Approximate Location
          </label>

          <input
            className="hr-input"
            id="listing-location"
            name="approxLocation"
            type="text"
            value={formData.approxLocation}
            onChange={handleChange}
            placeholder="e.g. Bole, Addis Ababa"
            required
          />

          <p className="listing-form__hint">
            Use an area or neighborhood. Do not enter your exact address.
          </p>

          {errors.approxLocation && (
            <p className="listing-form__error">
              {errors.approxLocation}
            </p>
          )}
        </div>

        <div className="listing-form__field">
          <label className="listing-form__label" htmlFor="listing-price">
            Price
          </label>

          <input
            className="hr-input"
            id="listing-price"
            name="pricePerUnit"
            type="number"
            min="0"
            step="0.01"
            value={formData.pricePerUnit}
            onChange={handleChange}
            placeholder="0.00"
            required
          />

          {errors.pricePerUnit && (
            <p className="listing-form__error">
              {errors.pricePerUnit}
            </p>
          )}
        </div>

        <div className="listing-form__field">
          <label className="listing-form__label" htmlFor="listing-pricing-unit">
            Pricing Unit
          </label>

          <select
            className="hr-input"
            id="listing-pricing-unit"
            name="pricingUnit"
            value={formData.pricingUnit}
            onChange={handleChange}
            required
          >
            <option value="hour">Per hour</option>
            <option value="day">Per day</option>
            <option value="week">Per week</option>
            <option value="month">Per month</option>
          </select>
        </div>

        <div className="listing-form__field">
          <label
            className="listing-form__label"
            htmlFor="listing-deposit"
          >
            Deposit
          </label>

          <input
            className="hr-input"
            id="listing-deposit"
            name="depositAmount"
            type="number"
            min="0"
            step="0.01"
            value={formData.depositAmount}
            onChange={handleChange}
            placeholder="0.00"
          />

          <p className="listing-form__hint">
            Optional. Leave blank if no deposit is required.
          </p>

          {errors.depositAmount && (
            <p className="listing-form__error">
              {errors.depositAmount}
            </p>
          )}
        </div>

        <div className="listing-form__field">
          <label className="listing-form__label" htmlFor="listing-available-from">
            Available From
          </label>

          <input
            className="listing-form__input"
            id="listing-available-from"
            name="availableFrom"
            type="date"
            value={formData.availableFrom}
            min={new Date().toISOString().split('T')[0]}
            onChange={handleChange}
            required
          />

          {errors.availableFrom && (
            <p className="listing-form__error">{errors.availableFrom}</p>
          )}
        </div>

        <div className="listing-form__field">
          <label className="listing-form__label" htmlFor="listing-available-to">
            Available Until
          </label>

          <input
            className="listing-form__input"
            id="listing-available-to"
            name="availableTo"
            type="date"
            value={formData.availableTo}
            min={formData.availableFrom || new Date().toISOString().split('T')[0]}
            onChange={handleChange}
            required
          />

          <p className="listing-form__hint">
            The last date this item is available for rental.
          </p>

          {errors.availableTo && (
            <p className="listing-form__error">{errors.availableTo}</p>
          )}
        </div>

        <div className="listing-form__upload">
          <div className="listing-form__field">
            <label
              className="listing-form__label"
              htmlFor="listing-images"
            >
              Images
            </label>

            <input
              className="listing-form__file"
              id="listing-images"
              name="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              disabled={isSubmitting || images.length >= 5}
            />

            <p className="listing-form__hint">
              Add up to 5 images. Each image must be 5 MB or smaller.
            </p>

            {imageError && (
              <p className="listing-form__error" role="alert">
                {imageError}
              </p>
            )}
          </div>

          {images.length > 0 && (
            <div className="listing-form__previews">
              {images.map((image, index) => (
                <div
                  className="listing-form__preview"
                  key={`${image.name}-${image.lastModified}-${index}`}
                >
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Selected image ${index + 1}`}
                  />

                  <button
                    className="hr-btn-secondary hr-btn-danger mt-2"
                    type="button"
                    onClick={() => removeImage(index)}
                    disabled={isSubmitting}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {isSubmitting && images.length > 0 && (
          <div className="listing-form__progress">
            <p className="listing-form__hint">
              Uploading images: {uploadProgress}%
            </p>

            <progress value={uploadProgress} max="100">
              {uploadProgress}%
            </progress>
          </div>
        )}

        <div className="listing-form__actions">
          <button
            className="hr-btn-primary w-full"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : submitLabel}
          </button>
        </div>

      </div>
    </form>
  );
}
