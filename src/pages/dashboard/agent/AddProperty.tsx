import { useState, useEffect } from 'react';
import { UploadCloud, MapPin, DollarSign, Move, Video, Map } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../app/store';
import { createProperty, updateProperty, getPropertyById } from '../../../features/properties/propertySlice';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function AddProperty() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode
  const { isLoading, singleProperty } = useSelector((state: RootState) => state.property);

  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [floorPlans, setFloorPlans] = useState<File[]>([]);
  
  // Existing Media (Edit mode)
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [existingVideos, setExistingVideos] = useState<string[]>([]);
  const [existingFloorPlans, setExistingFloorPlans] = useState<string[]>([]);

  // Master Data
  const [categories, setCategories] = useState<any[]>([]);
  const [amenitiesList, setAmenitiesList] = useState<any[]>([]);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    propertyType: 'buy',
    price: '',
    area: '',
    bedrooms: '0',
    bathrooms: '0',
    address: '',
    city: '',
    state: '',
    country: 'US',
    googleMapsLink: '',
  });

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  useEffect(() => {
    // Fetch master data
    const fetchMasterData = async () => {
      try {
        const [catRes, amRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/public/categories`),
          axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/public/amenities`)
        ]);
        setCategories(catRes.data);
        setAmenitiesList(amRes.data);
      } catch (error) {
        console.error("Failed to load master data", error);
      }
    };
    fetchMasterData();
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(getPropertyById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (id && singleProperty) {
      setFormData({
        title: singleProperty.title || '',
        description: singleProperty.description || '',
        category: singleProperty.category?._id || singleProperty.category || '',
        propertyType: singleProperty.propertyType || 'buy',
        price: singleProperty.price?.toString() || '',
        area: singleProperty.area?.toString() || '',
        bedrooms: singleProperty.bedrooms?.toString() || '0',
        bathrooms: singleProperty.bathrooms?.toString() || '0',
        address: singleProperty.address || '',
        city: singleProperty.city || '',
        state: singleProperty.state || '',
        country: singleProperty.country || 'US',
        googleMapsLink: singleProperty.googleMapsLink || '',
      });
      setSelectedAmenities(singleProperty.amenities?.map((a: any) => a._id || a) || []);
      setExistingImages(singleProperty.images || []);
      setExistingVideos(singleProperty.videos || []);
      setExistingFloorPlans(singleProperty.floorPlans || []);
    }
  }, [singleProperty, id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAmenityToggle = (amenityId: string) => {
    if (selectedAmenities.includes(amenityId)) {
      setSelectedAmenities(selectedAmenities.filter(id => id !== amenityId));
    } else {
      setSelectedAmenities([...selectedAmenities, amenityId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value);
    });

    submitData.append('amenities', JSON.stringify(selectedAmenities));

    images.forEach(img => submitData.append('images', img));
    videos.forEach(vid => submitData.append('videos', vid));
    floorPlans.forEach(fp => submitData.append('floorPlans', fp));

    try {
      if (id) {
        await dispatch(updateProperty({ id, propertyData: submitData })).unwrap();
        toast.success('Property Updated Successfully!');
      } else {
        await dispatch(createProperty(submitData)).unwrap();
        toast.success('Property Added Successfully!');
      }
      navigate('/dashboard/agent/properties');
    } catch (error: any) {
      toast.error(error || 'Failed to save property');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{id ? 'Edit Property' : 'Add New Property'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
        
        {/* Basic Details */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Property Title</label>
              <input name="title" value={formData.title} onChange={handleInputChange} required type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="e.g. Modern Luxury Villa" />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Property Type</label>
              <select name="propertyType" value={formData.propertyType} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none bg-white">
                <option value="buy">For Sale (Buy)</option>
                <option value="rent">For Rent</option>
                <option value="commercial">Commercial</option>
                <option value="residential">Residential</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} required rows={4} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Describe the property..."></textarea>
          </div>
        </div>

        {/* Pricing & Dimensions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Pricing & Dimensions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1 relative">
              <label className="text-sm font-medium text-gray-700">Price ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input name="price" value={formData.price} onChange={handleInputChange} required type="number" className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="0" />
              </div>
            </div>

            <div className="space-y-1 relative">
              <label className="text-sm font-medium text-gray-700">Area (SqFt)</label>
              <div className="relative">
                <Move className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input name="area" value={formData.area} onChange={handleInputChange} required type="number" className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" placeholder="0" />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select name="category" value={formData.category} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none bg-white">
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Rooms & Location */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Rooms & Location</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Bedrooms</label>
              <input name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} type="number" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20" placeholder="0" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Bathrooms</label>
              <input name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} type="number" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20" placeholder="0" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-1 relative">
              <label className="text-sm font-medium text-gray-700">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input name="address" value={formData.address} onChange={handleInputChange} required type="text" className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20" placeholder="123 Main St" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">City</label>
              <input name="city" value={formData.city} onChange={handleInputChange} required type="text" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20" placeholder="City" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">State</label>
              <input name="state" value={formData.state} onChange={handleInputChange} required type="text" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20" placeholder="State" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Country</label>
              <input name="country" value={formData.country} onChange={handleInputChange} required type="text" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20" placeholder="Country" />
            </div>
          </div>
        </div>

        {/* Extended Details */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Amenities & Maps</h2>
          
          <div className="space-y-2">
             <label className="text-sm font-medium text-gray-700">Select Amenities</label>
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {amenitiesList.map(amenity => (
                   <label key={amenity._id} className="flex items-center gap-2 cursor-pointer p-2 border rounded-lg hover:bg-gray-50">
                      <input 
                         type="checkbox" 
                         checked={selectedAmenities.includes(amenity._id)}
                         onChange={() => handleAmenityToggle(amenity._id)}
                         className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{amenity.name}</span>
                   </label>
                ))}
             </div>
          </div>

          <div className="space-y-1 pt-2">
            <label className="text-sm font-medium text-gray-700">Google Maps Embed Link (Optional)</label>
            <input name="googleMapsLink" value={formData.googleMapsLink} onChange={handleInputChange} type="url" className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20" placeholder="https://www.google.com/maps/embed?pb=..." />
            <p className="text-xs text-gray-500">Go to Google Maps &gt; Share &gt; Embed a map &gt; Copy the `src` URL.</p>
          </div>
        </div>

        {/* Media Uploads */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Media Uploads</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Images */}
            <div>
               <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors">
                 <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                 <label className="text-primary text-sm font-medium cursor-pointer hover:underline">
                   Upload New Images
                   <input 
                     type="file" multiple accept="image/*" className="hidden" 
                     onChange={(e) => e.target.files && setImages(Array.from(e.target.files))}
                   />
                 </label>
                 {images.length > 0 && <p className="text-xs text-green-600 mt-1">{images.length} new file(s)</p>}
               </div>
               {existingImages.length > 0 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                     {existingImages.map((img, i) => (
                        <div key={i} className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border">
                           <img src={img} alt="Existing" className="w-full h-full object-cover" />
                        </div>
                     ))}
                  </div>
               )}
            </div>
            
            {/* Videos */}
            <div>
               <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors">
                 <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                 <label className="text-primary text-sm font-medium cursor-pointer hover:underline">
                   Upload New Video
                   <input 
                     type="file" accept="video/mp4,video/webm" className="hidden" 
                     onChange={(e) => e.target.files && setVideos(Array.from(e.target.files))}
                   />
                 </label>
                 {videos.length > 0 && <p className="text-xs text-green-600 mt-1">{videos.length} new file(s)</p>}
               </div>
               {existingVideos.length > 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                     {existingVideos.length} existing video(s)
                  </div>
               )}
            </div>

            {/* Floor Plans */}
            <div>
               <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors">
                 <Map className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                 <label className="text-primary text-sm font-medium cursor-pointer hover:underline">
                   Upload Floor Plans
                   <input 
                     type="file" multiple accept="image/*" className="hidden" 
                     onChange={(e) => e.target.files && setFloorPlans(Array.from(e.target.files))}
                   />
                 </label>
                 {floorPlans.length > 0 && <p className="text-xs text-green-600 mt-1">{floorPlans.length} new file(s)</p>}
               </div>
               {existingFloorPlans.length > 0 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                     {existingFloorPlans.map((img, i) => (
                        <div key={i} className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border">
                           <img src={img} alt="Floor plan" className="w-full h-full object-cover" />
                        </div>
                     ))}
                  </div>
               )}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex justify-end">
          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-primary hover:bg-blue-700 disabled:bg-blue-300 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : null}
            {isLoading ? (id ? 'Updating...' : 'Publishing...') : (id ? 'Update Property' : 'Publish Property')}
          </button>
        </div>

      </form>
    </div>
  );
}
