import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IdentityVerification } from '../IdentityVerification';
import * as identityHooks from '../../hooks/useIdentity';

describe('IdentityVerification', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <IdentityVerification />
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders UNVERIFIED state and ID input', () => {
    vi.spyOn(identityHooks, 'useIdentityVerificationStatus').mockReturnValue({
      data: { status: 'UNVERIFIED' },
      isLoading: false,
    });
    vi.spyOn(identityHooks, 'useInitiateIdentityVerification').mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    vi.spyOn(identityHooks, 'useVerifyIdentity').mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });

    renderComponent();

    expect(screen.getByText(/Verifying your identity helps build trust/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter ID Number')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start Verification' })).toBeInTheDocument();
  });

  it('initiate mutation sends the correct idNumber', async () => {
    const mutateMock = vi.fn();
    vi.spyOn(identityHooks, 'useIdentityVerificationStatus').mockReturnValue({
      data: { status: 'UNVERIFIED' },
      isLoading: false,
    });
    vi.spyOn(identityHooks, 'useInitiateIdentityVerification').mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    });
    vi.spyOn(identityHooks, 'useVerifyIdentity').mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });

    renderComponent();

    const input = screen.getByPlaceholderText('Enter ID Number');
    fireEvent.change(input, { target: { value: 'ID12345' } });
    
    const button = screen.getByRole('button', { name: 'Start Verification' });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalledWith('ID12345', expect.any(Object));
    });
  });

  it('renders PENDING state and OTP input', () => {
    vi.spyOn(identityHooks, 'useIdentityVerificationStatus').mockReturnValue({
      data: { status: 'PENDING' },
      isLoading: false,
    });
    vi.spyOn(identityHooks, 'useInitiateIdentityVerification').mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    vi.spyOn(identityHooks, 'useVerifyIdentity').mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });

    renderComponent();

    expect(screen.getByText('Verification Pending')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter ID Number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter OTP')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Verify Identity' })).toBeInTheDocument();
  });

  it('verify mutation sends BOTH idNumber and otp', async () => {
    const mutateMock = vi.fn();
    vi.spyOn(identityHooks, 'useIdentityVerificationStatus').mockReturnValue({
      data: { status: 'PENDING' },
      isLoading: false,
    });
    vi.spyOn(identityHooks, 'useInitiateIdentityVerification').mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    vi.spyOn(identityHooks, 'useVerifyIdentity').mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    });

    renderComponent();

    const idInput = screen.getByPlaceholderText('Enter ID Number');
    fireEvent.change(idInput, { target: { value: 'ID12345' } });

    const otpInput = screen.getByPlaceholderText('Enter OTP');
    fireEvent.change(otpInput, { target: { value: '654321' } });
    
    const button = screen.getByRole('button', { name: 'Verify Identity' });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalledWith({ idNumber: 'ID12345', otp: '654321' }, expect.any(Object));
    });
  });

  it('renders VERIFIED state', () => {
    vi.spyOn(identityHooks, 'useIdentityVerificationStatus').mockReturnValue({
      data: { status: 'VERIFIED' },
      isLoading: false,
    });
    vi.spyOn(identityHooks, 'useInitiateIdentityVerification').mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });
    vi.spyOn(identityHooks, 'useVerifyIdentity').mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });

    renderComponent();

    expect(screen.getByText('Identity Verified')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Enter ID Number')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Enter OTP')).not.toBeInTheDocument();
  });
});
