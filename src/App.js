import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Signup from './components/Signup';
import Report from './components/Report';
import CalendarComponent from './components/Calendar';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/calendar" element={<CalendarComponent/>}/>
        <Route path="/report" element={<Report />} />
      </Routes>
    </Router>
  );
};

export default App;
