import { Star, Home, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const myReviews = [
  {
    id: '1',
    property: 'Modern Villa in Beverly Hills',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    date: 'Aug 10, 2026',
    comment: 'Absolutely stunning property. The agent was incredibly helpful and walked us through every detail of the house. The neighborhood is very quiet and peaceful.',
  },
  {
    id: '2',
    property: 'Luxury Penthouse',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=200',
    rating: 4,
    date: 'Jul 15, 2026',
    comment: 'Great location and amazing views of the city skyline. The only downside was that the parking space was a bit tight, but otherwise a fantastic place.',
  }
];

export default function CustomerReviews() {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, idx) => (
      <Star 
        key={idx} 
        className={`w-4 h-4 ${idx < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} 
      />
    ));
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Reviews</h2>
          <p className="text-gray-500 text-sm">Manage the reviews you've left for properties and agents</p>
        </div>
      </div>

      <div className="grid gap-6">
        {myReviews.map((review, idx) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 group hover:shadow-md transition-shadow"
          >
            {/* Property Image Thumbnail */}
            <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden shrink-0">
              <img 
                src={review.image} 
                alt="Property" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                    <Home className="w-4 h-4 text-gray-400" />
                    {review.property}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-xs font-medium text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                </div>

                {/* Actions Dropdown placeholder */}
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mt-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                "{review.comment}"
              </p>

              <div className="flex items-center gap-3 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-blue-700 transition-colors">
                  <Edit2 className="w-3.5 h-3.5" /> Edit Review
                </button>
                <button className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {myReviews.length === 0 && (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No Reviews Yet</h3>
            <p className="text-gray-500 mt-1">You haven't left any reviews for properties or agents.</p>
          </div>
        )}
      </div>
    </div>
  );
}
