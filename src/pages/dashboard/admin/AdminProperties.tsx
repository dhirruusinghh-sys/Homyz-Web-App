import { useState } from 'react';
import { Search, Filter, Home, MapPin, CheckCircle, XCircle, Trash2, Edit } from 'lucide-react';
import { motion } from 'framer-motion';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../app/store';
import { getAdminProperties, updateAdminPropertyStatus } from '../../../features/admin/adminSlice';

export default function AdminProperties() {
  const dispatch = useDispatch<AppDispatch>();
  const { properties, isLoading } = useSelector((state: RootState) => state.admin);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getAdminProperties());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      // API currently doesn't support hard delete for admin, we can change status to rejected
      dispatch(updateAdminPropertyStatus({ id, status: 'rejected' }));
    }
  };

  const handleToggleFeature = (id: string) => {
    // We would need an API endpoint to toggle featured status, 
    // for now we'll just alert since it's not in the controller yet.
    alert('Feature toggle requires backend update.');
  };

  const filteredProperties = properties?.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.location?.toLowerCase().includes(searchTerm.toLowerCase()) || p.city?.toLowerCase().includes(searchTerm.toLowerCase())) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Properties</h1>
          <p className="text-sm text-gray-500">View and manage all property listings on the platform</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
          <button className="p-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProperties.map((property, idx) => (
          <motion.div
            key={property._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col"
          >
            {/* Image Container */}
            <div className="relative h-48 overflow-hidden shrink-0">
              <img 
                src={property.images?.[0] || 'https://via.placeholder.com/600x400'} 
                alt={property.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                <button 
                  onClick={() => handleDelete(property._id)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm" 
                  title="Reject Property"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute top-3 left-3 flex gap-2">
                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg shadow-sm backdrop-blur-sm ${
                  property.status === 'approved' ? 'bg-green-500/90 text-white' : 
                  property.status === 'pending' ? 'bg-yellow-500/90 text-white' : 
                  'bg-red-500/90 text-white'
                }`}>
                  {property.status}
                </span>
                {property.featured && (
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg shadow-sm backdrop-blur-sm bg-purple-500/90 text-white">
                    Featured
                  </span>
                )}
              </div>
              <div className="absolute bottom-3 left-3 bg-white/95 text-gray-900 px-3 py-1 rounded-lg font-bold shadow-md text-sm">
                ${property.price?.toLocaleString()}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-bold text-base text-gray-900 truncate mb-1 group-hover:text-primary transition-colors">
                {property.title}
              </h3>
              
              <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-3">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="truncate">{property.city}, {property.state}</span>
              </div>

              <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 font-medium">Listed by</p>
                  <p className="text-xs font-semibold text-gray-700">{property.agent?.name || 'Unknown'}</p>
                </div>
                
                <button 
                  onClick={() => handleToggleFeature(property._id)}
                  className={`text-[10px] px-2.5 py-1.5 rounded-lg font-semibold transition-colors ${
                    property.featured 
                      ? 'bg-purple-50 text-purple-700 hover:bg-purple-100' 
                      : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {property.featured ? 'Unfeature' : 'Mark Featured'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {filteredProperties.length === 0 && (
        <div className="py-20 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Home className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-gray-900 font-semibold mb-1">No Properties Found</h3>
          <p className="text-sm text-gray-500">Try adjusting your search query.</p>
        </div>
      )}
    </div>
  );
}
