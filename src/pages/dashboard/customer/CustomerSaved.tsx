import { motion } from 'framer-motion';
import { Heart, MapPin, Bed, Bath, Square, Trash2 } from 'lucide-react';

const savedProperties = [
  {
    id: '1',
    title: 'Modern Villa in Beverly Hills',
    price: '$2,500,000',
    location: '123 Palm Ave, Beverly Hills, CA',
    beds: 4,
    baths: 3,
    sqft: 3500,
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=600',
    addedDate: '2 days ago',
  },
  {
    id: '2',
    title: 'Luxury Penthouse',
    price: '$1,850,000',
    location: 'Downtown Core, New York, NY',
    beds: 3,
    baths: 2.5,
    sqft: 2200,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600',
    addedDate: '1 week ago',
  },
  {
    id: '3',
    title: 'Minimalist Beachside Home',
    price: '$3,200,000',
    location: 'Malibu Coast, Malibu, CA',
    beds: 5,
    baths: 4,
    sqft: 4100,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600',
    addedDate: '3 weeks ago',
  }
];

export default function CustomerSaved() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Saved Properties</h2>
        <p className="text-gray-500 text-sm">Your favorite properties for quick access</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {savedProperties.map((property, idx) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group"
          >
            {/* Image Container */}
            <div className="relative h-56 overflow-hidden">
              <img 
                src={property.image} 
                alt={property.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm" title="Remove">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute bottom-4 left-4 bg-primary text-white px-3 py-1 rounded-lg font-semibold shadow-md">
                {property.price}
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="font-bold text-lg text-gray-900 truncate mb-2 group-hover:text-primary transition-colors">
                {property.title}
              </h3>
              
              <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="truncate">{property.location}</span>
              </div>

              <div className="flex items-center justify-between py-4 border-y border-gray-100 mb-4">
                <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                  <Bed className="w-4 h-4 text-gray-400" />
                  <span>{property.beds} Beds</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                  <Bath className="w-4 h-4 text-gray-400" />
                  <span>{property.baths} Baths</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                  <Square className="w-4 h-4 text-gray-400" />
                  <span>{property.sqft} sqft</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">Added {property.addedDate}</span>
                <button className="text-sm font-semibold text-primary hover:text-blue-700 hover:underline">
                  View Details
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
