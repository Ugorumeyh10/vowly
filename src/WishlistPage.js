import React, { useState } from 'react';

// Icons for the wishlist items
const GiftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H4.5A1.5 1.5 0 013 19.5V11.25m18 0A2.25 2.25 0 0018.75 9H5.25A2.25 2.25 0 003 11.25m18 0v-7.5a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 3.75v7.5m15-7.5a2.25 2.25 0 00-4.5 0v7.5a2.25 2.25 0 004.5 0v-7.5z" /></svg>;
const CashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v1.5m0 0v.75m0 0v.75m0 0v.75m0 0v.75m0 0v.75m0 0v.75m0 0v.75m0 0v.75m0 0v.75m0 0v.75m7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125H11.25m0 0v3.75m0 0h7.5m-7.5 0h-1.5m1.5 0v-3.75m0 0h-7.5a1.125 1.125 0 01-1.125-1.125v-1.5A1.125 1.125 0 013.75 6H4.5" /></svg>;

const wishlistItems = [
  { name: 'Air Fryer' },
  { name: 'Blender and Smoothie Juicer' },
  { name: 'Non-stick Pot Set' },
];

function WishlistPage() {
  const [copySuccess, setCopySuccess] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText('0114935651').then(() => {
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000); // Reset message after 2 seconds
    }, () => {
      setCopySuccess('Failed to copy');
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="bg-white/70 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-lg max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl text-rose-800 font-great-vibes text-center mb-8">Our Wishlist</h2>
        <p className="text-center text-gray-600 mb-12">
          Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a gift, we have prepared a small wishlist of items that would help us start our new life together.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Physical Gifts */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <GiftIcon />
              <h3 className="text-2xl font-semibold text-rose-700">Gift Ideas</h3>
            </div>
            <ul className="space-y-3 list-disc list-inside text-gray-700">
              {wishlistItems.map(item => <li key={item.name}>{item.name}</li>)}
            </ul>
          </div>

          {/* Cash Gifts */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <CashIcon />
              <h3 className="text-2xl font-semibold text-rose-700">Cash Gifts</h3>
            </div>
            <div className="bg-rose-50 p-6 rounded-lg border border-rose-200">
              <p className="text-gray-600 mb-4">For cash transfers, please use the details below.</p>
              <p className="font-semibold text-gray-800">OLORUNFEMI AYOBAMI AYOMIDE</p>
              <p className="text-gray-600">Sterling Bank</p>
              <div className="flex items-center space-x-4 mt-2">
                <p className="text-lg font-mono text-gray-800 tracking-wider">0114935651</p>
                <button
                  onClick={handleCopy}
                  className="bg-rose-200 text-rose-800 text-xs px-3 py-1 rounded-full hover:bg-rose-300 transition-colors"
                >
                  {copySuccess || 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WishlistPage;