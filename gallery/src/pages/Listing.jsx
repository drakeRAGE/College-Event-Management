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

SwiperCore.use([Navigation]);

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
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
        </div>
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

      <ImageGallery images={images} eventName={listing.name} />
      <Event_map location={listing.location} />
      <Footer />
    </div>
  );
}
