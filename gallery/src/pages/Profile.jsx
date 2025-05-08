import { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase';
import { updateUserFailure, updateUserStart, updateUserSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess, signoutUserStart, signInFailure, signoutUserSuccess } from '../redux/user/userSlice'
import { Link } from 'react-router-dom'

export default function Profile() {
  const fielRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFIlePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  // console.log(filePercentage);
  // console.log(file);
  // console.log(fileUploadError);
  // console.log(formData);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is'+ progress + '% done');
        setFIlePercentage(Math.round(progress));
      },
      (_error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );

  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signoutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }

      dispatch(signoutUserSuccess(data));
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  }

  const handleShowListing = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();

      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  }

  // Add this state at the top with other states
  const [showDeleteEventModal, setShowDeleteEventModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
      setShowDeleteEventModal(false);
      setEventToDelete(null);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div style={{ minHeight: '92vh' }} className='p-8 max-w-3xl mx-auto'>
      <h1 className='text-xl font-bold text-gray-800 text-center mb-10'>Profile Settings</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fielRef} hidden accept='image/*' />
        <div className='flex flex-col items-center gap-3'>
          <img
            onClick={() => fielRef.current.click()}
            src={formData.avatar || currentUser.avatar}
            alt="profile"
            className='rounded-full h-28 w-28 object-cover cursor-pointer border-4 border-white shadow-md hover:opacity-90 transition'
          />
          <p className='text-sm font-medium'>
            {fileUploadError ? (
              <span className='text-red-600'>Error: Image must be less than 2mb</span>
            ) : filePercentage > 0 && filePercentage < 100 ? (
              <span className='text-gray-600'>{`Uploading ${filePercentage}%`}</span>
            ) : filePercentage === 100 ? (
              <span className='text-green-600'>Successfully uploaded</span>
            ) : (
              <span className='text-gray-500'>Click to change profile picture</span>
            )}
          </p>
        </div>

        <div className='space-y-4'>
          <input
            type="text"
            placeholder='Username'
            className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-green-500'
            defaultValue={currentUser.username}
            onChange={handleChange}
            id='username'
          />
          <input
            type="email"
            placeholder='Email'
            className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-green-500'
            defaultValue={currentUser.email}
            onChange={handleChange}
            id='email'
          />
          <input
            type="password"
            placeholder='New Password'
            className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-green-500'
            onChange={handleChange}
            id='password'
          />
        </div>

        <div className='space-y-4 pt-4'>
          <button
            disabled={loading}
            className='w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-70'
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>

          <Link
            className='block w-full py-3 rounded-lg font-medium text-center border-2 border-green-600 text-green-600 hover:bg-green-50 transition'
            to={'/create-listing'}
          >
            Create Event
          </Link>
        </div>
      </form>

      <div className='flex justify-between mt-8 pt-6 border-t'>
        <button
          onClick={() => setShowDeleteModal(true)}
          className='text-red-600 hover:text-red-700 font-medium'
        >
          Delete Account
        </button>
        <button
          onClick={() => setShowSignOutModal(true)}
          className='text-red-600 hover:text-red-700 font-medium'
        >
          Sign Out
        </button>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Delete Account</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteUser();
                  setShowDeleteModal(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sign Out Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign Out</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to sign out of your account?
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowSignOutModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleSignOut();
                  setShowSignOutModal(false);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Delete Event</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this event? This action cannot be undone.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => {
                  setShowDeleteEventModal(false);
                  setEventToDelete(null);
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleListingDelete(eventToDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}

      {error && <p className='text-red-600 mt-5'>{error}</p>}
      {updateSuccess && <p className='text-green-600 mt-5'>Profile updated successfully!</p>}

      <div className='mt-12'>
        <button
          onClick={handleShowListing}
          className='w-full text-gray-700 font-medium hover:text-gray-900 transition'
        >
          Show My Events
        </button>

        {showListingsError &&
          <p className='text-red-600 mt-3'>Error loading events</p>
        }

        {userListings && userListings.length > 0 && (
          <div className='mt-8'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-6'>Your Events</h2>
            <div className='space-y-4'>
              {userListings && userListings.length === 0 && (
                <p className='text-gray-600 text-center mt-4'>
                  No events created yet
                </p>
              )}
              {userListings.map((listing) => (
                <div key={listing._id} className='border border-gray-200 rounded-lg p-4 flex flex-col gap-4 bg-white/50 hover:bg-white/60 transition'>
                  <div className='flex gap-4'>
                    <img
                      src={listing.imageUrls[0]}
                      alt='listing cover'
                      className='h-24 w-24 object-cover rounded-lg flex-shrink-0'
                    />
                    <div className='flex-1 min-w-0'>
                      <h3 className='text-lg font-semibold text-gray-800 mb-2 truncate'>
                        {listing.name}
                      </h3>
                      <p className='text-sm text-gray-600 line-clamp-2 overflow-hidden'>
                        {listing.description}
                      </p>
                    </div>
                  </div>

                  <div className='flex justify-end gap-4 pt-2 border-t border-gray-100'>
                    <Link
                      to={`/update-listing/${listing._id}`}
                      className='px-4 py-1.5 text-green-600 hover:bg-green-50 rounded-md font-medium text-sm'
                    >
                      Edit Event
                    </Link>
                    <button
                      onClick={() => {
                        setEventToDelete(listing._id);
                        setShowDeleteEventModal(true);
                      }}
                      className='px-4 py-1.5 text-red-600 hover:bg-red-50 rounded-md font-medium text-sm'
                    >
                      Delete Event
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


      </div>
    </div>
  )
}
