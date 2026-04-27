// src/myComponents/ProfileDropdown.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, LogOut, Calendar, X, ChevronDown } from 'lucide-react';

export default function ProfileDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);

    // Default to current month
    const currentDate = new Date();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const currentMonthString = months[currentDate.getMonth()];

    const [selectedMonth, setSelectedMonth] = useState(currentMonthString);
    const navigate = useNavigate();

    // Mock Teacher Data
    const teacherName = "Jane Doe";
    const teacherUsername = "jane.doe123";

    // Mock read-only attendance data
    const mockAttendanceHistory = {
        'April': [
            { date: 'Apr 01, 2026', present: 28, absent: 2 },
            { date: 'Apr 02, 2026', present: 29, absent: 1 },
            { date: 'Apr 03, 2026', present: 25, absent: 5 },
            // ... more days
        ],
        'March': [
            { date: 'Mar 01, 2026', present: 30, absent: 0 },
            { date: 'Mar 02, 2026', present: 27, absent: 3 },
            // ... more days
        ]
    };

    const handleLogout = () => {
        // ... Clear any auth tokens
        navigate('/login');
    };

    return (
        <div className="relative">
            {/* Profile Trigger */}
            <div 
                className="flex items-center cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <UserCircle className="h-8 w-8 text-gray-600" />
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-100 z-50 overflow-hidden">
                    <div className="px-4 py-4 bg-gray-50 border-b border-gray-100">
                        <p className="text-sm font-bold text-gray-900">{teacherName}</p>
                        <p className="text-xs text-gray-500">@{teacherUsername}</p>
                    </div>

                    <div className="py-1 text-sm bg-white">
                        <button 
                            className="flex items-center w-full px-4 py-2 text-left text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition"
                            onClick={() => {
                                setShowAttendanceModal(true);
                                setIsOpen(false);
                            }}
                        >
                            <Calendar className="mr-3 h-4 w-4" />
                            View Attendance History
                        </button>
                    </div>

                    <div className="py-1 border-t border-gray-100 bg-white">
                        <button 
                            className="flex items-center w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-3 h-4 w-4" />
                            Logout
                        </button>
                    </div>
                </div>
            )}

            {/* Attendance History Modal */}
            {showAttendanceModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">

                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Attendance History</h2>
                            <button 
                                onClick={() => setShowAttendanceModal(false)}
                                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 flex-1 overflow-y-auto">

                            {/* Month Selector */}
                            <div className="mb-6 flex items-center space-x-3">
                                <label className="text-sm font-medium text-gray-700">Select Month:</label>
                                <div className="relative">
                                    <select 
                                        className="appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 pr-8"
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                    >
                                        {months.map(m => (
                                            <option key={m} value={m}>{m} {currentDate.getFullYear()}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-500 pointer-events-none" />
                                </div>
                            </div>

                            {/* History Table */}
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 font-semibold text-gray-600">Date</th>
                                            <th className="px-6 py-3 font-semibold text-gray-600 text-center">Present</th>
                                            <th className="px-6 py-3 font-semibold text-gray-600 text-center">Absent</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {mockAttendanceHistory[selectedMonth]?.map((record, i) => (
                                            <tr key={i} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">{record.date}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-green-600 font-semibold">{record.present}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-red-600 font-semibold">{record.absent}</td>
                                            </tr>
                                        )) || (
                                            <tr>
                                                <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                                                    No attendance records found for {selectedMonth}.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
