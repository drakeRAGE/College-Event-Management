import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { FaShare, FaThumbsUp, FaThumbsDown, FaPlus, FaEllipsisH, FaUserCircle } from 'react-icons/fa';
import Event_map from '../components/Event_map';
import ImageGallery from '../components/ImageGallery';
import Footer from '../components/Footer';

SwiperCore.use([Navigation]);

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  const params = useParams();

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

      <ImageGallery images={images} eventName={listing.name} />
      {/* <Event_map location={listing.location} /> */}
      <Footer />
    </div>
  );
}
