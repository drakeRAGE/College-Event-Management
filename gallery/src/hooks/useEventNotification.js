import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';

export const useEventNotification = (onEventClick) => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const previousEventsRef = useRef([]);

  const fetchUpcomingEvents = async () => {
    try {
      const res = await fetch('/api/listing/get');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      
      const currentDate = new Date();
      const upcoming = data.filter(event => {
        const startDate = new Date(event.startDate);
        return startDate > currentDate;
      });

      // Compare with previous events to find new ones
      const newEvents = upcoming.filter(event => 
        !previousEventsRef.current.find(prevEvent => prevEvent._id === event._id)
      );

      if (newEvents.length > 0 && previousEventsRef.current.length > 0) {
        toast.info(`${newEvents.length} new event${newEvents.length > 1 ? 's' : ''} added! Click to view.`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          onClick: onEventClick
        });
      } else {
        console.log('No new events found');
      }

      previousEventsRef.current = upcoming;
      setUpcomingEvents(upcoming);
    } catch (error) {
      console.error('Error fetching events:', error);
      // Add toast notification for error
    //   toast.error('Unable to fetch events. Please check if the server is running.', {
    //     position: "top-right",
    //     autoClose: 5000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //   });
    }
  };

  useEffect(() => {
    fetchUpcomingEvents();
    const interval = setInterval(fetchUpcomingEvents, 6000); 
    return () => clearInterval(interval);
  }, [onEventClick]);

  return upcomingEvents;
};