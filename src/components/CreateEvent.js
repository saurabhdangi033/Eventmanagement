import React, { useState } from "react";
import { databases } from "../AppwriteConfig";
import "./CreateEvent.css"; // Import the CSS file

const CreateEvent = () => {
  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    location: "",
    description: "",
  });

  const [message, setMessage] = useState(""); // Message state for notifications

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const addEvent = async (e) => {
    e.preventDefault();
    try {
      await databases.createDocument("event_DB", "events_DB", "unique()", newEvent);
      setNewEvent({ name: "", date: "", location: "", description: "" });
      setMessage("Event created successfully!"); // Success message
    } catch (error) {
      console.error("Error adding event:", error.message);
      setMessage(`Error: ${error.message}`); // Error message
    }

    // Clear the message after 3 seconds
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="create-event-container">
      <h2>Create New Event</h2>

      {/* Notification Message */}
      {message && <div className="notification">{message}</div>}

      <form onSubmit={addEvent}>
        <input
          type="text"
          name="name"
          placeholder="Event Name"
          value={newEvent.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="date"
          value={newEvent.date}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={newEvent.location}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={newEvent.description}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add Event</button>
      </form>
    </div>
  );
};

export default CreateEvent;
