import React, { useEffect, useState } from "react";
import { databases } from "../AppwriteConfig";
import "./ShowEvents.css"; // Import CSS

const ShowEvents = () => {
  const [events, setEvents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState("");
  const [eventData, setEventData] = useState({
    name: "",
    date: "",
    location: "",
    description: "",
    organizer: "", // New field
    contact: "",   // New field
  });
  const [message, setMessage] = useState(""); // Store success/error messages

  // Fetch Events from Appwrite
  const fetchEvents = async () => {
    try {
      const response = await databases.listDocuments("event_DB", "events_DB");
      setEvents(response.documents);
    } catch (error) {
      setMessage(`Error fetching events: ${error.message}`);
    }
  };

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  // Start Edit Process
  const startEdit = (event) => {
    setIsEditing(true);
    setEditId(event.$id);
    setEventData({
      name: event.name,
      date: event.date,
      location: event.location,
      description: event.description,
      organizer: event.organizer, // Populate new field
      contact: event.contact,     // Populate new field
    });
  };

  // Update Event
  const updateEvent = async (e) => {
    e.preventDefault();
    try {
      await databases.updateDocument("event_DB", "events_DB", editId, eventData);
      setMessage("Event updated successfully!");
      fetchEvents(); // Refresh the list
      setIsEditing(false);
      resetForm();
    } catch (error) {
      setMessage(`Error updating event: ${error.message}`);
    }
  };

  // Delete Event
  const deleteEvent = async (id) => {
    try {
      await databases.deleteDocument("event_DB", "events_DB", id);
      setMessage("Event deleted successfully!");
      fetchEvents(); // Refresh the list
    } catch (error) {
      setMessage(`Error deleting event: ${error.message}`);
    }
  };

  // Reset Form and Messages
  const resetForm = () => {
    setEventData({ name: "", date: "", location: "", description: "", organizer: "", contact: "" });
    setEditId("");
    setIsEditing(false);
    setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="show-events-container">
      <h2>{isEditing ? "Edit Event" : "All Events"}</h2>

      {/* Display Success/Error Messages */}
      {message && <div className="notification">{message}</div>}

      {/* Edit Form */}
      {isEditing && (
        <form onSubmit={updateEvent} className="edit-form">
          <input
            type="text"
            name="name"
            placeholder="Event Name"
            value={eventData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="date"
            name="date"
            value={eventData.date}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={eventData.location}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={eventData.description}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="organizer"
            placeholder="Organizer"
            value={eventData.organizer}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="contact"
            placeholder="Contact Info"
            value={eventData.contact}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Update Event</button>
          <button type="button" onClick={resetForm}>Cancel</button>
        </form>
      )}

      {/* Event List */}
      <ul className="events-list">
        {events.map((event) => (
          <li key={event.$id} className="event-item">
            <h3>{event.name}</h3>
            <p>{new Date(event.date).toLocaleDateString()}</p>
            <p>{event.location}</p>
            <p>{event.description}</p>
            <p><strong>Organizer:</strong> {event.organizer}</p> {/* New field */}
            <p><strong>Contact:</strong> {event.contact}</p> {/* New field */}
            <div className="button-group">
              <button onClick={() => startEdit(event)}>Edit</button>
              <button onClick={() => deleteEvent(event.$id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShowEvents;
