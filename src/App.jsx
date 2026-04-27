// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import SignIn from './pages/SignIn.jsx';
import Attendance from './pages/Attendance.jsx';
import Phonebook from './pages/Phonebook.jsx';
import ChangeClass from './pages/ChangeClass.jsx';
import Navbar from './myComponents/Navbar.jsx'; // Optional

export default function App() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/attendance" element={<Attendance />} />
                    <Route path="/phonebook" element={<Phonebook />} />
                    <Route path="/change-class" element={<ChangeClass />} />
                </Routes>
            </main>
        </div>
    );
}
