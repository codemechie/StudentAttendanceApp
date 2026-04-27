import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Phonebook() {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Hardcode the class this teacher is allowed to see
    const targetClass = "8th";

    useEffect(() => {
        fetch('/data.csv')
            .then(res => res.text())
            .then(csvText => {
                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        // Filter to show only students from the teacher's class
                        const filteredStudents = results.data.filter(s => s.Class === targetClass);
                        setStudents(filteredStudents);
                        setLoading(false);
                    }
                });
            });
    }, [targetClass]);

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                    <button 
                        onClick={() => navigate('/')}
                        className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-2"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Dashboard
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Phonebook</h1>
                    <p className="text-gray-500 mt-1 text-sm sm:text-base">Viewing contacts for Class {targetClass}</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-10">Loading contacts...</div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-colors">
                    <ul className="divide-y divide-gray-200">
                        {students.map((student, idx) => (
                            <li key={idx} className="p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center space-x-4">
                                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xl">
                                        {student.Name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{student.Name}</h3>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            {student.Sex} • Age: {student.Age}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-left sm:text-right mt-2 sm:mt-0 bg-gray-100 sm:bg-transparent p-3 sm:p-0 rounded-lg sm:rounded-none">
                                    <span className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Parent Contact</span>
                                    <a href={`tel:${student['Contact Info']}`} className="text-base sm:text-lg font-medium text-indigo-600 hover:text-indigo-800">
                                        {student['Contact Info']}
                                    </a>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
