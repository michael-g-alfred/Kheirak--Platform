import React, { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { toast } from "react-hot-toast";
import FormLayout from "../layouts/FormLayout";
import SubmitButton from "./SubmitButton";
import CloseIcon from "../icons/CloseIcon";

const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#1f2937",
      fontFamily: "system-ui, -apple-system, sans-serif",
      "::placeholder": {
        color: "#6b7280",
      },
      iconColor: "#6b7280",
    },
    invalid: {
      color: "#dc2626",
      iconColor: "#dc2626",
    },
  },
  hidePostalCode: true,
};

export default function PaymentModal({
  amount,
  currency = "egp",
  customerInfo,
  onSuccess,
  onError,
  onClose,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [cardErrors, setCardErrors] = useState({});

  useEffect(() => {
    // Focus on card number when modal opens
    const cardNumberElement = elements?.getElement(CardNumberElement);
    if (cardNumberElement) {
      setTimeout(() => cardNumberElement.focus(), 100);
    }
  }, [elements]);

  const handleCardElementChange = (elementType, event) => {
    setCardErrors(prev => ({
      ...prev,
      [elementType]: event.error ? event.error.message : null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe لم يتم تحميل");
      return;
    }

    setIsLoading(true);

    try {
      // Get card element
      const cardNumberElement = elements.getElement(CardNumberElement);

      if (!cardNumberElement) {
        throw new Error("Card element not found");
      }

      // Create payment method
      const { error: methodError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumberElement,
        billing_details: {
          name: `${customerInfo.firstName} ${customerInfo.lastName}`,
          address: {
            country: customerInfo.country === "مصر" ? "EG" : "US", // Map Arabic to country codes
          },
        },
      });

      if (methodError) {
        throw methodError;
      }

      // Simulate payment processing (In real app, you'd send to your backend)
      // This is just for demo purposes
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate success
      const mockPaymentResult = {
        paymentIntent: {
          id: `pi_${Math.random().toString(36).substr(2, 9)}`,
          status: "succeeded",
          amount: amount * 100, // Stripe uses cents
          currency: currency,
        },
        paymentMethod: paymentMethod,
      };

      // Call success handler
      onSuccess(mockPaymentResult);

    } catch (error) {
      console.error("Payment error:", error);
      onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('ar-EG', {
      style: 'currency',
      currency: 'EGP',
    }).format(amount);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-950/90 backdrop-blur-md z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
    >
      <div className="relative max-w-lg w-full mx-4">
        <FormLayout
          formTitle={
            <div className="flex items-center justify-between w-full">
              <span
                id="payment-modal-title"
                className="text-[var(--color-primary-base)] text-xl font-bold"
              >
                إتمام الدفع
              </span>
              <button
                onClick={onClose}
                className="text-[var(--color-bg-muted-text)] hover:text-[var(--color-primary-base)] transition-colors"
                aria-label="إغلاق"
              >
                <CloseIcon />
              </button>
            </div>
          }
        >
          <div className="text-center mb-6" dir="rtl">
            <p className="text-[var(--color-bg-text-dark)] mb-2">
              المبلغ المستحق
            </p>
            <p className="text-2xl font-bold text-[var(--color-primary-base)]">
              {formatAmount(amount)}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
            {/* Card Number */}
            <div>
              <label className="block mb-2 text-[var(--color-primary-base)] font-medium">
                رقم البطاقة
              </label>
              <div className="p-3 border rounded-lg border-[var(--color-bg-divider)] bg-[var(--color-bg-base)] focus-within:ring-2 focus-within:ring-[var(--color-primary-base)] focus-within:border-transparent">
                <CardNumberElement
                  options={cardElementOptions}
                  onChange={(e) => handleCardElementChange('cardNumber', e)}
                />
              </div>
              {cardErrors.cardNumber && (
                <p className="text-[var(--color-danger-light)] mt-1 text-sm">
                  {cardErrors.cardNumber}
                </p>
              )}
            </div>

            {/* Expiry and CVC */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-[var(--color-primary-base)] font-medium">
                  تاريخ الانتهاء
                </label>
                <div className="p-3 border rounded-lg border-[var(--color-bg-divider)] bg-[var(--color-bg-base)] focus-within:ring-2 focus-within:ring-[var(--color-primary-base)] focus-within:border-transparent">
                  <CardExpiryElement
                    options={cardElementOptions}
                    onChange={(e) => handleCardElementChange('cardExpiry', e)}
                  />
                </div>
                {cardErrors.cardExpiry && (
                  <p className="text-[var(--color-danger-light)] mt-1 text-sm">
                    {cardErrors.cardExpiry}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-[var(--color-primary-base)] font-medium">
                  رمز الأمان
                </label>
                <div className="p-3 border rounded-lg border-[var(--color-bg-divider)] bg-[var(--color-bg-base)] focus-within:ring-2 focus-within:ring-[var(--color-primary-base)] focus-within:border-transparent">
                  <CardCvcElement
                    options={cardElementOptions}
                    onChange={(e) => handleCardElementChange('cardCvc', e)}
                  />
                </div>
                {cardErrors.cardCvc && (
                  <p className="text-[var(--color-danger-light)] mt-1 text-sm">
                    {cardErrors.cardCvc}
                  </p>
                )}
              </div>
            </div>

            {/* Customer Info Display */}
            <div className="bg-[var(--color-bg-surface)] p-4 rounded-lg border border-[var(--color-bg-divider)]">
              <h4 className="font-medium text-[var(--color-primary-base)] mb-2">
                بيانات العميل
              </h4>
              <p className="text-[var(--color-bg-text-dark)] text-sm">
                <span className="font-medium">الاسم:</span> {customerInfo.firstName} {customerInfo.lastName}
              </p>
              <p className="text-[var(--color-bg-text-dark)] text-sm">
                <span className="font-medium">الدولة:</span> {customerInfo.country}
              </p>
            </div>

            {/* Security Notice */}
            <div className="text-center text-xs text-[var(--color-bg-muted-text)]">
              🔒 معاملتك محمية بتقنية التشفير المتقدمة
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-[var(--color-bg-divider)] text-[var(--color-bg-text-dark)] rounded-lg hover:bg-[var(--color-bg-surface)] transition-colors"
                disabled={isLoading}
              >
                إلغاء
              </button>
              <div className="flex-2">
                <SubmitButton
                  buttonTitle={isLoading ? "جاري المعالجة..." : `ادفع ${formatAmount(amount)}`}
                  isLoading={isLoading}
                  disabled={!stripe || isLoading}
                />
              </div>
            </div>
          </form>
        </FormLayout>
      </div>
    </div>
  );
}
