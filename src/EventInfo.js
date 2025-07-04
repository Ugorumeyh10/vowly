import React, { useState } from "react";
import EditGuestModal from "./EditGuestModal";

function EventInfo({ guestList, onUpdateGuest, onDeleteGuest }) {
  const [editingGuest, setEditingGuest] = useState(null);

  return (
    <>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-rose-800 mb-4">Guest List</h2>
        {guestList.length > 0 ? (
          <ul className="space-y-2">
            {guestList.map((guest) => (
              <li key={guest.id} className="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between text-gray-700 p-3 rounded-md hover:bg-gray-50 transition-colors">
                <span className="mb-2 sm:mb-0">
                  {guest.name} ({guest.email})
                </span>
                <div className="flex items-center space-x-3 self-end sm:self-auto">
                  <button
                    onClick={() => setEditingGuest(guest)}
                    className="text-rose-500 hover:text-rose-700 text-sm font-medium"
                    aria-label={`Edit ${guest.name}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteGuest(guest.id)}
                    className="bg-red-100 text-red-700 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                    aria-label={`Delete ${guest.name}`}
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No guests have been added yet.</p>
        )}
      </div>
      <EditGuestModal
        guest={editingGuest}
        onSave={onUpdateGuest}
        onClose={() => setEditingGuest(null)}
      />
    </>
  );
}

export default EventInfo;