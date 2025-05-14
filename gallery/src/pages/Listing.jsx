import { useEffect, useState, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { FaShare, FaThumbsUp, FaThumbsDown, FaPlus, FaEllipsisH, FaUserCircle } from 'react-icons/fa';
import Event_map from '../components/Event_map';
import ImageGallery from '../components/ImageGallery';
import Footer from '../components/Footer';
import { useSelector, useDispatch } from 'react-redux'
import { Dialog, Transition } from '@headlessui/react';
import * as XLSX from 'xlsx';
import { FaDownload, FaSearch, FaTable } from 'react-icons/fa';

SwiperCore.use([Navigation]);

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showAttendees, setShowAttendees] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();

  const isAdmin = currentUser &&
    currentUser.email === import.meta.env.VITE_ADMIN_EMAIL &&
    currentUser.username === import.meta.env.VITE_ADMIN_USERNAME &&
    currentUser._id === import.meta.env.VITE_ADMIN_ID;

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          return;
        }
        setListing(data);
        setError(false);
      } catch (error) {
        setError(true);
      }
    };
    fetchListing();
  }, [params.listingId]);

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      if (!currentUser || !listing) return;
      try {
        const res = await fetch(`/api/attendee/check/${listing._id}/${currentUser._id}`, {
          credentials: 'include'
        });
        const data = await res.json();
        setIsRegistered(data.isRegistered);
      } catch (error) {
        console.error('Error checking registration:', error);
      }
    };
    checkRegistrationStatus();
  }, [currentUser, listing]);

  useEffect(() => {
    const fetchAttendees = async () => {
      if (!listing || !isAdmin) return;
      try {
        const res = await fetch(`/api/attendee/${listing._id}`, {
          credentials: 'include'
        });
        const data = await res.json();
        setAttendees(data);
      } catch (error) {
        console.error('Error fetching attendees:', error);
      }
    };
    fetchAttendees();
  }, [listing, isAdmin]);

  const handleRegister = async () => {
    try {
      const response = await fetch('/api/attendee/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          event_id: listing._id,
          user_id: currentUser._id,
          username: currentUser.username,
          user_email: currentUser.email,
          user_avatar: currentUser.avatar,
          user_phone: currentUser.phone_no,
          college_id: currentUser.college_id,
          college_name: currentUser.college_name,
          branch: currentUser.branch,
          batch_passing: currentUser.Batch_passing,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setRegistrationStatus('success');
        setIsRegistered(true);
      } else {
        setRegistrationStatus('error');
      }
    } catch (error) {
      setRegistrationStatus('error');
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-red-600">Error loading event details</div>
      </div>
    )
  }

  if (!listing) {
    return null;
  }

  const images = listing.imageUrls.map((url, index) => ({
    src: url,
    alt: `Image ${index + 1}`,
    caption: `Image ${index + 1}`,
  }));

  const backgroundImageStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url(${listing.imageUrls[0]})`,
  };

  // Add cancel registration handler
  const handleCancelRegistration = async () => {
    try {
      const response = await fetch(`/api/attendee/cancel/${listing._id}/${currentUser._id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setIsRegistered(false);
        setRegistrationStatus('cancelled');
        setIsOpen(true);
      } else {
        setRegistrationStatus('error');
        setIsOpen(true);
      }
    } catch (error) {
      setRegistrationStatus('error');
      setIsOpen(true);
    }
  };

  // Add this function before the return statement
  const getEventStatus = () => {
    const currentDate = new Date();
    const startDate = new Date(listing.startDate);
    const endDate = new Date(listing.endDate);

    if (currentDate < startDate) {
      return 'upcoming';
    } else if (currentDate >= startDate && currentDate <= endDate) {
      return 'ongoing';
    } else {
      return 'past';
    }
  };

  const exportToExcel = () => {
    const dataToExport = sortedAndFilteredAttendees().map(attendee => ({
      'Name': attendee.username,
      'Email': attendee.user_email,
      'Phone': attendee.user_phone,
      'College': attendee.college_name,
      'Branch': attendee.branch,
      'Batch': attendee.batch_passing
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendees");
    XLSX.writeFile(wb, `${listing.name}_Attendees.xlsx`);
  };

  const sortedAndFilteredAttendees = () => {
    let filtered = [...attendees].filter(attendee =>
      Object.values(attendee).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return filtered;
  };


  // Add this JSX before the ImageGallery component
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Share Button */}
        <div className='absolute top-24 right-6'>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className='bg-white hover:bg-gray-100 p-3 rounded-full shadow-md transition-all'
          >
            <FaShare className='text-gray-700 text-xl' />
          </button>
          {copied && (
            <div className='absolute top-12 right-0 bg-gray-600 text-white px-4 py-2 rounded-lg text-sm'>
              Link copied!
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Main Image */}
          <div className="lg:w-1/2">
            <img
              src={listing.imageUrls[0]}
              alt={listing.name}
              className="w-full aspect-[4/3] object-cover rounded-xl shadow-md"
            />
          </div>

          {/* Content */}
          <div className="lg:w-1/2 space-y-8 pt-4">
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-5xl font-bold text-gray-800 leading-tight font-serif">
                {listing.name}
              </h1>

              <div className="flex items-center gap-3 text-gray-600">
                <FaUserCircle className="text-2xl" />
                <span className="text-md font-medium">by {listing.organizer_name}</span>
              </div>
            </div>

            <div className="border-t border-b border-gray-200 py-6">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-gray-900">₹{listing.ticketfee}</span>
                <span className="ml-2 text-md text-gray-600">per ticket</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">About this event</h3>
              <p className='text-lg text-gray-600 leading-relaxed'>
                {listing.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add this before ImageGallery */}
      {currentUser && !isAdmin && (
        <>
          {(getEventStatus() === 'upcoming' || getEventStatus() === 'ongoing') ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {!isRegistered ? (
                <button
                  onClick={() => setIsOpen(true)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Register for Event
                </button>
              ) : (
                <button
                  onClick={handleCancelRegistration}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Cancel Registration
                </button>
              )}
              <p className="text-sm text-gray-600 mt-2 text-center">
                {getEventStatus() === 'upcoming' ? 'Event starts on ' : 'Event ongoing until '}
                {getEventStatus() === 'upcoming'
                  ? new Date(listing.startDate).toLocaleDateString()
                  : new Date(listing.endDate).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <p className="text-gray-600 text-center">This event has ended</p>
            </div>
          )}
        </>
      )}

      {/* Registration Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  {registrationStatus === null ? (
                    <>
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        Confirm Registration
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to register for {listing.name}?
                        </p>
                      </div>
                      <div className="mt-4 flex gap-4">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200"
                          onClick={handleRegister}
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
                          onClick={() => {
                            setIsOpen(false);
                            setRegistrationStatus(null);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      {registrationStatus === 'success' && (
                        <div className="text-green-600">
                          <h3 className="text-lg font-medium">Registration Successful!</h3>
                          <p className="mt-2">You have been registered for the event.</p>
                        </div>
                      )}
                      {registrationStatus === 'error' && (
                        <div className="text-red-600">
                          <h3 className="text-lg font-medium">Registration Failed</h3>
                          <p className="mt-2">Please try again later.</p>
                        </div>
                      )}
                      {registrationStatus === 'cancelled' && (
                        <div className="text-yellow-600">
                          <h3 className="text-lg font-medium">Registration Cancelled</h3>
                          <p className="mt-2">You have cancelled your registration.</p>
                        </div>
                      )}
                      <button
                        className="mt-4 inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
                        onClick={() => {
                          setIsOpen(false);
                          setRegistrationStatus(null);
                        }}
                      >
                        Close
                      </button>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Add this before ImageGallery */}
      {isAdmin && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => setShowAttendees(!showAttendees)}
            className="w-full bg-gray-100 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <span>{showAttendees ? 'Hide' : 'Show'} Attendee List</span>
            <FaEllipsisH className={`transform transition-transform ${showAttendees ? 'rotate-180' : ''}`} />
          </button>

          {showAttendees && (
            <div className="mt-4 bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between gap-4">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search attendees..."
                      className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  <button
                    onClick={exportToExcel}
                    className="inline-flex items-center px-4 py-2 bg-purple-400 text-white rounded-lg hover:bg-green-700 transition-colors gap-2 whitespace-nowrap"
                  >
                    <FaDownload />
                    Export to Excel
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
                      {['Name', 'Email', 'College', 'Branch', 'Batch', 'Phone'].map(key => (
                        <th
                          key={key}
                          className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100"
                          onClick={() => setSortConfig({
                            key: key.toLowerCase(),
                            direction: sortConfig.key === key.toLowerCase() && sortConfig.direction === 'ascending' ? 'descending' : 'ascending'
                          })}
                        >
                          <div className="flex items-center gap-1">
                            {key}
                            <span className={`transition-opacity ${sortConfig.key === key.toLowerCase() ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
                              {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedAndFilteredAttendees().map((attendee, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={attendee.user_avatar || 'https://via.placeholder.com/40'}
                              alt={attendee.username}
                              className="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{attendee.username}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{attendee.user_email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{attendee.college_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{attendee.branch}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{attendee.batch_passing}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{attendee.user_phone}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {sortedAndFilteredAttendees().length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-lg font-medium">
                      {searchTerm ? 'No matching attendees found' : 'No attendees registered yet'}
                    </div>
                    <p className="mt-2 text-sm text-gray-400">
                      {searchTerm ? 'Try adjusting your search terms' : 'Attendees will appear here once they register'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      <ImageGallery images={images} eventName={listing.name} />
      <Event_map location={listing.location} />
      <Footer />
    </div>
  );
}
