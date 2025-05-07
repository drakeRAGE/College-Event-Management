import { Link } from 'react-router-dom';

const EventList = ({ events }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => (
        <Link to={`/listing/${event._id}`} key={event._id} className="h-full">
          <div className="bg-gray-100 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-102 h-full flex flex-col">
            <div className="aspect-w-16 aspect-h-9 relative">
              <img
                src={event.imageUrls}
                alt={event.name}
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">{event.name}</h2>
              <p className="text-gray-600 line-clamp-3 flex-grow">{event.description}</p>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                  {new Date(event.startDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default EventList;

