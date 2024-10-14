// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EventManager from "./components/EventManager";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<EventManager />} />
    </Routes>
  </Router>
);

export default App;
