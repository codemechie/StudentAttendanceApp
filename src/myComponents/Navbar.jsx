// src/components/Navbar.jsx
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="space-x-4">
                    <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
                        Home
                    </Link>
                    <Link to="/signin" className="text-gray-700 hover:text-blue-600 transition">
                        Sign In
                    </Link>
                </div>
            </div>
        </nav>
    );
}   