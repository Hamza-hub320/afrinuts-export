import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaShieldAlt, FaEnvelope } from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import { completeMagicLinkSignIn } from '@/services/buyerAuth';

const ALLOWED_REDIRECTS = ['/portal', '/dashboard/buyers'];

const BuyerAuthCallback: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<'ready' | 'signing-in' | 'error'>('ready');
    const [errorMessage, setErrorMessage] = useState('');

    // Pull the redirect hint out of the URL once, and sanitize it.
    const rawRedirect = searchParams.get('redirect') || '/portal';
    const redirectPath = ALLOWED_REDIRECTS.includes(rawRedirect) ? rawRedirect : '/portal';
    const isStaffRedirect = redirectPath === '/dashboard/buyers';

    const handleSignIn = async () => {
        setStatus('signing-in');
        try {
            const user = await completeMagicLinkSignIn();
            if (user) {
                navigate(redirectPath, { replace: true });
            } else {
                navigate('/portal/login', { replace: true });
            }
        } catch (error: any) {
            console.error('Sign-in error:', error);
            setStatus('error');
            setErrorMessage(
                error?.code === 'auth/invalid-action-code'
                    ? 'This login link has already been used or expired. Please request a new one.'
                    : error?.message || 'Could not complete sign-in'
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-[72px] px-4">
            <div className="max-w-md w-full">
                <InfoCard
                    icon={FaShieldAlt}
                    title={isStaffRedirect ? 'Complete Staff Sign In' : 'Complete Your Sign In'}
                    variant="primary"
                    showInfoBadge={false}
                >
                    {status === 'ready' && (
                        <div className="text-center py-4">
                            <FaEnvelope className="text-4xl text-accent mx-auto mb-4" />
                            <Typography variant="body" className="text-gray-600 mb-4 text-sm">
                                Click the button below to securely complete your sign-in. This prevents email scanners from using your one-time link.
                            </Typography>
                            <button
                                onClick={handleSignIn}
                                className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all"
                            >
                                Sign In Now
                            </button>
                        </div>
                    )}
                    {status === 'signing-in' && (
                        <div className="text-center py-6">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                            <Typography variant="body" className="text-gray-600">
                                Signing you in...
                            </Typography>
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="text-center py-6">
                            <Typography variant="body" className="text-red-600 mb-4 text-sm">
                                {errorMessage}
                            </Typography>
                            <button
                                onClick={() => navigate('/portal/login')}
                                className="bg-primary text-white px-6 py-2 rounded-full text-sm font-medium"
                            >
                                Request New Link
                            </button>
                        </div>
                    )}
                </InfoCard>
            </div>
        </div>
    );
};

export default BuyerAuthCallback;