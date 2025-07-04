import React, { useState } from 'react';

function HomePage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, sending, sent, error
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setMessage('');

    try {
      const response = await fetch('https://vowly-backend.vowly.workers.dev/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to send login link.');

      setStatus('sent');
      setMessage(data.message);
    } catch (err) {
      setStatus('error');
      setMessage(err.message);
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* 1. Background Image */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center z-0"
        style={{ backgroundImage: "url(/img/IMG_6502.JPG)" }}
      ></div>

      {/* 2. Dark Overlay for Readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10"></div>

      {/* 3. Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-white p-4">
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-4" style={{ fontFamily: "'Great Vibes', cursive" }}>Vowly</h1>
        <p className="text-xl mb-12 text-gray-200">Your beautiful journey, perfectly planned.</p>

        {status === 'sent' ? (
          <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl p-8 text-center border border-white border-opacity-20 shadow-lg max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Check Your Email!</h2>
            <p className="text-gray-200">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 text-center border border-white border-opacity-20 shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Sign In or Sign Up</h2>
            <p className="mb-6 text-gray-300">Enter your email to receive a magic login link.</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full bg-white bg-opacity-20 border border-transparent rounded-md p-3 mb-4 text-white placeholder-gray-300 focus:ring-2 focus:ring-rose-400 focus:outline-none"
              required
            />
            <button type="submit" disabled={status === 'sending'} className="w-full bg-rose-600 text-white px-6 py-3 rounded-md hover:bg-rose-700 transition duration-300 font-bold disabled:bg-gray-500">
              {status === 'sending' ? 'Sending...' : 'Send Login Link'}
            </button>
            {status === 'error' && <p className="text-red-400 mt-4">{message}</p>}
          </form>
        )}
      </div>
    </div>
  );
}

export default HomePage;