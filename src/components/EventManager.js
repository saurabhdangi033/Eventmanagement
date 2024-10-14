// src/components/EventManager.js
import React, { useEffect, useState } from "react";
import { databases } from "../AppwriteConfig";
import "./EventManager.css";

const EventManager = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    organizer: "",
    category: "",
    location: "",
    date: "",
    startTime: "",
    endTime: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

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
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const addEvent = async (e) => {
    e.preventDefault();
    try {
      await databases.createDocument("event_DB", "events_DB", "unique()", newEvent);
      fetchEvents();
      setNewEvent({
        name: "",
        description: "",
        organizer: "",
        category: "",
        location: "",
        date: "",
        startTime: "",
        endTime: "",
      });
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
    setNewEvent(event);
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

      {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

      {showCreateForm ? (
        <form onSubmit={isEditing ? updateEvent : addEvent}>
          <input type="text" name="name" placeholder="Event Name" value={newEvent.name} onChange={handleInputChange} required />
          <textarea name="description" placeholder="Description" value={newEvent.description} onChange={handleInputChange} required />
          <input type="text" name="organizer" placeholder="Organizer" value={newEvent.organizer} onChange={handleInputChange} required />
          <input type="text" name="category" placeholder="Category" value={newEvent.category} onChange={handleInputChange} required />
          <input type="text" name="location" placeholder="Location" value={newEvent.location} onChange={handleInputChange} required />
          <input type="date" name="date" value={newEvent.date} onChange={handleInputChange} required />
          <input type="time" name="startTime" value={newEvent.startTime} onChange={handleInputChange} required />
          <input type="time" name="endTime" value={newEvent.endTime} onChange={handleInputChange} required />
          <button type="submit">{isEditing ? "Update Event" : "Add Event"}</button>
        </form>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event.$id}>
              <h2>{event.name}</h2>
              <p>{event.description}</p>
              <p>Organizer: {event.organizer}</p>
              <p>Category: {event.category}</p>
              <p>Location: {event.location}</p>
              <p>Date: {new Date(event.date).toLocaleDateString()}</p>
              <p>
                Time: {event.startTime} - {event.endTime}
              </p>
              
              <button onClick={() => startEdit(event)}>Edit</button>
              <button onClick={() => deleteEvent(event.$id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventManager;
