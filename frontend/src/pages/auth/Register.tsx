import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    cpassword: '',
  });

  const [error, setError] = useState('');

  const validateData = () => {
    const { name, email, mobile, password, cpassword } = formData;
    if (!name || !email || !mobile || !password || !cpassword) {
      setError('All fields are required.');
      return false;
    }
    if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
      setError('Mobile number must be 10 digits.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format.');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return false;
    }
    if (password !== cpassword) {
      setError('Passwords do not match.');
      return false;
    }
    setError('');
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateData()) return;

    try {
      await register({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
      })
      alert("Registration Successfull!!!");
      navigate("/login");
    } catch (err: any) {
      // console.log(err);
      if(err.response.data.password?.length>0){
        setError(err.response.data.password[0]);
      }
      else if(err.response.data.mobile?.length>0){
        setError(err.response.data.mobile[0]);
      }
      else if(err.response.data.email?.length>0){
        setError(err.response.data.email[0]);
      }
      else{
        setError("Registration Failed!!!");
      }
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
    <div className="flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create an Account</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-xs">
            {error.toLocaleUpperCase()}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@mail.com"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="xxxxxxxxxx"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className='relative w-full'>
            <div className='w-full'>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            </div>
            <button className='text-purple-500 hover:underline text-xs absolute right-4  top-1/2 md:text-sm' onClick={toggleVisibility}>Show</button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              id="cpassword"
              type="password"
              name="cpassword"
              value={formData.cpassword}
              onChange={handleChange}
              placeholder="********"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
