'use client';

import { useState } from 'react';

interface PredictionResult {
  calculated_probability: number;
  risk_tier: string;
}

export default function Dashboard() {
  const [formData, setFormData] = useState({
    waitlist_position: 45,
    days_left: 20,
    coach_class: 'Sleeper',
    seasonality: 'Regular Travel',
    route_density: 'Standard',
  });
  
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
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-6 md:p-12 font-sans selection:bg-blue-500 selection:text-white">
      <div className="max-w-3xl mx-auto space-y-8">

        <header className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-extrabold  tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            The Waitlist Whisperer
          </h1>
          <p className="text-slate-400 text-lg">AI-powered transit predictions to save your journey.</p>
        </header>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-2xl border border-slate-700">
          <form onSubmit = {handleSubmit} className='space-y-6'>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className = "space-y-2">
                <label className="text-sm font-semibold text-slate-300 mb-2">Currrent Waitlist Position</label>
                <input
                  type = "number"
                  value = {formData.waitlist_position}
                  onChange = {(e) => setFormData({...formData, waitlist_position: parseInt(e.target.value) || 0})}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  min = "1"
                />
              </div>

              
              <div className = "space-y-2">
                <label className="text-sm font-semibold text-slate-300"> Days Until Journey </label>
                <input
                  type = "number"
                  value = {formData.days_left}
                  onChange = {(e) => setFormData({...formData, days_left: parseInt(e.target.value) || 0})}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  min = "0"
                  />
              </div> 

              
              <div className = "space-y-2">
                <label className="text-sm font-semibold text-slate-300"> Coach Class </label>
                <select
                  value = {formData.coach_class}
                  onChange = {(e) => setFormData ({...formData, coach_class: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                >
                  <option value = "Sleeper">Sleeper (SL) </option>
                  <option value = "3AC">3 Tier AC (3A) </option>
                  <option value = "2AC">2 Tier AC (2A) </option>
                  <option value = "1AC">1st Class AC (1A) </option>
                </select>
              </div>

              <div className = "space-y-2">
                <label className="text-sm font-semibold text-slate-300">Route Density</label>
                <select
                  value = {formData.route_density}
                  onChange = {(e) => setFormData ({...formData, route_density: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                >
                  <option value = "High (Metro/Capital routes)">High (Metro/Capital routes)</option>
                  <option value = "Standard">Standard Route</option>
                  <option value = "Low (Regional/Rural">Low (Regional/Rural)</option>
                </select>
              </div>

              <div className = "space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-300">Travel Season</label>
                <select
                  value = {formData.seasonality}
                  onChange={(e) => setFormData ({...formData, seasonality: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
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
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-4 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Hold on! Predicting...' : "Predict Odds"}
            </button>
          </form>  
        </div>

        
        {result && (
          <div className="bg-slate-800/80 rounded-2xl p-8 shadow-2xl border border-slate-700 text-center">
            <h2 className="text-lg font-semibold text-slate-400 uppercase tracking-wider mb-4">Confirmation Probability</h2>
            
            <div className="flex justify-center items-baseline gap-2 mb-6">
              <span className="text-7xl font-black text-white">{result.calculated_probability}</span>
              <span className="text-3xl text-slate-400">%</span>
            </div>

            <div className="w-full h-3 bg-slate-900 rounded-full mb-6 overflow-hidden">
               <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    result.calculated_probability >= 75 ? 'bg-emerald-500' : 
                    result.calculated_probability >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${result.calculated_probability}%` }}
               ></div>
            </div>

            <div className={`inline-flex items-center px-6 py-2.5 rounded-full font-bold text-sm tracking-wide ${
              result.risk_tier.includes('Safe') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              result.risk_tier.includes('Moderate') ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
              'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              <span className="mr-2 h-2 w-2 rounded-full currentColor bg-current animate-pulse"></span>
              {result.risk_tier}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
