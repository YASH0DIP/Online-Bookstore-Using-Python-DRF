import CheckoutButton from "../stripe/CheckoutButton";
import { useCart } from "../context/CartContext";
import { PlusIcon, MinusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cartItems, removeFromCart, incrementItem, decrementItem } = useCart();
  const { token } = useAuth();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const [address,setAddress] = useState("");

  const fetchLatestAddress = async ()=>{
      await axios.get("http://localhost:8000/api/order/latest/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res)=>{
        // console.log(res.data);
        localStorage.setItem("order_address",res.data.address);
        setAddress(res.data.address);
      })
      .catch((err)=>{
        console.log(err);
      })  
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">🛒 Your Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
          <div className="space-y-6">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between border rounded-lg p-4 shadow-sm"
              >
                <div className="flex gap-4 items-center w-full">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover rounded"
                  />
                  <div className="flex flex-col w-full">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500 italic">{item.author}</p>
                    <div className="flex items-center text-yellow-500 text-sm mb-2">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <span key={i}>⭐</span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-700 mb-1">
                      ₹{item.price} × {item.quantity}
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <button
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                        onClick={() => decrementItem(item.id)}
                      >
                        <MinusIcon className="w-4 h-4" />
                      </button>
                      <span className="px-2">{item.quantity}</span>
                      <button
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                        onClick={() => {
                          (item.stock===item.quantity) ?
                          alert("Only "+item.quantity+" books in the stock.")
                          : incrementItem(item.id)
                        }}
                      >
                        <PlusIcon className="w-4 h-4" />
                      </button>
                      <button
                        className="ml-auto text-red-600 hover:text-red-800"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
          <div className="mt-8 text-right text-lg font-bold text-gray-700">
            Total: ₹{total}
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
            <textarea
              required
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                localStorage.setItem("order_address", address);
              }}
              placeholder="Enter your full address here"
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              rows={2}
            />
          </div>
          <div className="mb-4">
            <input id="getaddress" type="checkbox" onChange={fetchLatestAddress}/>
            <label htmlFor="getaddress" className="font-medium">&nbsp;Same as last order</label> 
          </div>
          <div className="mt-6 flex justify-end">
            {total > 0 && address!=="" ?
              <CheckoutButton items={cartItems} />
              :
              <div className="mt-4">
              <Link
                to="/"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition duration-300"
              >
                Shop more
              </Link>
            </div>
            }
          </div>
    </div>
  );
};

export default Cart;
