'use client';

import { useState } from 'react';

export default function Dashboard() {
  const [formData, setFormdata] = useState({
    waitlist_position: 45,
    days_left: 20,
    coach_class: 'Sleeper',
    seasonality: 'Regular',
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); 

    try{
      const response = await fetch ('https://solitarysoul04-waitlist-whisperer.vercel.app/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'applicaion/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error fetching prediction:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className = "min-h-screen bg-gray-900 text-white p-8 font-sans">
      <div className = "max-w-2xl mx-auto">

        <header className = "mb-10 text-center">
          <h1 className = "text-4xl font-bold mb-2 text-blue-400"> The Waitlist Whisperer </h1>
          <p className = "text-gray-400">AI-powered transit predictions to save your journey.</p>
        </header>

        <div className = "bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <form onSubmit = {handleSubmit} className = 'space-y-6'>

            <div className = "grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Waitlist Position */}
              <div>
                <label className = "block text-sm font-medium text-gray-300 mb-2">Currrent Waitlist Position</label>
                <input
                  type = "number"
                  value = {formData.waitlist_position}
                  onChange = {(e) => setFormdata({...formData, waitlist_position: parseInt(e.target.value)})}
                  className = "w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring2 focus:ring-blue-500 outline-none"
                  min = "1"
                />
              </div>

              {/* Days Left */}
              

            </div>
        </div>
      </div>
    </div>
  )
}
