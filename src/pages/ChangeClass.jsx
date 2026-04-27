import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, AlertTriangle } from 'lucide-react';
import Papa from 'papaparse';

export default function ChangeClass() {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [reason, setReason] = useState('');
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        // Parse CSV to find out what distinct classes exist in the school
        fetch('/data.csv')
            .then(res => res.text())
            .then(csvText => {
                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        const distinctClasses = [...new Set(results.data.map(item => item.Class))];
                        setClasses(distinctClasses);
                    }
                });
            });
    }, []);

    const handleRequestChange = (e) => {
        e.preventDefault();
        // In reality, this would make a POST request to your API to ask the Admin for approval
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8 min-h-screen text-center bg-gray-50 transition-colors">
                <div className="bg-green-50 rounded-lg p-8 shadow-sm border border-green-100 transition-colors">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted</h2>
                    <p className="text-gray-600 mb-6">Your request to take attendance for Class **{selectedClass}** has been sent to the Admin. You will be notified once approved.</p>
                    <button 
                        onClick={() => navigate('/')} 
                        className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-indigo-700 transition"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50 transition-colors">
            <button 
                onClick={() => navigate('/')}
                className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-6"
            >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Dashboard
            </button>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 transition-colors">
                <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-gray-100">
                    <div className="bg-blue-100 p-3 rounded-full">
                        <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Change Class Manually</h1>
                        <p className="text-gray-500 mt-1 text-sm">Request to handle attendance for a different class due to timetable changes.</p>
                    </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 transition-colors">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertTriangle className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700 font-medium">
                                Manual class changes require Admin approval. You cannot record attendance until your request is approved.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleRequestChange} className="space-y-6">
                    <div>
                        <label htmlFor="class-select" className="block text-sm font-medium text-gray-700 mb-2">
                            Select Temporary Class
                        </label>
                        <select
                            id="class-select"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 transition-colors"
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select a class...</option>
                            {classes.map((cls, idx) => (
                                <option key={idx} value={cls}>{cls}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                            Reason for Change
                        </label>
                        <textarea
                            id="reason"
                            rows="3"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 transition-colors"
                            placeholder="e.g. Covering for Mrs. Smith today"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-indigo-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!selectedClass}
                    >
                        Submit Request to Admin
                    </button>
                </form>
            </div>
        </div>
    );
}
