import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../HomePage';

function renderHomePage() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );
}

describe('HomePage', () => {
  it('renders the main navigation', () => {
  renderHomePage();

  expect(
    screen.getByRole('link', { name: 'HuluRent' }),
  ).toBeInTheDocument();

  expect(
    screen.getByRole('link', { name: 'Browse' }),
  ).toBeInTheDocument();

  expect(
    screen.getAllByRole('link', { name: 'How it Works' }),
  ).toHaveLength(2);
});

  it('renders the hero section', () => {
    renderHomePage();

    expect(
      screen.getByRole('heading', {
        name: 'Rent what you need. Earn from what you own.',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText('What are you looking for?'),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Search Rentals' }),
    ).toBeInTheDocument();
  });

  it('renders the major home page sections', () => {
    renderHomePage();

    expect(
      screen.getByRole('heading', { name: 'Explore Categories' }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: 'Featured in Addis Ababa',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: 'Built on Trust',
      }),
    ).toBeInTheDocument();
  });
});
