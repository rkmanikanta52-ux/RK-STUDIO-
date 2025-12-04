import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchIcon, MapPinIcon, LoaderIcon, UtensilsIcon } from './components/Icons';
import { SearchResultCard } from './components/SearchResultCard';
import { GroundingSources } from './components/GroundingSources';
import { searchBiryaniSpots } from './services/geminiService';
import { LoadingState, Restaurant, SearchResult } from './types';

const SUGGESTED_AREAS = [
  "Venkatramana Colony",
  "Gandhi Nagar",
  "Old Town",
  "C Camp",
  "Raj Vihar"
];

function App() {
  const [location, setLocation] = useState('');
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [parsedRestaurants, setParsedRestaurants] = useState<Restaurant[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  const parseResponse = (text: string): Restaurant[] => {
    const restaurants: Restaurant[] = [];
    // Split by the delimiter we asked Gemini to use
    const parts = text.split('###').slice(1); // Skip preamble

    parts.forEach(part => {
      const nameMatch = part.match(/^\s*(.+?)[\r\n]/);
      const ratingMatch = part.match(/\*\*Rating:\*\*\s*([^\r\n]+)/);
      const whyMatch = part.match(/\*\*Why it's good:\*\*\s*([^\r\n]+)/);
      const famousMatch = part.match(/\*\*Famous for:\*\*\s*([^\r\n]+)/);

      if (nameMatch) {
        restaurants.push({
          name: nameMatch[1].trim(),
          rating: ratingMatch ? ratingMatch[1].trim() : 'N/A',
          description: whyMatch ? whyMatch[1].trim() : 'Detailed reviews available in sources.',
          specialties: famousMatch ? famousMatch[1].trim() : 'Various Biryani dishes'
        });
      }
    });

    return restaurants;
  };

  const handleSearch = async (e?: React.FormEvent, searchLoc: string = location) => {
    if (e) e.preventDefault();
    if (!searchLoc.trim() && !location.trim()) return;

    const queryLocation = searchLoc || location;
    
    setLoadingState(LoadingState.LOADING);
    setErrorMsg('');
    setResult(null);
    setParsedRestaurants([]);

    try {
      const data = await searchBiryaniSpots(queryLocation);
      setResult(data);
      const parsed = parseResponse(data.text);
      setParsedRestaurants(parsed);
      setLoadingState(LoadingState.SUCCESS);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to fetch reviews. Please check your connection or try again.");
      setLoadingState(LoadingState.ERROR);
    }
  };

  const useCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
          // In a real app, we'd reverse geocode here. 
          // For this demo, we'll just search for "Near me" which Gemini handles well if context is passed,
          // but specifically for Kurnool app, let's just trigger a general search or ask user to be specific.
          // To be helpful, let's set a placeholder text indicating we detected location but need area name.
          // Or better, just auto-fill "Near me" and let Gemini figure it out based on the lat/long in toolConfig if we implemented that.
          // Since our toolConfig is basic, let's just focus on the text input UX.
          // Let's just set the location input to "Current Location" and let user refine, or search for "Nearby".
          setLocation("Nearby");
          handleSearch(undefined, "Nearby");
      }, (error) => {
        console.error("Geolocation error:", error);
        setErrorMsg("Could not detect location. Please type manually.");
      });
    } else {
      setErrorMsg("Geolocation not supported by this browser.");
    }
  };

  return (
    <div className="min-h-screen pb-12">
      <Header />

      {/* Hero / Search Section */}
      <div className="bg-gradient-to-b from-orange-50 to-white px-4 pt-12 pb-16">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Find the Best <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Biryani</span> in Kurnool
          </h2>
          <p className="text-lg text-slate-600 max-w-lg mx-auto leading-relaxed">
            Discover top-rated spots based on real-time Google reviews. Filter by area like Venkatramana Colony or Gandhi Nagar.
          </p>

          <form onSubmit={(e) => handleSearch(e)} className="relative max-w-lg mx-auto">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPinIcon className="h-5 w-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl shadow-lg shadow-orange-500/5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-lg"
                placeholder="Enter area (e.g., Venkatramana Colony)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <button
                type="submit"
                className="absolute inset-y-2 right-2 p-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loadingState === LoadingState.LOADING}
              >
                {loadingState === LoadingState.LOADING ? (
                  <LoaderIcon className="h-6 w-6 animate-spin" />
                ) : (
                  <SearchIcon className="h-6 w-6" />
                )}
              </button>
            </div>
          </form>

          {/* Quick suggestions */}
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {SUGGESTED_AREAS.map((area) => (
              <button
                key={area}
                onClick={() => {
                  setLocation(area);
                  handleSearch(undefined, area);
                }}
                className="px-3 py-1 bg-white border border-slate-200 rounded-full text-sm text-slate-600 hover:border-orange-300 hover:text-orange-600 transition-colors"
              >
                {area}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <main className="max-w-4xl mx-auto px-4 mt-8">
        {loadingState === LoadingState.ERROR && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-center">
            {errorMsg}
          </div>
        )}

        {loadingState === LoadingState.SUCCESS && (
          <div className="animate-fade-in">
            {parsedRestaurants.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-slate-800">
                    Top Recommendations {location ? `near ${location}` : 'in Kurnool'}
                  </h3>
                  <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    {parsedRestaurants.length} results
                  </span>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  {parsedRestaurants.map((restaurant, idx) => (
                    <SearchResultCard key={idx} restaurant={restaurant} index={idx} />
                  ))}
                </div>
              </>
            ) : (
              // Fallback if parsing failed but we have text
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 prose prose-orange max-w-none">
                <h3 className="text-xl font-bold mb-4">Search Results</h3>
                <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                  {result?.text}
                </div>
              </div>
            )}

            {/* Grounding Sources */}
            {result?.groundingMetadata && (
              <GroundingSources chunks={result.groundingMetadata.groundingChunks} />
            )}
          </div>
        )}
        
        {loadingState === LoadingState.IDLE && (
          <div className="text-center py-20 opacity-50">
            <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
               <UtensilsIcon className="w-10 h-10 text-slate-400" />
            </div>
            <p className="text-slate-500">Enter a location to find the tastiest Biryani nearby.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;