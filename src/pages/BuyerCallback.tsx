import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { completeMagicLink } from '@/services/buyerAuth';
import { Typography } from '@/components/Typography/Typography';
import { InfoCard } from '@/components/InfoCard/InfoCard';
import { FaShieldAlt, FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const BuyerCallback: React.FC = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [redirect, setRedirect] = useState<string>('/portal');
    const [message, setMessage] = useState<string>('Signing you in…');

    useEffect(() => {
        completeMagicLink()
            .then((result) => {
                if (!result) {
                    setStatus('error');
                    setMessage('This link is invalid or has expired. Please request a new one.');
                    return;
                }

                setStatus('success');
                setRedirect(result.redirect);
                setMessage(
                    result.redirect === '/admin/buyers'
                        ? 'Welcome, Admin. Redirecting to your dashboard…'
                        : 'Welcome back. Redirecting to your buyer portal…'
                );

                // Give the UI a moment to show the success state
                setTimeout(() => {
                    navigate(result.redirect, { replace: true });
                }, 900);
            })
            .catch((err) => {
                console.error('Magic link failed:', err);
                setStatus('error');
                setMessage(err?.message || 'Could not complete sign-in. Please try again.');
            });
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center pt-[72px] px-4">
            <div className="max-w-md w-full">
                <Link
                    to="/portal/login"
                    className="inline-flex items-center gap-2 text-primary hover:text-accent mb-6 text-sm"
                >
                    <FaArrowLeft className="text-xs" /> Back to Login
                </Link>

                <InfoCard
                    icon={FaShieldAlt}
                    title="Signing You In"
                    subtitle="Please wait while we verify your magic link."
                    variant="primary"
                    showInfoBadge={false}
                >
                    <div className="py-6 flex flex-col items-center text-center">
                        {status === 'loading' && (
                            <>
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
                                <Typography variant="body" className="text-gray-600">
                                    {message}
                                </Typography>
                            </>
                        )}

                        {status === 'success' && (
                            <>
                                <FaCheckCircle className="text-green-500 text-4xl mb-3" />
                                <Typography variant="body" className="text-gray-700 mb-1">
                                    {message}
                                </Typography>
                                <Typography variant="small" className="text-gray-400 text-xs">
                                    {redirect === '/admin/buyers' ? 'Admin Panel' : 'Buyer Portal'}
                                </Typography>
                            </>
                        )}

                        {status === 'error' && (
                            <>
                                <FaExclamationTriangle className="text-red-500 text-4xl mb-3" />
                                <Typography variant="body" className="text-gray-700 mb-4">
                                    {message}
                                </Typography>
                                <Link
                                    to="/portal/login"
                                    className="bg-primary text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-dark-orange transition"
                                >
                                    Back to Login
                                </Link>
                            </>
                        )}
                    </div>
                </InfoCard>
            </div>
        </div>
    );
};

export default BuyerCallback;