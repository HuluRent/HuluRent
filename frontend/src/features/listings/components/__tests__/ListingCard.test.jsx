import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ListingCard from '../ListingCard';

const listing = {
  id: 1,
  title: 'Sony A7 IV Camera + Lens',
  category: 'Camera',
  rating: 4.9,
  location: 'Bole, Addis Ababa',
  price: 1500,
  image: 'https://example.com/camera.jpg',
};

describe('ListingCard', () => {
  it('renders listing information', () => {
    render(<ListingCard listing={listing} />);

    expect(screen.getByText('Sony A7 IV Camera + Lens')).toBeInTheDocument();
    expect(screen.getByText('Camera')).toBeInTheDocument();
    expect(screen.getByText('4.9')).toBeInTheDocument();
    expect(screen.getByText('Bole, Addis Ababa')).toBeInTheDocument();
    expect(screen.getByText(/1,500 ETB/)).toBeInTheDocument();
  });

  it('renders the listing image with the correct alt text', () => {
    render(<ListingCard listing={listing} />);

    const image = screen.getByRole('img');

    expect(image).toHaveAttribute(
      'src',
      'https://example.com/camera.jpg',
    );
    expect(image).toHaveAttribute(
      'alt',
      'Sony A7 IV Camera + Lens',
    );
  });

  it('renders the View button', () => {
    render(<ListingCard listing={listing} />);

    expect(
      screen.getByRole('button', { name: 'View' }),
    ).toBeInTheDocument();
  });
});
