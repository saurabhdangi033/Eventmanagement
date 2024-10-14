import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CreateEvent from "./components/CreateEvent";
import ShowEvents from "./components/ShowEvents";
import "./App.css"; // Optional, for styling

const App = () => {
  return (
    <Router>
      <div className="navbar">
        <h1 className="logo">Event Manager</h1>
        <nav>
          <Link to="/">Create Event</Link>
          <Link to="/show-events">Show Events</Link>
        </nav>
      </div>

      <Routes>
        <Route path="/" element={<CreateEvent />} />
        <Route path="/show-events" element={<ShowEvents />} />
      </Routes>
    </Router>
  );
};

export default App;
