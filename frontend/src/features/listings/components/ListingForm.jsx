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
      price: validatePositiveDecimal(formData.price),
      deposit: validatePositiveDecimal(formData.deposit),
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
        <label htmlFor="listing-images">Images</label>

        <input
          id="listing-images"
          name="images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          disabled={isSubmitting || images.length >= 5}
        />

        <p>
          Add up to 5 images. Each image must be 5 MB or smaller.
        </p>

        {imageError && <p role="alert">{imageError}</p>}

        {images.length > 0 && (
          <div>
            {images.map((image, index) => (
              <div key={`${image.name}-${image.lastModified}-${index}`}>
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Selected image ${index + 1}`}
                  width="120"
                  height="120"
                  style={{ objectFit: 'cover' }}
                />

                <button
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
        <div>
          <p>Uploading images: {uploadProgress}%</p>
          <progress value={uploadProgress} max="100">
            {uploadProgress}%
          </progress>
        </div>
      )}

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