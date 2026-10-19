import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShieldAlt } from 'react-icons/fa';
import { Typography } from '@/components/Typography/Typography';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import { completeMagicLinkSignIn } from '@/services/buyerAuth';

const BuyerAuthCallback: React.FC = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState<'signing-in' | 'error'>('signing-in');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const signIn = async () => {
            try {
                const user = await completeMagicLinkSignIn();
                if (user) {
                    navigate('/portal', { replace: true });
                } else {
                    navigate('/portal/login', { replace: true });
                }
            } catch (error: any) {
                console.error('Sign-in error:', error);
                setStatus('error');
                setErrorMessage(error?.message || 'Could not complete sign-in');
            }
        };
        signIn();
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center pt-[72px] px-4">
            <div className="max-w-md w-full">
                <InfoCard icon={FaShieldAlt} title="Signing You In" variant="primary" showInfoBadge={false}>
                    {status === 'signing-in' ? (
                        <div className="text-center py-6">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                            <Typography variant="body" className="text-gray-600">
                                Verifying your login link...
                            </Typography>
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <Typography variant="body" className="text-red-600 mb-4">
                                {errorMessage}
                            </Typography>
                            <button
                                onClick={() => navigate('/portal/login')}
                                className="bg-primary text-white px-6 py-2 rounded-full text-sm font-medium"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </InfoCard>
            </div>
        </div>
    );
};

export default BuyerAuthCallback;