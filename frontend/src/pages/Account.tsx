import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

interface Book {
  author : string;
  cover_url : string;
  description : string;
  id : number;
  isbn : string;
  original_price : number;
  price : number;
  rating : number;
  stock : number;
  title : string;
}

interface OrderItem {
  book: Book;
  quantity: number;
  total_price: number;
}

interface Order {
  id: number;
  created_at: string;
  address: string;
  status: string;
  order_items: OrderItem[];
}

const Account = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [mobile, setMobile] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/orders/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(res.data);
        
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
      if (user?.mobile) {
        setMobile(user.mobile);
      }
    };

    if (token){
       fetchOrders();
    }
  }, [token,user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

const handleSaveMobile = async () => {
  if (mobile.length !== 10) {
    alert("Enter a valid 10-digit mobile number.");
    return;
  }

  try {
    await axios.put("http://localhost:8000/api/me/", { mobile }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Mobile number updated!");
  } catch(err: any) {
    if(err.response.data.mobile?.length>0){
      alert(err.response.data.mobile[0]);
    }
    else{
      alert("Failed to update mobile number.");
    }
    
    if(user)
      setMobile(user.mobile);
  }
};

const togglePasswordsVisibility = (e:FormEvent)=>{
  e.preventDefault();
  const newPass = document.getElementById("newpass");
  const oldPass = document.getElementById("oldpass");
  if(newPass?.getAttribute("type")==="password" && oldPass?.getAttribute("type")==="password"){
    newPass.setAttribute("type","text");
    oldPass.setAttribute("type","text");
    e.currentTarget.textContent = "Hide Passwords";
  }
  else{
    newPass?.setAttribute("type","password");
    oldPass?.setAttribute("type","password");
    e.currentTarget.textContent = "Show Passwords";
  }


}


const handlePasswordChange = async () => {
  if (!oldPassword || !newPassword || !confirmPassword) {
    alert("Please enter all password fields.");
  } else if (newPassword !== confirmPassword) {
    alert("New passwords do not match.");
  } else if (newPassword.length < 8) {
    alert("New password must be at least 8 characters.");
  } else if(newPassword===oldPassword){
    alert("Old and New passwords are same.")
  } else {
    try {
      await axios.post("http://localhost:8000/auth/users/set_password/", {
        current_password: oldPassword,
        new_password : newPassword
      }
    , {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      if(err.response.data.current_password?.length>0){
        alert(err.response.data.current_password[0])
      }
      else if(err.response.data.new_password?.length>0){
        alert(err.response.data.new_password[0])
      }
      else{
        alert("Password change failed!!!");
      }
    }
  }
};


  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">👤 User Settings</h2>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-1">Name:</p>
            <p className="text-base font-medium text-gray-800">{user?.name}</p>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-1">Email:</p>
            <p className="text-base font-medium text-gray-800">{user?.email}</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-48">
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-80"
              />
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 md:w-36"
                onClick={handleSaveMobile}
              >
                Save
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">🔒 Change Password</h3>
            <div className="space-y-3">
              <input
                id="oldpass"
                type="password"
                placeholder="Current Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                id="newpass"
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button id="toggleBtn" onClick={togglePasswordsVisibility} className="text-xs pr-2 w-full text-blue-700 hover:underline text-right">Show Passwords</button>
              <button
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                onClick={handlePasswordChange}
              >
                Update Password
              </button>
            </div>
          </div>

          <button
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 w-full"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>

        {/* Orders */}
        <div className="bg-white shadow rounded-lg p-6 flex flex-col h-[625px]">
          <h2 className="text-xl font-semibold mb-4">📦 My Orders</h2>
          <div className="space-y-6 flex-1 overflow-y-auto pr-2">
            {orders.length > 0 ? (
              [...orders].sort((a:Order,b:Order)=> { return b.id - a.id}).map((order) => 
                <div key={order.id} className="border rounded-md p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="font-bold text-sm">Order ID : ORD00{order.id}</p>
                      <p className="text-sm text-gray-500">
                        Placed on: {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      📍 {order.address}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-3 mb-3">
                    {order.order_items.map((item) => 
                      <div
                        className="flex justify-between text-sm border-b pb-1"
                      >
                        <span>{item.book.title} x {item.quantity}</span>
                        <div className="font-medium text-green-600">
                          ₹ {item.book.price * item.quantity}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-xs">
                    Order Status : {
                      (order.status==='processing') ?
                      <b className="text-xs text-red-500">Pending</b>
                      : (order.status==='shipped') ? 
                      <b className="text-xs text-orange-400">Shipped</b> :
                      <b className="text-xs text-green-400">Delivered</b>
                    }
                  </div>
                  
                </div>
              ))
             : (
              <p className="text-sm text-gray-500">You have not placed any orders yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
