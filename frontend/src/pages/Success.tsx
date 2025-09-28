import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart, CartItem } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { BirdIcon, BugIcon, DogIcon } from "lucide-react";

const Success = () => {
  const { cartItems, clearCart } = useCart();
  const [orderData, setOrderData] = useState<CartItem[]>([]);
  const { token } = useAuth();
  const navigate = useNavigate();
  const order_date = new Date();

  // const hasSubmitted = useRef(false);

  const handleGoToHome = () => {
    sessionStorage.removeItem("order_stored");
    // hasSubmitted.current = false;
    clearCart();
    localStorage.removeItem("cart_items");
    localStorage.removeItem("order_address");
    navigate("/");
  };

  useEffect(() => {
    const storeOrder = async () => {
      if (sessionStorage.getItem("order_stored") === "true") return;

      // hasSubmitted.current = true;
      sessionStorage.setItem("order_stored", "true");

      const itemsFromContext: CartItem[] =
        cartItems.length > 0
          ? cartItems
          : (() => {
            try {
              const parsed = JSON.parse(localStorage.getItem("cart_items") || "[]");
              return Array.isArray(parsed) ? parsed : [];
            } catch {
              return [];
            }
          })();

      if (itemsFromContext.length === 0) return;

      const address = localStorage.getItem("order_address") || "N/A";

      const payload = {
        cartItems: itemsFromContext.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
        totalPrice: itemsFromContext.reduce((sum, item) => sum + item.price * item.quantity, 0),
        address: address,
      };

      try {
        const res = await axios.post("http://localhost:8000/api/order/create/", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res.data);
        setOrderData(itemsFromContext);
        clearCart();
        localStorage.removeItem("cart_items");
        localStorage.removeItem("order_address");
      } catch (err: any) {
        console.error(err);
      }
    };

    if (token) {
      storeOrder();
    }
  }, [token, cartItems, clearCart]);



  return (
    <div className="text-center p-3 md:p-10 lg:px-80">
      {orderData.length > 0 ?
        <div>
          <h1 className="text-xl font-bold text-green-600 mb-4 md:text-3xl">✅ Payment Successful!</h1>
          <p className="text-gray-700 text-xs mb-3 md:text-lg">Thank you for your purchase. Your order has been placed.</p>
          <div className="border rounded-md p-4 hover:shadow-md transition">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-xs text-gray-500 md:text-sm">
                  Placed on: {order_date.getDate() + "-" + (order_date.getMonth() + 1) + "-" + order_date.getFullYear()}
                </p>
              </div>
              <div className="text-right text-xs text-gray-600 md:text-sm">
                📍 {localStorage.getItem("order_address")}
              </div>
            </div>

            <div className="space-y-2 mt-3 mb-3">
              {orderData ? orderData.map((item) =>
                <div
                  className="flex justify-between text-xs border-b pb-1 md:text-sm lg:text-lg"
                >
                  <span>{item.name} x {item.quantity}</span>
                  <div className="font-medium text-green-600 text-xs md:text-sm lg:text-lg">
                    ₹ {item.price * item.quantity}
                  </div>
                </div>
              ) : <div className="text-sm text-red-700">No order items in the cart.</div>}
            </div>
            <hr className="text-gray-600" />
            <div className="grid grid-cols-2 p-2 text-xs md:text-sm">
              <div>
                Order Status : {orderData ? "Pending" : "No orders in cart."}
              </div>
              <div>
                Total Price : ₹ {
                  orderData.reduce((sum, item) => sum + item.price * item.quantity, 0)
                }
              </div>
            </div>
          </div>
          <button
            onClick={handleGoToHome}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
        : 
        <div className="text-4xl font-bold flex justify-center mt-20 animate-bounce">
          {/* <div className="">.</div>
          <div className="">.</div>
          <div className="">.</div> */}
          <BirdIcon/>&nbsp;<BugIcon/>&nbsp;<DogIcon/>
        </div>
        
      }
    </div>
  );
};

export default Success;
