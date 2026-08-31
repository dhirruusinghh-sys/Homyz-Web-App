import { motion } from 'framer-motion';
import { Heart, MapPin, Bed, Bath, Square, Trash2, FileText } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../app/store';
import { toggleSavedProperty } from '../../../features/auth/authSlice';
import { Link } from 'react-router-dom';

export default function CustomerSaved() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);

  const handleRemove = (propertyId: string) => {
    dispatch(toggleSavedProperty(propertyId));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Saved Properties</h2>
        <p className="text-gray-500 text-sm">Your favorite properties for quick access</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {user?.savedProperties?.map((property: any, idx: number) => (
          <motion.div
            key={property._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group"
          >
            {/* Image Container */}
            <div className="relative h-56 overflow-hidden">
              <img 
                src={property.images?.[0] || 'https://via.placeholder.com/600x400?text=No+Image'} 
                alt={property.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <button 
                  onClick={() => handleRemove(property._id)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm" 
                  title="Remove"
                  disabled={isLoading}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute bottom-4 left-4 bg-primary text-white px-3 py-1 rounded-lg font-semibold shadow-md">
                ${property.price?.toLocaleString()}
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="font-bold text-lg text-gray-900 truncate mb-2 group-hover:text-primary transition-colors">
                {property.title}
              </h3>
              
              <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="truncate">{property.address}, {property.city}</span>
              </div>

              <div className="flex items-center justify-between py-4 border-y border-gray-100 mb-4">
                <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                  <Bed className="w-4 h-4 text-gray-400" />
                  <span>{property.bedrooms} Beds</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                  <Bath className="w-4 h-4 text-gray-400" />
                  <span>{property.bathrooms} Baths</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                  <Square className="w-4 h-4 text-gray-400" />
                  <span>{property.area} sqft</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">View details to know more</span>
                <Link to={`/properties/${property._id}`} className="text-sm font-semibold text-primary hover:text-blue-700 hover:underline">
                  View Details
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {!user?.savedProperties || user?.savedProperties.length === 0 ? (
        <div className="py-16 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-gray-900 font-semibold mb-1">No Saved Properties</h3>
          <p className="text-sm text-gray-500">You haven't saved any properties yet. Start exploring and click the heart icon to save.</p>
        </div>
      ) : null}
    </div>
  );
}
