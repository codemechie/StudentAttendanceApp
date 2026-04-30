// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import SignIn from './pages/SignIn.jsx';
import Attendance from './pages/Attendance.jsx';
import Phonebook from './pages/Phonebook.jsx';
import ChangeClass from './pages/ChangeClass.jsx';

export default function App() {
    return (
        <div className="min-h-screen bg-gray-50">
            <main>
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
