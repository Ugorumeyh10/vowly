import React, { useState } from "react";
import { useAuth } from "./AuthContext";

function InputGroup({ id, label, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="block text-gray-700 font-medium mb-1">
        {label}
      </label>
      <input
        id={id}
        name={id}
        className="w-full border border-gray-300 rounded-md p-3 focus:ring-rose-500 focus:border-rose-500"
        {...props}
      />
    </div>
  );
}

function InviteGuestForm({ onGuestAdded }) {
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const { token } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch("https://vowly-backend.vowly.workers.dev/guests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: guestName, email: guestEmail }),
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to add guest. Please try again.");
      }
      setGuestName("");
      setGuestEmail("");
      onGuestAdded();
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-rose-800 mb-4">Invite a Guest</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
        <InputGroup
          id="guestName"
          label="Guest Name"
          type="text"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          placeholder="Enter guest name"
          required
        />
        <InputGroup
          id="guestEmail"
          label="Guest Email"
          type="email"
          value={guestEmail}
          onChange={(e) => setGuestEmail(e.target.value)}
          placeholder="Enter guest email"
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-rose-600 text-white px-4 py-2 rounded-md hover:bg-rose-700 transition duration-200 disabled:bg-gray-400"
        >
          {isSubmitting ? "Adding..." : "Add Guest"}
        </button>
      </form>
    </div>
  );
}

export default InviteGuestForm;