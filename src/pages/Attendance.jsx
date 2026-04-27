import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Attendance() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentDate = new Date();
  const todayName = currentDate.toLocaleDateString('en-US', { weekday: 'short' }); // e.g. "Mon"
  const fullDate = currentDate.toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


  useEffect(() => {
    // Fetch and parse the CSV from the public folder
    fetch('/data.csv')
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            // Filter class "8th" as requested
            const class8Students = results.data.filter(row => row.Class === "8th");

            // Initialize their attendance state. 'P' for today's column, '-' for others.
            const studentsWithAttendance = class8Students.map(student => {
              const attendance = {};
              daysOfWeek.forEach(day => {
                 if(day === todayName) {
                    attendance[day] = 'P'; // Default present for today
                 } else {
                    attendance[day] = '-'; // Empty/mock past data
                 }
              });

              return {
                ...student,
                attendance
              };
            });

            setStudents(studentsWithAttendance);
            setLoading(false);
          },
        });
      });
  }, []);

  const toggleAttendance = (studentIndex, day) => {
    // Only allow toggling for the current day
    if (day !== todayName) return;

    const updatedStudents = [...students];
    const currentStatus = updatedStudents[studentIndex].attendance[day];

    // Toggle between P and A
    updatedStudents[studentIndex].attendance[day] = currentStatus === 'P' ? 'A' : 'P';

    setStudents(updatedStudents);
  };

  const handleSubmit = () => {
     // TODO: Implement backend submission later
     alert("Attendance Submitted successfully! (Mock)");
     navigate('/');
  };

  if (loading) {
    return <div className="flex justify-center py-20">Loading student data...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50 transition-colors">

      {/* Header Section */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-3"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Class 8th Attendance</h1>
          <p className="text-gray-500 mt-1">{fullDate}</p>
        </div>

        <button 
           onClick={handleSubmit}
           className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 shadow-md transition w-full sm:w-auto"
        >
          <Save className="w-5 h-5" />
          <span className="font-semibold">Submit Attendance</span>
        </button>
      </div>

      {/* Attendance Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 z-10 bg-gray-50">
                  Student Name
                </th>
                {daysOfWeek.map((day) => (
                  <th 
                    key={day} 
                    scope="col" 
                    className={`px-6 py-4 text-center text-xs font-bold uppercase tracking-wider ${
                        day === todayName 
                        ? 'bg-indigo-100 text-indigo-800 border-b-2 border-indigo-500' // Highlight current day
                        : 'text-gray-500'
                    }`}
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">

                  {/* Name Column */}
                  <td className="px-6 py-4 whitespace-nowrap sticky left-0 z-10 border-r border-gray-100 bg-white">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                           {student.Name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{student.Name}</div>
                        <div className="text-sm text-gray-500">Age: {student.Age} • {student.Sex}</div>
                      </div>
                    </div>
                  </td>

                  {/* Attendance Columns */}
                  {daysOfWeek.map((day) => {
                    const isToday = day === todayName;
                    const status = student.attendance[day];

                    return (
                        <td 
                          key={day} 
                          className={`px-6 py-4 whitespace-nowrap text-center ${isToday ? 'bg-indigo-50/30' : ''}`}
                        >
                          <button
                            onClick={() => toggleAttendance(index, day)}
                            disabled={!isToday}
                            className={`
                              w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center mx-auto transition-transform
                              ${!isToday ? 'cursor-not-allowed opacity-60 bg-gray-100 text-gray-500' : ''}
                              ${isToday && status === 'P' ? 'bg-green-100 text-green-700 hover:bg-green-200 shadow-sm' : ''}
                              ${isToday && status === 'A' ? 'bg-red-100 text-red-700 hover:bg-red-200 shadow-sm scale-110' : ''}
                            `}
                          >
                            {status}
                          </button>
                        </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
