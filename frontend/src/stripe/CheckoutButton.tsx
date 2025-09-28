import React from "react";
import { useStripe } from "@stripe/react-stripe-js";
import axios from "axios";

interface Item {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Props {
  items: Item[];
}

const CheckoutButton = ({ items }: Props) => {
  const stripe = useStripe();

  const handleClick = async () => {
    if (!stripe) return;

    localStorage.setItem("cart_items", JSON.stringify(items));

    const response = await axios.post("http://localhost:8000/api/create-checkout-session/", items, {
      headers: { "Content-Type": "application/json", },
    });

    const session = response.data;

    if (!session.id) {
      console.error("Stripe session ID missing:", session);
      return;
    }

    sessionStorage.removeItem("order_stored");

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      alert(result.error.message);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      Proceed to Payment
    </button>
  );
};

export default CheckoutButton;
