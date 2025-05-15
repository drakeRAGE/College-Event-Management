// bug-> the startdate and enddate values dont show up for updating

import { useState, useEffect } from 'react'
import { getDownloadURL, ref, getStorage, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
export default function CreateListing() {
    const max_50 = "{max 50}";
    const { currentUser } = useSelector(state => state.user);
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const params = useParams();

    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        // regularPrice: 50,
        // discountPrice: 50,
        // type: 'all',
        // offer: false,
        // author: '',
        // published: true,
        // BooksQuantity : 1,
        // Pages: 50,
        // Chapters: 1,
        location: '',
        organizer_name: '',
        sponsers_detail: '',
        organizational_detail: '',
        ticketfee: 0,
    });

    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setuploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    // console.log(formData)

    useEffect(() => {
        const fetchListing = async () => {
            const listingId = params.listingId;

            const res = await fetch(`/api/listing/get/${listingId}`);
            const data = await res.json();

            if (data.success === false) {
                console.log(data.message)
                return;
            }
            setFormData(data)

        }

        fetchListing();
    }, []);


    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 51) {
            setuploading(true)
            setImageUploadError(false)
            const promises = [];
            for (let i = 0; i < files.length; i++) {
                promises.push(uploadImage(files[i]));
            }
            Promise.all(promises).then((urls) => {
                setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
                setImageUploadError(false);
                setuploading(false)
            }).catch((error) => {
                setImageUploadError("Image Upload Failed (100 MB max): ");
                setuploading(false)
            })
        } else {
            setImageUploadError("You can only upload up to 50 images.");
            setuploading(false)
        }
    }

    const uploadImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            // Listen for state changes on the upload task.
            uploadTask.on('state-changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${progress}% done`)
            }, (error) => {
                reject(error);
            },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                })
        });
    }

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index),
        })

        console.log('working')
    }

    const handleChange = (e) => {

        if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea' || e.target.type === 'date') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.imageUrls.length < 1)
                return setError('You must upload at least one image');
            setLoading(true);
            setError(false);
            const res = await fetch(`/api/listing/update/${params.listingId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                }),
            });
            const data = await res.json();
            setLoading(false);
            if (data.success === false) {
                setError(data.message);
            }
            navigate(`/listing/${data._id}`);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };
    return (
        <main className='p-8 max-w-5xl mx-auto'>
            <h1 className='text-3xl font-bold text-gray-800 text-center mb-10'>Update Event</h1>

            <form onSubmit={handleSubmit} className='flex flex-col lg:flex-row gap-8'>
                {/* Left Column - Event Details */}
                <div className='flex flex-col gap-8 flex-1'>
                    <div className='bg-white p-6 rounded-xl shadow-sm'>
                        <h2 className='text-xl font-semibold text-gray-800 mb-6'>Event Details</h2>
                        <div className='space-y-5'>
                            <div>
                                <label className='block text-gray-700 font-medium mb-2'>Event Name</label>
                                <input
                                    type='text'
                                    placeholder='Enter event name'
                                    className='w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:border-green-500'
                                    onChange={handleChange}
                                    value={formData.name}
                                    id='name'
                                    maxLength='40'
                                    minLength='5'
                                />
                            </div>
                            <div>
                                <label className='block text-gray-700 font-medium mb-2'>Description</label>
                                <textarea
                                    placeholder='Describe your event'
                                    className='w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:border-green-500 min-h-[120px]'
                                    onChange={handleChange}
                                    value={formData.description}
                                    id='description'
                                />
                            </div>
                            <div>
                                <label className='block text-gray-700 font-medium mb-2'>Location</label>
                                <input
                                    type='text'
                                    placeholder='Event venue'
                                    className='w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:border-green-500'
                                    onChange={handleChange}
                                    value={formData.location}
                                    id='location'
                                />
                            </div>
                        </div>
                    </div>

                    <div className='bg-white p-6 rounded-xl shadow-sm'>
                        <h2 className='text-xl font-semibold text-gray-800 mb-6'>Organization Information</h2>
                        <div className='space-y-5'>
                            <div>
                                <label className='block text-gray-700 font-medium mb-2'>Organizer Name</label>
                                <input
                                    type='text'
                                    placeholder='Name of the organizer'
                                    className='w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:border-green-500'
                                    onChange={handleChange}
                                    value={formData.organizer_name}
                                    id='organizer_name'
                                />
                            </div>
                            <div>
                                <label className='block text-gray-700 font-medium mb-2'>Sponsors</label>
                                <input
                                    type='text'
                                    placeholder='Sponsor details'
                                    className='w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:border-green-500'
                                    onChange={handleChange}
                                    value={formData.sponsers_detail}
                                    id='sponsers_detail'
                                />
                            </div>
                            <div>
                                <label className='block text-gray-700 font-medium mb-2'>Organization Details</label>
                                <input
                                    type='text'
                                    placeholder='Additional organization information'
                                    className='w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:border-green-500'
                                    onChange={handleChange}
                                    value={formData.organizational_detail}
                                    id='organizational_detail'
                                />
                            </div>
                        </div>
                    </div>

                    <div className='bg-white p-6 rounded-xl shadow-sm'>
                        <h2 className='text-xl font-semibold text-gray-800 mb-6'>Event Schedule & Pricing</h2>
                        <div className='space-y-5'>
                            <div>
                                <label className='block text-gray-700 font-medium mb-2'>Ticket Fee (₹)</label>
                                <input
                                    type="number"
                                    className='w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:border-green-500'
                                    onChange={handleChange}
                                    value={formData.ticketfee}
                                    id='ticketfee'
                                    min='0'
                                    max='50000'
                                />
                            </div>
                            {/* <div className='grid sm:grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-gray-700 font-medium mb-2'>Start Date</label>
                                    <input
                                        type="datetime-local"
                                        className='w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:border-green-500'
                                        onChange={handleChange}
                                        value={formData.startDate}
                                        id='startDate'
                                    />
                                </div>
                                <div>
                                    <label className='block text-gray-700 font-medium mb-2'>End Date</label>
                                    <input
                                        type="datetime-local"
                                        className='w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:border-green-500'
                                        onChange={handleChange}
                                        value={formData.endDate}
                                        id='endDate'
                                    />
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>

                {/* Right Column - Images */}
                <div className='flex flex-col gap-6 lg:w-[400px]'>
                    <div className='bg-white p-6 rounded-xl shadow-sm'>
                        <h2 className='text-xl font-semibold text-gray-800 mb-4'>Event Images</h2>
                        <p className='text-gray-600 mb-6 text-sm'>First image will be the cover (max 50 images)</p>

                        <div className='space-y-4'>
                            <input
                                onChange={(e) => setFiles(e.target.files)}
                                className='w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500'
                                type="file"
                                id='images'
                                accept='image/*'
                                multiple
                            />
                            <button
                                type='button'
                                onClick={handleImageSubmit}
                                disabled={uploading}
                                className='w-full py-3 text-green-700 border-2 border-green-600 rounded-lg font-medium hover:bg-green-50 disabled:opacity-70 disabled:cursor-not-allowed'
                            >
                                {uploading ? 'Uploading...' : 'Upload Images'}
                            </button>
                            {imageUploadError && (
                                <p className='text-red-600 text-sm bg-red-50 p-3 rounded-lg'>{imageUploadError}</p>
                            )}
                        </div>

                        <div className='mt-6 space-y-3'>
                            {formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                                <div key={index} className='flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200'>
                                    <img src={url} alt="listing" className='w-20 h-20 object-cover rounded-lg' />
                                    <button
                                        type='button'
                                        onClick={() => handleRemoveImage(index)}
                                        className='px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium disabled:opacity-50'
                                        disabled={uploading}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        disabled={loading || uploading}
                        className='w-full py-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm'
                    >
                        {loading ? 'Updating...' : 'Update Event'}
                    </button>

                    {error && (
                        <p className='text-red-600 text-sm bg-red-50 p-4 rounded-lg border border-red-100'>
                            {error}
                        </p>
                    )}
                </div>
            </form>
        </main>
    )
}
