// src/components/EventManager.js
import React, { useEffect, useState } from "react";
import { databases } from "../AppwriteConfig";
import "./EventManager.css";

const EventManager = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    location: "",
    description: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" }); // Message state

  // Fetch all events from the Appwrite database
  const fetchEvents = async () => {
    try {
      const response = await databases.listDocuments("event_DB", "events_DB");
      setEvents(response.documents);
    } catch (error) {
      console.error("Error fetching events:", error.message);
      showMessage("Failed to fetch events!", "error");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000); // Hide after 3 seconds
  };

  const addEvent = async (e) => {
    e.preventDefault();
    try {
      await databases.createDocument("event_DB", "events_DB", "unique()", newEvent);
      fetchEvents();
      setNewEvent({ name: "", date: "", location: "", description: "" });
      showMessage("Event added successfully!", "success");
    } catch (error) {
      console.error("Error adding event:", error.message);
      showMessage("Failed to add event!", "error");
    }
  };

  const updateEvent = async (e) => {
    e.preventDefault();
    try {
      await databases.updateDocument("event_DB", "events_DB", editId, newEvent);
      fetchEvents();
      setIsEditing(false);
      setNewEvent({ name: "", date: "", location: "", description: "" });
      showMessage("Event updated successfully!", "success");
    } catch (error) {
      console.error("Error updating event:", error.message);
      showMessage("Failed to update event!", "error");
    }
  };

  const deleteEvent = async (id) => {
    try {
      await databases.deleteDocument("event_DB", "events_DB", id);
      fetchEvents();
      showMessage("Event deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting event:", error.message);
      showMessage("Failed to delete event!", "error");
    }
  };

  const startEdit = (event) => {
    setIsEditing(true);
    setEditId(event.$id);
    setNewEvent({
      name: event.name,
      date: event.date,
      location: event.location,
      description: event.description,
    });
    setShowCreateForm(true);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="event-manager-container">
      <nav className="navbar">
        <button onClick={() => setShowCreateForm(true)}>Create Event</button>
        <button onClick={() => setShowCreateForm(false)}>Show Events</button>
      </nav>

      {/* Display Messages */}
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {showCreateForm ? (
        <div className="form-container">
          <h1>{isEditing ? "Update Event" : "Create Event"}</h1>
          <form onSubmit={isEditing ? updateEvent : addEvent}>
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
            <button type="submit">{isEditing ? "Update Event" : "Add Event"}</button>
          </form>
        </div>
      ) : (
        <div className="event-list">
          <h1>Events List</h1>
          <ul>
            {events.map((event) => (
              <li key={event.$id}>
                <h2>{event.name}</h2>
                <p>{new Date(event.date).toLocaleDateString()}</p>
                <p>{event.location}</p>
                <p>{event.description}</p>
                <button onClick={() => startEdit(event)}>Edit</button>
                <button onClick={() => deleteEvent(event.$id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EventManager;
