import React, { useState, useEffect } from 'react';

function EditGuestModal({ guest, onSave, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (guest) {
      setName(guest.name);
      setEmail(guest.email);
      // Reset state when modal opens for a new guest
      setIsSaving(false);
      setError(null);
    }
  }, [guest]);

  if (!guest) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await onSave(guest.id, { name, email });
      onClose(); // Close modal on success
    } catch (err) {
      setError(err.message || "Failed to save. Please try again.");
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md text-gray-800">
        <h2 className="text-2xl font-bold text-rose-800 mb-4">Edit Guest</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-md">{error}</p>}
          <div>
            <label htmlFor="editGuestName" className="block text-sm font-medium text-gray-700">
              Guest Name
            </label>
            <input
              id="editGuestName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-3 shadow-sm focus:ring-rose-500 focus:border-rose-500"
              required
            />
          </div>
          <div>
            <label htmlFor="editGuestEmail" className="block text-sm font-medium text-gray-700">
              Guest Email
            </label>
            <input
              id="editGuestEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-3 shadow-sm focus:ring-rose-500 focus:border-rose-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-rose-600 text-white px-4 py-2 rounded-md hover:bg-rose-700 transition duration-200"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditGuestModal;