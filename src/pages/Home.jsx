import { Menu, UserCircle, Users, BookOpen } from 'lucide-react';

export default function Home() {
    // Mock data for today's default class
    const todayClass = "Grade 5 - Section A";
    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar Section */}
            <nav className="bg-white shadow-sm border-b">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        {/* Top Left: Hamburger Menu */}
                        <div className="flex flex-shrink-0 items-center cursor-pointer p-2 hover:bg-gray-100 rounded-md">
                            <Menu className="h-6 w-6 text-gray-600" />
                        </div>

                        

                        {/* Top Right: Profile */}
                        <div className="flex items-center cursor-pointer p-2 hover:bg-gray-100 rounded-full">
                            <UserCircle className="h-8 w-8 text-gray-600" />
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

                {/* Section 1: Today's Prepared Attendance */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">Today's Attendance</h2>
                        <span className="text-sm text-gray-500 font-medium">{currentDate}</span>
                    </div>

                    <div className="bg-indigo-50 border border-indigo-100 rounded-md p-4 mb-6">
                        <p className="text-indigo-800 font-medium">Pre-loaded Class based on Timetable:</p>
                        <p className="text-2xl font-bold text-indigo-900 mt-1">{todayClass}</p>
                    </div>

                    <button className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-indigo-700 transition duration-150">
                        Start Taking Attendance
                    </button>
                </div>

                {/* Section 2: Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {/* Class Change Button */}
                    <button className="flex items-center justify-center space-x-3 bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-indigo-300 hover:shadow-md transition duration-150">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <BookOpen className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="text-left">
                            <span className="block text-lg font-bold text-gray-900">Change Class</span>
                            <span className="block text-sm text-gray-500">Select a different class manually</span>
                        </div>
                    </button>

                    {/* Phonebook Button */}
                    <button className="flex items-center justify-center space-x-3 bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-indigo-300 hover:shadow-md transition duration-150">
                        <div className="bg-green-100 p-3 rounded-full">
                            <Users className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="text-left">
                            <span className="block text-lg font-bold text-gray-900">Phonebook</span>
                            <span className="block text-sm text-gray-500">View student contact numbers</span>
                        </div>
                    </button>

                </div>

            </main>
        </div>
    );
}