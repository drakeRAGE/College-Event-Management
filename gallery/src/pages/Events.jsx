

import { useState, useEffect } from 'react';
import EventList from '../components/EventsList';

const App = () => {
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const [events, setEvents] = useState({ previous: [], ongoing: [], upcoming: [] });
  useEffect(() => {
    const savedTab = localStorage.getItem('selectedTab');
    if (savedTab) {
      setSelectedTab(savedTab);
    }

    const fetchEvents = async () => {
      try {
        // setLoading(true);
        const res = await fetch('/api/listing/get');
        if (!res.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await res.json();
        console.log('Fetched data:', data); // Log the fetched data to see its structure
        const categorizedEvents = categorizeEvents(data);
        setEvents(categorizedEvents);
      } catch (err) {
        console.error(err)
      }
    };

    fetchEvents();
  }, []);

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    localStorage.setItem('selectedTab', tab);
  };

  const categorizeEvents = (data) => {
    const currentDate = new Date();
    const previous = [];
    const ongoing = [];
    const upcoming = [];

    if (!data || !Array.isArray(data)) {
      console.error('Invalid data structure:', data); // Log an error if the data structure is invalid
      return { previous, ongoing, upcoming };
    }

    data.forEach((event) => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);

      if (endDate < currentDate) {
        previous.push(event);
      } else if (startDate <= currentDate && endDate >= currentDate) {
        ongoing.push(event);
      } else if (startDate > currentDate) {
        upcoming.push(event);
      }
    });

    return { previous, ongoing, upcoming };
  };
  return (
    <div className="min-h-screen
     
     py-12">
      <div className="container mx-auto max-w-6xl px-4">
        <h1 className="text-5xl font-bold text-gray-800 text-center mb-4">University Events</h1>
        <p className="text-gray-600 text-center mb-12 text-lg">Discover and participate in GBPUAT's diverse range of events</p>

        <div className="flex flex-col sm:flex-row justify-center mb-12 gap-4">
          {['previous', 'ongoing', 'upcoming'].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 w-full sm:max-w-2 ${selectedTab === tab
                ? 'bg-white text-gray-800 shadow-lg scale-105 border border-gray-100'
                : 'bg-gray-50 text-gray-600 hover:bg-white hover:shadow'
                }`}
              onClick={() => handleTabClick(tab)}
            >
              {`${tab.charAt(0).toUpperCase() + tab.slice(1)} Events`}
            </button>
          ))}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <EventList events={events[selectedTab]} />
        </div>
      </div>
    </div>
  )
}


export default App;