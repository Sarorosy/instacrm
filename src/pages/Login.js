import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Frown, CheckCircle } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import beepSound from '../asset/beep.mp3.mp3';


const Login = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const correctPin = '5444'; // The hardcoded pin

  const playBeepSound = () => {
    const audio = new Audio(beepSound);
    audio.play();
  };


  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      if (pin === correctPin) {
        toast.success('Login successful!');
        sessionStorage.setItem('authenticated', true);
        sessionStorage.setItem('name', 'Admin');
        sessionStorage.setItem('username', 'admin');
        sessionStorage.setItem('email_id', 'accounts@redmarkediting.com');
        sessionStorage.setItem('user_type', 'admin');
        sessionStorage.setItem('category', 'PhD');
        document.getElementById('loginBack').style.background = "#98fb98";
        setTimeout(()=> {
            navigate('/');
        },1000)
        
      } else {
        setError('Incorrect PIN. Please try again.');
      }
    }, 1000); // Simulate a delay
  };

  const handleButtonClick = (digit) => {
    if (pin.length < 4) {
      setPin(pin + digit);
      playBeepSound();
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    playBeepSound();
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-indigo-50" id="loginBack">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        {error && (
          <div className="text-red-500 text-sm text-center mb-4 bg-red-100 px-3 py-2 rounded flex items-center justify-center">
            {error} <Frown className="ml-2" />
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label htmlFor="pin" className="block text-sm font-medium text-gray-600">
              Enter PIN
            </label>
            <input
              type="password"
              id="pin"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="mt-1 w-full p-2 border text-center text-lg rounded-md focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '←'].map((key, index) => (
              <button
                key={index}
                type="button"
                className={`p-2 text-lg font-bold border rounded-md bg-gray-100 hover:bg-gray-200 ${
                  key === '' ? 'cursor-default' : ''
                }`}
                onClick={() =>
                  key === '←' ? handleDelete() : key !== '' && handleButtonClick(key)
                }
                disabled={key === ''}
              >
                {key}
              </button>
            ))}
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 cursor-pointer ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading || pin.length !== 4}
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>
        {pin === correctPin && !error && (
          <div className="text-green-500 text-sm text-center mt-4 bg-green-100 px-3 py-1 rounded flex items-center justify-center">
            PIN Correct! <CheckCircle className="ml-2" />
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
