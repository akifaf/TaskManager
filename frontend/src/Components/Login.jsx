import React, { useState } from 'react';
import { loginUser } from '../axios/ApiServers';
import { Link, useNavigate } from 'react-router-dom';
import Layout from './Layout';
import Test from './Test'


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const userData = { email, password };

    try {
      const data = await loginUser(userData);
      if (data) {
        // Successful login, handle accordingly (e.g., redirect, store tokens)
        console.log("Login successful:", data);
        setLoading(false);
        navigate('/')
      } else {
        setError('Login failed. Please check your credentials.');
        setLoading(false);
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <Layout>
        <div  className="flex items-center justify-center min-h-screen">

    <div className="bg-white place-self-center outline outline-1 w-11/12 max-w-lg flex flex-col p-7 min-h-32 rounded-xl">
      {/* -------- title ------------ */}
      <h1 className="text-3xl font-semibold mb-6">Login</h1>

      {/* Display error if there is any */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* -------- login form ------------ */}
      <form onSubmit={handleSubmit}>
        {/* -------- email input ------------ */}
        <div className="flex items-center my-3 bg-gray-200 rounded-full">
          <input
            className="bg-transparent border-0 outline-none flex-1 h-14 pl-6 pr-2 placeholder:text-slate-600"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* -------- password input ------------ */}
        <div className="flex items-center my-3 bg-gray-200 rounded-full">
          <input
            className="bg-transparent border-0 outline-none flex-1 h-14 pl-6 pr-2 placeholder:text-slate-600"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* -------- submit button ------------ */}
        <div className="mt-6">
          <button
            className={`bg-blue-600 text-white w-full h-14 rounded-full text-xl font-semibold mb-4 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {/* -------- new user link ------------ */}
          <div className="text-center">
            <span>New User? </span>
            <Link to='/register/' ><span className="text-blue-600 cursor-pointer hover:underline">
              Register
            </span>
            </Link>
          </div>
        </div>
      </form>
    </div>
    </div>
    </Layout>
  );
}

export default Login;
