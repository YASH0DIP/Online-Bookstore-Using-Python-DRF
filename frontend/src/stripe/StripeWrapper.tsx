import React, { ReactNode } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51RoGqa1T1jFA0VlnH5BMyRJaos6kdQnWzs7ytOztEORycUWH9AdmaWfoQJJV82shhPElCeBhbWUJjDxni0QVCzzQ00Evfk6I3F");

interface Props {
  children: ReactNode;
}

const StripeWrapper = ({ children }: Props) => {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
};

export default StripeWrapper;

