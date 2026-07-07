'use client';

import { useState } from 'react';

export default function Dashboard() {
  const [formData, setFormData] = useState({
    waitlist_position: 45,
    days_left: 20,
    coach_class: 'Sleeper',
    seasonality: 'Regular',
  });
  
  interface PredictionResult {
  calculated_probability: number;
  risk_tier: string;
  }
  
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); 

    try{
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <div className="max-w-2xl mx-auto">

        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-2 text-blue-400">The Waitlist Whisperer</h1>
          <p className="text-gray-400">AI-powered transit predictions to save your journey.</p>
        </header>

        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <form onSubmit = {handleSubmit} className='space-y-6'>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Currrent Waitlist Position</label>
                <input
                  type = "number"
                  value = {formData.waitlist_position}
                  onChange = {(e) => setFormData({...formData, waitlist_position: parseInt(e.target.value)})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  min = "1"
                />
              </div>

              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2"> Days Until Journey </label>
                <input
                  type = "number"
                  value = {formData.days_left}
                  onChange = {(e) => setFormData({...formData, days_left: parseInt(e.target.value)})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  min = "0"
                  />
              </div> 

              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2"> Coach Class </label>
                <select
                  value = {formData.coach_class}
                  onChange = {(e) => setFormData ({...formData, coach_class: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value = "Sleeper">Sleeper (SL) </option>
                  <option value = "3AC">3 Tier AC (3A) </option>
                  <option value = "2AC">2 Tier AC (2A) </option>
                  <option value = "1AC">1st Class AC (1A) </option>
                </select>
              </div>

              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Travel Season</label>
                <select
                  value = {formData.seasonality}
                  onChange={(e) => setFormData ({...formData, seasonality: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value = "Low Demand">Low Demand</option>
                  <option value = "Regular">Regular Travel</option>
                  <option value = "Peak Festival Rush">Peak Festival Rush</option>  
                </select>
              </div>
            </div>
            <button
              type = "submit"
              disabled = {loading}
              className='w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200'
            >
              {loading ? 'Hold on! Predicting...' : "Predict Odds"}
            </button>
          </form>  
        </div>

        
        {result && (
          <div className='mt-8 bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700 text-center'>
            <h2 className="text-xl text-gray-400 mb-2">Confirmation Probability</h2>
            <div className="text-6xl font-black mb-4">
              {result.calculated_probability}%
            </div>
            <div className={`inline-block px-4 py-2 rounded-full font-bold ${
              result.risk_tier.includes('Safe') ? 'bg-green-900 text-green-300':
              result.risk_tier.includes('Moderate') ? 'bg-yellow-900 text-yellow-300':
              'bg-red-900 text-red-300'
            }`}>
              {result.risk_tier}
            </div>
          </div>
        )}
  
      </div>
    </div>
  );
}
