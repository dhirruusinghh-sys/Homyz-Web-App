import { useState, useEffect } from 'react';
import { Search, MapPin, Bed, Bath, SlidersHorizontal, CalendarDays, ExternalLink } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BookVisitModal from '../components/modals/BookVisitModal';
import type { AppDispatch, RootState } from '../app/store';
import { getProperties } from '../features/properties/propertySlice';

export default function PropertiesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { properties, isLoading } = useSelector((state: RootState) => state.property);
  
  const [filters, setFilters] = useState({
    keyword: '',
    propertyType: '',
    bedrooms: '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest'
  });
  
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPropertiesData = () => {
    // Construct query string without empty values
    const queryObj: any = {};
    if (filters.keyword) queryObj.keyword = filters.keyword;
    if (filters.propertyType) queryObj.propertyType = filters.propertyType;
    if (filters.bedrooms) queryObj.bedrooms = filters.bedrooms;
    if (filters.minPrice) queryObj.minPrice = filters.minPrice;
    if (filters.maxPrice) queryObj.maxPrice = filters.maxPrice;
    if (filters.sort) queryObj.sort = filters.sort;
    
    // Default search for approved properties only
    queryObj.status = 'approved';

    const queryParams = new URLSearchParams(queryObj).toString();
    dispatch(getProperties(queryParams));
  };

  useEffect(() => {
    fetchPropertiesData();
  }, [dispatch]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPropertiesData();
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Discover Properties</h1>
          <p className="text-gray-600 max-w-2xl">Browse our extensive collection of premium real estate properties tailored to match your lifestyle and investment goals.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <div className="w-full lg:w-1/4">
            <form onSubmit={handleSearch} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-28 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <SlidersHorizontal className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-gray-900">Advanced Search</h3>
              </div>

              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input 
                    name="keyword"
                    value={filters.keyword}
                    onChange={handleFilterChange}
                    type="text" 
                    placeholder="Search city, address..." 
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                  />
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Property Type</label>
                  <select name="propertyType" value={filters.propertyType} onChange={handleFilterChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm">
                    <option value="">Any Type</option>
                    <option value="buy">For Sale</option>
                    <option value="rent">For Rent</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Budget Range</label>
                  <div className="flex gap-2">
                    <input type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} placeholder="Min $" className="w-1/2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none text-sm" />
                    <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} placeholder="Max $" className="w-1/2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none text-sm" />
                  </div>
                </div>

                {/* Rooms */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Minimum Rooms</label>
                  <select name="bedrooms" value={filters.bedrooms} onChange={handleFilterChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none text-sm">
                    <option value="">Any Bedrooms</option>
                    <option value="1">1+ Beds</option>
                    <option value="2">2+ Beds</option>
                    <option value="3">3+ Beds</option>
                    <option value="4">4+ Beds</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Sort By</label>
                  <select name="sort" value={filters.sort} onChange={handleFilterChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none text-sm">
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                </div>

                <button type="submit" className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-colors shadow-lg shadow-blue-500/20">
                  Search Properties
                </button>
              </div>
            </form>
          </div>

          {/* Properties Grid */}
          <div className="w-full lg:w-3/4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="bg-white h-80 rounded-2xl shadow-sm border border-gray-100 animate-pulse"></div>
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Properties Found</h3>
                <p className="text-gray-500">Try adjusting your search filters to find what you're looking for.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((property, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={property._id} 
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={property.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800'} 
                        alt={property.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary">
                        For Sale
                      </div>
                      <div className="absolute bottom-4 left-4 font-bold text-xl text-white drop-shadow-md">
                        ${property.price.toLocaleString()}
                      </div>
                      <Link to={`/properties/${property._id}`} className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full text-primary hover:scale-110 transition-transform">
                         <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                    
                    {/* Details */}
                    <div className="p-5">
                      <Link to={`/properties/${property._id}`}>
                        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 hover:text-primary transition-colors">{property.title}</h3>
                      </Link>
                      <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{property.city}, {property.state}</span>
                      </div>
                      
                      <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Bed className="w-4 h-4" />
                          <span>{property.bedrooms} Beds</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Bath className="w-4 h-4" />
                          <span>{property.bathrooms} Baths</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <SlidersHorizontal className="w-4 h-4" />
                          <span>{property.area} sqft</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-100">
                         <button 
                            onClick={() => { setSelectedProperty(property); setIsModalOpen(true); }}
                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl font-semibold transition-all duration-300"
                         >
                            <CalendarDays className="w-4 h-4" />
                            Book Visit
                         </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
      
      {selectedProperty && (
        <BookVisitModal 
           isOpen={isModalOpen} 
           onClose={() => setIsModalOpen(false)} 
           property={selectedProperty} 
        />
      )}
    </div>
  );
}
