'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';

type ShippingDetails = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address1: string;
    address2?: string;
    city: string;
    postcode: string;
};

type PaymentDetails = {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
};

export default function CheckoutPage() {
    const { user } = useAuth();
    const { items, totalPrice, clearCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address1: user?.address1 || '',
        address2: user?.address2 || '',
        city: user?.city || '',
        postcode: user?.postcode || '',
    });
    const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: ''
    });
    const [currentStep, setCurrentStep] = useState<'shipping' | 'payment'>('shipping');

    useEffect(() => {
        if (!user) {
            sessionStorage.setItem('redirectAfterAuth', '/checkout');
            router.push('/auth');
            return;
        }

        if (items.length === 0) {
            router.push('/cart');
        }
    }, [user, items, router]);

    // Format card number with spaces
    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    // Format expiry date
    const formatExpiryDate = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
        }
        return v;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user) {
            setError('Please log in to complete your order');
            sessionStorage.setItem('redirectAfterAuth', '/checkout');
            router.push('/auth');
            return;
        }

        if (currentStep === 'shipping') {
            setCurrentStep('payment');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    items,
                    shippingDetails,
                    totalAmount: totalPrice,
                    paymentMethod: {
                        last4: paymentDetails.cardNumber.slice(-4),
                        brand: 'visa',
                    }
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 401) {
                    sessionStorage.setItem('redirectAfterAuth', '/checkout');
                    router.push('/auth');
                    return;
                }
                throw new Error(data.error);
            }

            clearCart();
            router.push(`/order-confirmation/${data.orderNumber}`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user || items.length === 0) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex justify-between mb-6">
                            <h2 className="text-2xl font-bold">
                                {currentStep === 'shipping' ? 'Shipping Details' : 'Payment Details'}
                            </h2>
                            <div className="flex items-center gap-2">
                                <div className={`h-3 w-3 rounded-full ${currentStep === 'shipping' ? 'bg-black' : 'bg-gray-300'}`} />
                                <div className={`h-3 w-3 rounded-full ${currentStep === 'payment' ? 'bg-black' : 'bg-gray-300'}`} />
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {currentStep === 'shipping' ? (
                                <>
                                    {/* Name Fields */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                value={shippingDetails.firstName}
                                                onChange={(e) => setShippingDetails(prev => ({
                                                    ...prev,
                                                    firstName: e.target.value
                                                }))}
                                                required
                                                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                value={shippingDetails.lastName}
                                                onChange={(e) => setShippingDetails(prev => ({
                                                    ...prev,
                                                    lastName: e.target.value
                                                }))}
                                                required
                                                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                                            />
                                        </div>
                                    </div>

                                    {/* Contact Fields */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={shippingDetails.email}
                                                onChange={(e) => setShippingDetails(prev => ({
                                                    ...prev,
                                                    email: e.target.value
                                                }))}
                                                required
                                                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Phone
                                            </label>
                                            <input
                                                type="tel"
                                                value={shippingDetails.phone}
                                                onChange={(e) => setShippingDetails(prev => ({
                                                    ...prev,
                                                    phone: e.target.value
                                                }))}
                                                required
                                                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                                            />
                                        </div>
                                    </div>

                                    {/* Address Fields */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Address Line 1
                                        </label>
                                        <input
                                            type="text"
                                            value={shippingDetails.address1}
                                            onChange={(e) => setShippingDetails(prev => ({
                                                ...prev,
                                                address1: e.target.value
                                            }))}
                                            required
                                            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Address Line 2 (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={shippingDetails.address2}
                                            onChange={(e) => setShippingDetails(prev => ({
                                                ...prev,
                                                address2: e.target.value
                                            }))}
                                            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                value={shippingDetails.city}
                                                onChange={(e) => setShippingDetails(prev => ({
                                                    ...prev,
                                                    city: e.target.value
                                                }))}
                                                required
                                                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Postcode
                                            </label>
                                            <input
                                                type="text"
                                                value={shippingDetails.postcode}
                                                onChange={(e) => setShippingDetails(prev => ({
                                                    ...prev,
                                                    postcode: e.target.value
                                                }))}
                                                required
                                                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Cardholder Name
                                        </label>
                                        <input
                                            type="text"
                                            value={paymentDetails.cardholderName}
                                            onChange={(e) => setPaymentDetails(prev => ({
                                                ...prev,
                                                cardholderName: e.target.value
                                            }))}
                                            required
                                            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Card Number
                                        </label>
                                        <input
                                            type="text"
                                            value={paymentDetails.cardNumber}
                                            onChange={(e) => setPaymentDetails(prev => ({
                                                ...prev,
                                                cardNumber: formatCardNumber(e.target.value)
                                            }))}
                                            maxLength={19}
                                            required
                                            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Expiry Date (MM/YY)
                                            </label>
                                            <input
                                                type="text"
                                                value={paymentDetails.expiryDate}
                                                onChange={(e) => setPaymentDetails(prev => ({
                                                    ...prev,
                                                    expiryDate: formatExpiryDate(e.target.value)
                                                }))}
                                                maxLength={5}
                                                required
                                                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                CVV
                                            </label>
                                            <input
                                                type="text"
                                                value={paymentDetails.cvv}
                                                onChange={(e) => setPaymentDetails(prev => ({
                                                    ...prev,
                                                    cvv: e.target.value.replace(/\D/g, '').slice(0, 3)
                                                }))}
                                                maxLength={3}
                                                required
                                                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {error && (
                                <div className="text-red-500 text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="flex justify-between">
                                {currentStep === 'payment' && (
                                    <button
                                        type="button"
                                        onClick={() => setCurrentStep('shipping')}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-900"
                                    >
                                        Back
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="ml-auto px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : currentStep === 'shipping' ? 'Continue to Payment' : 'Place Order'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4">
                                    <div className="relative h-20 w-20 flex-shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover rounded-md"
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-gray-500">
                                            {item.quantity} × £{item.price.toFixed(2)}
                                        </p>
                                    </div>
                                    <p className="font-medium">
                                        £{(item.quantity * item.price).toFixed(2)}
                                    </p>
                                </div>
                            ))}

                            <div className="border-t pt-4 mt-4">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span>£{totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm mt-2">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg mt-4">
                                    <span>Total</span>
                                    <span>£{totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 