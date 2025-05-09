import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';
import Testimony from '../components/Testimony';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import pantnagar from '../assets/pantnagar.png'
import COT from '../assets/COT.jpeg'
import background from '../assets/background.jpg'

export default function Home() {
  const [events, setEvents] = useState({ previous: [], ongoing: [], upcoming: [] });
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/listing/get');
        if (!res.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await res.json();
        // console.log('Fetched data:', data); // Log the fetched data to see its structure
        const categorizedEvents = categorizeEvents(data);
        setEvents(categorizedEvents);
      } catch (err) {
        console.log(err)
      }
    };

    fetchEvents();
  }, []);
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

  // console.log( 'Previous- ', events['previous'], 'Upcoming -', events['upcoming'], 'Ongoing-',  events['ongoing'])
  return (
    <div>
      {/* top */}
      {/* <section
        className=" text-white "
      // style={{ backgroundImage: `url(${background})` }}
      > */}
      <section className="relative text-gray-800">
        <div className="mx-auto max-w-screen-xl px-12 py-20 lg:min-h-[85vh] lg:flex lg:items-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left space-y-6">
              <div className="space-y-2">
                <h2 className="text-green-700 text-lg font-semibold tracking-wide">Welcome to</h2>
                <h1 className="text-3xl lg:text-4xl font-bold">
                  <span className="block text-gray-900">Govind Ballabh Pant University</span>
                  <span className="block bg-gradient-to-r from-green-600 via-blue-600 to-purple-700 bg-clip-text text-transparent">
                    Event Management System
                  </span>
                </h1>
              </div>

              <p className="text-base text-gray-600 leading-relaxed max-w-lg">
                A centralized platform for organizing, managing, and coordinating university events with seamless departmental collaboration.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/events"
                  className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800 transition-colors"
                >
                  Browse Events
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                {/* <Link
                  to="/create-listing"
                  className="inline-flex items-center px-6 py-3 text-sm font-medium text-green-700 bg-white rounded-lg border border-green-700 hover:bg-green-50 transition-colors"
                >
                  Create Event
                </Link> */}
              </div>
            </div>

            {/* Left side content remains unchanged */}

            <div className="relative order-1 lg:order-2">
              {/* <div className="relative bg-white p-5 rounded-xl shadow-md"> */}
              <img
                src={pantnagar}
                alt="GBPUAT Campus"
                className="max-w-full max-h-[350px] object-cover rounded-lg"
              />
              {/* </div> */}
            </div>
          </div>
        </div>
      </section>


      {/* <div className='max-w-screen bg-none mx-auto flex flex-col gap-8 border-slate-500 shadow-lg'>
        {events['ongoing'] && events['ongoing'].length > 0 && (
          <div className='bg-slate-500 p-8 rounded-lg'>
            <div className='my-3 flex justify-between items-center'>
              <h2 className='text-2xl font-semibold text-gray-100'>Ongoing events</h2>
              <Link className='text-sm font-semibold text-indigo-800 hover:underline' to={'/search?searchTerm='}>
                Show more events
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {events['ongoing'].map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {events['previous'] && events['previous'].length > 0 && (
          <div className='bg-slate-500 p-8 rounded-lg'>
            <div className='my-3 flex justify-between items-center'>
              <h2 className='text-2xl font-semibold text-gray-100'>Featured events</h2>
              <Link className='text-sm font-semibold text-indigo-800 hover:underline' to={'/search?searchTerm='}>
                Show more events
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {events['previous'].slice(0, 3).map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>

          </div>
        )}

        {events['upcoming'] && events['upcoming'].length > 0 && (
          <div className='bg-slate-500 p-8 rounded-lg'>
            <div className='my-3 flex justify-between items-center'>
              <h2 className='text-2xl font-semibold text-gray-100'>Upcoming events</h2>
              <Link className='text-sm font-semibold text-indigo-800 hover:underline' to={'/search?searchTerm='}>
                Show more events
              </Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {events['upcoming'].map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

      </div> */}

      {/* <Testimony /> */}
      {/* <Newsletter /> */}
      {/* Platform Features Section */}
      <section className="py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-green-600 font-medium text-sm tracking-wider uppercase">Our Platform</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
              Streamlined Event Management
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Advanced digital solutions designed specifically for GBPUAT's event organization needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative p-8 rounded-2xl transition-all duration-300 hover:translate-y-[-8px]">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-50 to-blue-50 shadow-sm"></div>
              <div className="relative">
                <div className="text-green-600 mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white shadow-sm">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Event Planning</h3>
                <p className="text-gray-600 leading-relaxed">
                  Intelligent scheduling system with automated conflict resolution and resource management for seamless event coordination.
                </p>
              </div>
            </div>

            <div className="group relative p-8 rounded-2xl transition-all duration-300 hover:translate-y-[-8px]">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 shadow-sm"></div>
              <div className="relative">
                <div className="text-blue-600 mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white shadow-sm">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-Time Updates</h3>
                <p className="text-gray-600 leading-relaxed">
                  Instant notifications and live updates ensure perfect synchronization between all event stakeholders.
                </p>
              </div>
            </div>

            <div className="group relative p-8 rounded-2xl transition-all duration-300 hover:translate-y-[-8px]">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 shadow-sm"></div>
              <div className="relative">
                <div className="text-purple-600 mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white shadow-sm">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Analytics Dashboard</h3>
                <p className="text-gray-600 leading-relaxed">
                  Powerful analytics tools providing actionable insights for better event planning and execution.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed text-lg">
              Experience seamless event management with our platform, tailored for GBPUAT's vibrant academic community.
            </p>
          </div>
        </div>
      </section>

      {/* Uncomment and modify your events section as needed */}

      <Footer />
    </div>
  );
}

