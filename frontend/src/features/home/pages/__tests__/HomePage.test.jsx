import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from '../HomePage';
import { AuthProvider } from '../../../../context/AuthContext';

afterEach(() => {
  cleanup();
});

function renderHomePage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  queryClient.setQueryData(['categories'], []);
  queryClient.setQueryData(['featured-listings'], { data: [] });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AuthProvider>
          <HomePage />
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('HomePage', () => {
  it('renders the main navigation', () => {
    renderHomePage();

    expect(
      screen.getAllByRole('link', { name: /Hulu.*Rent/i }).length,
    ).toBeGreaterThan(0);

    // The link in the footer is "Browse Rentals"
    expect(
      screen.getByRole('link', { name: /Browse Rentals/i }),
    ).toBeInTheDocument();

    expect(
      screen.getAllByRole('link', { name: /How it Works/i }),
    ).toHaveLength(1); // It only renders once in the footer on desktop
  });

  it('renders the hero section', () => {
    renderHomePage();

    expect(
      screen.getByRole('heading', {
        name: /Rent what you need.*Earn from what you own/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/What are you looking for/i),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /Search Rentals/i }),
    ).toBeInTheDocument();
  });

  it('renders the major home page sections', () => {
    renderHomePage();

    expect(
      screen.getByRole('heading', { name: 'Popular Categories' }),
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
