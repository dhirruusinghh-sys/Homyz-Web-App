import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../app/store';
import { getCustomerReviews, deleteReview } from '../../../features/reviews/reviewSlice';
import { Star, Home, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CustomerReviews() {
  const dispatch = useDispatch<AppDispatch>();
  const { reviews, isLoading } = useSelector((state: RootState) => state.review);

  useEffect(() => {
    dispatch(getCustomerReviews());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      dispatch(deleteReview(id));
    }
  };

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
          <p className="text-gray-500 text-sm">Manage the reviews you've left for properties</p>
        </div>
      </div>

      <div className="grid gap-6">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {reviews?.map((review: any, idx: number) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 group hover:shadow-md transition-shadow"
              >
                {/* Property Image Thumbnail */}
                <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center">
                  {review.property?.images?.[0] ? (
                    <img 
                      src={review.property.images[0]} 
                      alt="Property" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <Home className="w-8 h-8 text-gray-300" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                        <Home className="w-4 h-4 text-gray-400" />
                        {review.property?.title || 'Unknown Property'}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-xs font-medium text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mt-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    "{review.comment}"
                  </p>

                  <div className="flex items-center gap-3 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleDelete(review._id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {(!reviews || reviews.length === 0) && (
              <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
                <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900">No Reviews Yet</h3>
                <p className="text-gray-500 mt-1">You haven't left any reviews for properties.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
