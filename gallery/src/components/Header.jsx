import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import pantnagar from '../assets/pantnagar.png'

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };


  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('searchTerm');
    if (searchTerm) {
      setSearchTerm(searchTerm);
    }
  }, [location.search]);

  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <div className="w-full bg-gray-400 shadow-md border-b border-gray-200">
      <div className="flex flex-col max-w-screen-xl px-4 mx-auto md:items-center md:justify-between md:flex-row md:px-6 lg:px-8">
        <div className="p-4 flex flex-row items-center justify-between">
          <a href="/" className="flex items-center space-x-2 min-w-[140px]">
            <img src={pantnagar} alt="pantnagar" className='h-10 w-10' />
            <span className="text-2xl font-bold text-gray-800">GBPUAT</span>
          </a>
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="p-2 mr-2 hover:bg-gray-300 rounded-lg"
            >
              <FaSearch className="text-gray-700" />
            </button>
            <button className="rounded-lg focus:outline-none focus:shadow-outline" onClick={toggleMenu}>
              <svg fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6 text-gray-700">
                <path d={menuOpen ? 'M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z' : 'M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z'} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="px-4 pb-4 md:hidden">
            <form onSubmit={handleSubmit} className="flex bg-white border border-gray-200 rounded-lg items-center w-full">
              <input
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                type="text"
                placeholder="Search..."
                className="bg-transparent text-gray-800 focus:outline-none px-4 py-2 w-full"
              />
              <button className="p-2 hover:bg-gray-100 text-gray-600 hover:text-gray-800 rounded-r-lg transition-colors duration-300">
                <FaSearch className="text-xl" />
              </button>
            </form>
          </div>
        )}

        {/* Desktop Search Bar - adjusted width and margins */}
        <form onSubmit={handleSubmit} className="hidden md:flex bg-white border border-gray-200 rounded-lg items-center mx-2 lg:mx-4 w-full max-w-[300px] lg:max-w-md">
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            type="text"
            placeholder="Search..."
            className="bg-transparent text-gray-800 focus:outline-none px-4 py-2 w-full"
          />
          <button className="p-2 hover:bg-gray-100 text-gray-600 hover:text-gray-800 rounded-r-lg transition-colors duration-300">
            <FaSearch className="text-xl" />
          </button>
        </form>
        <nav className={`flex-col flex-grow pb-4 md:pb-0 md:flex md:justify-end md:flex-row ${menuOpen ? 'flex' : 'hidden'}`}>
          <a className="px-4 py-2 mt-2 text-sm font-semibold text-gray-700 rounded-lg md:mt-0 md:ml-4 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" href="/">Home</a>
          <a className="px-4 py-2 mt-2 text-sm font-semibold text-gray-700 rounded-lg md:mt-0 md:ml-4 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" href="/about">About</a>
          <a className="px-4 py-2 mt-2 text-sm font-semibold text-gray-700 rounded-lg md:mt-0 md:ml-4 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" href="/contact">Contact</a>
          <a className="px-4 py-2 mt-2 text-sm font-semibold text-gray-700 rounded-lg md:mt-0 md:ml-4 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" href="/events">Events</a>
          <Link to="profile" className="ml-4">
            {currentUser ? (
              <img className="rounded-full h-10 w-10 object-cover border-2 border-gray-300" src={currentUser.avatar} alt="profile" />
            ) : (
              <button className="px-4 py-2 mt-2 text-sm font-semibold text-white bg-gray-700 rounded-lg md:mt-0 hover:bg-gray-600 focus:outline-none focus:shadow-outline">
                Log-in
              </button>
            )}
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Header;
