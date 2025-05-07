import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ListingItem from '../components/ListingItem';


// bug -> The search with previous, ongoing and previous events  is not working currently, but I think it will be fixed soon as the other types are working but I am currently some lazy so sorry for now
export default function Search() {
    const navigate = useNavigate();
    const [sidebardata, setSidebardata] = useState({
        sort: 'ticketfee',
        order: 'desc',
    })

    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        const sortFromUrl = urlParams.get('sort')
        const orderFromUrl = urlParams.get('order')

        if (searchTermFromUrl ||
            sortFromUrl ||
            orderFromUrl) {
            setSidebardata({
                searchTerm: searchTermFromUrl || '',
                sort: sortFromUrl || 'created_at',
                order: orderFromUrl || 'desc',
            });
        }

        const fetchListings = async () => {
            setLoading(true);
            setShowMore(false);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();

            if (data.length > 8) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }
            setListings(data);
            setLoading(false);
        };

        fetchListings();
    }, [location.search])

    const handleChange = (e) => {
        if (e.target.id === 'searchTerm') {
            setSidebardata({ ...sidebardata, searchTerm: e.target.value })
        }

        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at';

            const order = e.target.value.split('_')[1] || 'desc';

            setSidebardata({ ...sidebardata, sort, order });
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const urlParams = new URLSearchParams();

        urlParams.set('searchTerm', sidebardata.searchTerm)
        urlParams.set('sort', sidebardata.sort)
        urlParams.set('order', sidebardata.order)

        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`)
    }

    const onShowMoreClick = async () => {
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        console.log(searchQuery);
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if (data.length < 9) {
            setShowMore(false);
        }
        setListings([...listings, ...data]);
    };

    console.log(listings)

    return (
        <div className='flex flex-col md:flex-row min-h-screen'>
            {/* Search Filters Sidebar */}
            <div className='md:w-72 lg:w-80 bg-transparent p-6 md:p-8'>
                <h2 className='text-2xl font-semibold text-gray-800 mb-6'>Search Filters</h2>
                <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
                    <div className='space-y-2'>
                        <label className='block text-gray-700 font-medium'>Search Term</label>
                        <input
                            type="text"
                            id='searchTerm'
                            placeholder='Search events...'
                            className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-green-500'
                            value={sidebardata.searchTerm}
                            onChange={handleChange}
                        />
                    </div>

                    <div className='space-y-2'>
                        <label className='block text-gray-700 font-medium'>Sort By</label>
                        <select
                            onChange={handleChange}
                            defaultValue={'created_at_desc'}
                            className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-green-500'
                            id="sort_order"
                        >
                            <option value="createdAt_desc">Latest Events</option>
                            <option value="createdAt_asc">Oldest Events</option>
                            <option value="ticketfee_desc">Price: High to Low</option>
                            <option value="ticketfee_asc">Price: Low to High</option>
                        </select>
                    </div>

                    <button className='w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-300'>
                        Apply Filters
                    </button>
                </form>
            </div>

            {/* Results Section */}
            <div className='flex-1 p-6 md:p-8'>
                <div className='max-w-7xl mx-auto'>
                    <h1 className='text-3xl font-bold text-gray-800 mb-8'>Search Results</h1>

                    {loading && (
                        <div className='flex items-center justify-center min-h-[400px]'>
                            <div className='text-lg text-gray-600'>Loading events...</div>
                        </div>
                    )}

                    {!loading && listings.length === 0 && (
                        <div className='flex flex-col items-center justify-center min-h-[400px] text-center'>
                            <p className='text-xl text-gray-600 mb-2'>No events found</p>
                            <p className='text-gray-500'>Try adjusting your search criteria</p>
                        </div>
                    )}

                    <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {!loading && listings && listings.map((listing) => (
                            <ListingItem key={listing._id} listing={listing} />
                        ))}
                    </div>

                    {showMore && (
                        <div className='mt-8 text-center'>
                            <button
                                onClick={onShowMoreClick}
                                className='inline-flex items-center px-6 py-3 border-2 border-green-600 text-green-600 font-medium rounded-lg hover:bg-green-50 transition-colors duration-300'
                            >
                                Load More Events
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
