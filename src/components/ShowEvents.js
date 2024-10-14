import React, { useEffect, useState } from "react";
import { databases } from "../AppwriteConfig";
import "./ShowEvents.css"; // Import CSS for styling

const ShowEvents = () => {
  const [events, setEvents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState("");
  const [eventData, setEventData] = useState({
    name: "",
    date: "",
    location: "",
    description: "",
    organizer: "",
    contact: "",
    ticketPrice: "",
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
      organizer: event.organizer,
      contact: event.contact,
      ticketPrice: event.ticketPrice,
    });
  };

  // Add or Update Event
  const saveEvent = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await databases.updateDocument("event_DB", "events_DB", editId, eventData);
        setMessage("Event updated successfully!");
      } else {
        await databases.createDocument("event_DB", "events_DB", "unique()", eventData);
        setMessage("Event created successfully!");
      }
      fetchEvents(); // Refresh the list
      resetForm();
    } catch (error) {
      setMessage(`Error: ${error.message}`);
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
    setEventData({
      name: "",
      date: "",
      location: "",
      description: "",
      organizer: "",
      contact: "",
      ticketPrice: "",
    });
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

      {/* Event Form */}
      <form onSubmit={saveEvent} className="event-form">
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
          placeholder="Organizer Name"
          value={eventData.organizer}
          onChange={handleInputChange}
          required
        />
        <input
          type="tel"
          name="contact"
          placeholder="Contact Info"
          value={eventData.contact}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="ticketPrice"
          placeholder="Ticket Price ($)"
          value={eventData.ticketPrice}
          onChange={handleInputChange}
          required
        />
        <button type="submit">{isEditing ? "Update Event" : "Add Event"}</button>
        {isEditing && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

      {/* Event List */}
      <ul className="events-list">
        {events.map((event) => (
          <li key={event.$id} className="event-item">
            <h3>{event.name}</h3>
            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
            <p>Location: {event.location}</p>
            <p>Description: {event.description}</p>
            <p>Organizer: {event.organizer}</p>
            <p>Contact: {event.contact}</p>
            <p>Ticket Price: ${event.ticketPrice}</p>
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
