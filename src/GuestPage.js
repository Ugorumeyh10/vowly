import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import EventInfo from './EventInfo';
import InviteGuestForm from './InviteGuestForm';

function GuestPage() {
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [guestList, setGuestList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login'); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, navigate]);

  const fetchGuests = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://vowly-backend.vowly.workers.dev/guests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch guests');
      const data = await response.json();
      setGuestList(data);
    } catch (error) {
      console.error('Error fetching guests:', error);
      setError('Could not load guest list. Please try refreshing the page.');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchGuests();
    }
  }, [isAuthenticated, fetchGuests]);

  const handleDeleteGuest = useCallback(
    async (guestId) => {
      setActionError(null);
      try {
        if (!window.confirm('Are you sure you want to delete this guest?')) return;
        const response = await fetch(`https://vowly-backend.vowly.workers.dev/guests/${guestId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Failed to delete guest. Please try again.");
        }
        fetchGuests(); // Refresh the list on success
      } catch (error) {
        console.error('Error deleting guest:', error);
        setActionError(error.message);
      }
    },
    [token, fetchGuests]
  );

  const handleUpdateGuest = useCallback(
    async (guestId, updatedData) => {
      try {
        await fetch(`https://vowly-backend.vowly.workers.dev/guests/${guestId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(updatedData),
        });
        fetchGuests();
      } catch (error) {
        console.error('Error updating guest:', error);
        throw error;
      }
    },
    [token, fetchGuests]
  );

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert"><span className="block sm:inline">{error}</span></div>}
      {actionError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert"><span className="block sm:inline">{actionError}</span></div>}
      <InviteGuestForm onGuestAdded={fetchGuests} />
      {isLoading ? (
        <div className="text-center p-10"><p className="text-gray-500">Loading guest list...</p></div>
      ) : (
        <EventInfo guestList={guestList} onUpdateGuest={handleUpdateGuest} onDeleteGuest={handleDeleteGuest} />
      )}
    </div>
  );
}

export default GuestPage;