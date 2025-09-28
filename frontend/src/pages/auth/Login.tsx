import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      // localStorage.removeItem("cart_items");
      navigate('/');
    } catch (err: any) {
      setError('Invalid email or password');
    }
  };

  const toggleVisibility = (e:React.FormEvent)=>{
    e.preventDefault();
    let passwordInput = document.getElementById("password") || null;
    if(passwordInput?.getAttribute("type")==="password"){
      passwordInput?.setAttribute("type","text");
      e.currentTarget.textContent = "Hide"
    }
    else{
     passwordInput?.setAttribute("type","password"); 
     e.currentTarget.textContent = "Show"
    }
  }

  return (
    <div className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-10">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login to BookStore</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-xs">
            {error.toLocaleUpperCase()}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="user@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className='relative w-full'>
            <div className='w-full'>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button className='text-blue-500 hover:underline text-xs absolute right-4 top-1/2 md:text-sm' onClick={toggleVisibility}>Show</button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Don’t have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
