import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../app/store';
import { MapPin, Bed, Bath, Move, CalendarDays, CheckCircle2, Building, ChevronLeft, ChevronRight, X, Star } from 'lucide-react';
import { getPropertyReviews, createReview } from '../features/reviews/reviewSlice';
import BookVisitModal from '../components/modals/BookVisitModal';
import MessageAgentModal from '../components/modals/MessageAgentModal';
import { motion, AnimatePresence } from 'framer-motion';
import PropertyMap from '../components/ui/PropertyMap';

export default function PropertyDetails() {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { singleProperty, isLoading } = useSelector((state: RootState) => state.property);
  const { propertyReviews } = useSelector((state: RootState) => state.review);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [activeMedia, setActiveMedia] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getPropertyById(id));
      dispatch(getPropertyReviews(id));
    }
  }, [id, dispatch]);

  if (isLoading || !singleProperty) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const allMedia = [
    ...(singleProperty.images || []).map((url: string) => ({ type: 'image', url })),
    ...(singleProperty.videos || []).map((url: string) => ({ type: 'video', url }))
  ];

  const handleNextMedia = () => setActiveMedia((prev) => (prev + 1) % allMedia.length);
  const handlePrevMedia = () => setActiveMedia((prev) => (prev - 1 + allMedia.length) % allMedia.length);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert('Please login to write a review');
    setIsSubmitting(true);
    await dispatch(createReview({ propertyId: id, rating, comment }));
    setComment('');
    setRating(5);
    setIsSubmitting(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider rounded-full">
                {singleProperty.propertyType === 'buy' ? 'For Sale' : singleProperty.propertyType === 'rent' ? 'For Rent' : singleProperty.propertyType}
              </span>
              <span className="px-3 py-1 bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-full">
                {singleProperty.category?.name || 'Property'}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{singleProperty.title}</h1>
            <div className="flex items-center text-gray-500 gap-2">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span>{singleProperty.address}, {singleProperty.city}, {singleProperty.state} {singleProperty.country}</span>
            </div>
          </div>
          <div className="text-left md:text-right">
            <p className="text-4xl font-bold text-primary">${singleProperty.price.toLocaleString()}</p>
            {singleProperty.area && <p className="text-gray-500">{(singleProperty.price / singleProperty.area).toFixed(0)} / sq ft</p>}
          </div>
        </div>

        {/* Gallery Preview */}
        {allMedia.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[400px] md:h-[500px] mb-8 rounded-2xl overflow-hidden shadow-sm relative group">
            <div 
              className="md:col-span-3 row-span-2 cursor-pointer relative"
              onClick={() => setIsGalleryOpen(true)}
            >
              {allMedia[0].type === 'image' ? (
                 <img src={allMedia[0].url} alt="Main" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
              ) : (
                 <video src={allMedia[0].url} className="w-full h-full object-cover" controls />
              )}
            </div>
            {allMedia.length > 1 && (
               <div className="hidden md:block row-span-1 cursor-pointer overflow-hidden" onClick={() => setIsGalleryOpen(true)}>
                 {allMedia[1].type === 'image' ? (
                    <img src={allMedia[1].url} alt="Sub 1" className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                 ) : (
                    <video src={allMedia[1].url} className="w-full h-full object-cover" />
                 )}
               </div>
            )}
            {allMedia.length > 2 && (
               <div className="hidden md:block row-span-1 cursor-pointer overflow-hidden relative" onClick={() => setIsGalleryOpen(true)}>
                 {allMedia[2].type === 'image' ? (
                    <img src={allMedia[2].url} alt="Sub 2" className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                 ) : (
                    <video src={allMedia[2].url} className="w-full h-full object-cover" />
                 )}
                 {allMedia.length > 3 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-xl backdrop-blur-sm transition-colors hover:bg-black/40">
                       +{allMedia.length - 3} Photos
                    </div>
                 )}
               </div>
            )}
            <button 
               onClick={() => setIsGalleryOpen(true)}
               className="absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-white/90 backdrop-blur px-4 py-2 rounded-lg font-bold shadow-lg hover:bg-white transition-colors text-sm"
            >
               Show all photos
            </button>
          </div>
        )}

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Info */}
          <div className="flex-1 space-y-8">
             
            {/* Quick Stats */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap justify-between gap-4">
               <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                     <Bed className="w-6 h-6" />
                  </div>
                  <div>
                     <p className="text-gray-500 text-sm font-semibold">Bedrooms</p>
                     <p className="font-bold text-lg">{singleProperty.bedrooms}</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                     <Bath className="w-6 h-6" />
                  </div>
                  <div>
                     <p className="text-gray-500 text-sm font-semibold">Bathrooms</p>
                     <p className="font-bold text-lg">{singleProperty.bathrooms}</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                     <Move className="w-6 h-6" />
                  </div>
                  <div>
                     <p className="text-gray-500 text-sm font-semibold">Area</p>
                     <p className="font-bold text-lg">{singleProperty.area} <span className="text-sm font-normal text-gray-500">sqft</span></p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                     <Building className="w-6 h-6" />
                  </div>
                  <div>
                     <p className="text-gray-500 text-sm font-semibold">Furnished</p>
                     <p className="font-bold text-lg capitalize">{singleProperty.furnished || 'Unfurnished'}</p>
                  </div>
               </div>
            </div>

            {/* Description */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
               <h2 className="text-2xl font-bold mb-4">About this property</h2>
               <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {singleProperty.description}
               </div>
            </div>

            {/* Amenities */}
            {singleProperty.amenities && singleProperty.amenities.length > 0 && (
               <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold mb-6">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                     {singleProperty.amenities.map((amenity: any) => (
                        <div key={amenity._id} className="flex items-center gap-3 text-gray-700">
                           <CheckCircle2 className="w-5 h-5 text-primary" />
                           <span className="font-medium">{amenity.name}</span>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {/* Floor Plans */}
            {singleProperty.floorPlans && singleProperty.floorPlans.length > 0 && (
               <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold mb-6">Floor Plans</h2>
                  <div className="grid grid-cols-1 gap-6">
                     {singleProperty.floorPlans.map((fp: string, idx: number) => (
                        <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden p-4">
                           <img src={fp} alt={`Floor Plan ${idx + 1}`} className="w-full h-auto object-contain" />
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {/* Map */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-6">Location</h2>
              <PropertyMap 
                address={singleProperty.address}
                city={singleProperty.city}
                state={singleProperty.state}
                country={singleProperty.country}
                title={singleProperty.title}
              />
            </div>

            {/* Reviews Section */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-6">Reviews ({propertyReviews?.length || 0})</h2>
              
              {/* Review Form */}
              {user ? (
                <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="font-semibold text-lg mb-4 text-gray-900">Write a Review</h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          className="focus:outline-none"
                        >
                          <Star 
                            className={`w-6 h-6 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                      rows={3}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                      placeholder="Share your experience..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-primary hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <div className="mb-8 p-6 bg-blue-50 text-blue-800 rounded-xl text-sm font-medium">
                  Please log in to write a review for this property.
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-6">
                {propertyReviews?.length > 0 ? (
                  propertyReviews.map((review: any) => (
                    <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                            {review.customer?.avatar ? (
                               <img src={review.customer.avatar} alt={review.customer.name} className="w-full h-full object-cover" />
                            ) : (
                               <div className="w-full h-full flex items-center justify-center font-bold text-gray-500 text-sm">
                                  {review.customer?.name?.charAt(0) || 'U'}
                               </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{review.customer?.name}</p>
                            <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-[350px] shrink-0">
             <div className="sticky top-28 bg-white p-6 rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-100">
                <h3 className="font-bold text-xl mb-6 text-gray-900 border-b pb-4">Interested in this property?</h3>
                
                {/* Agent Info */}
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-14 h-14 bg-gray-100 rounded-full overflow-hidden border-2 border-primary/20">
                      {singleProperty.agent?.avatar ? (
                         <img src={singleProperty.agent.avatar} alt={singleProperty.agent.name} className="w-full h-full object-cover" />
                      ) : (
                         <div className="w-full h-full flex items-center justify-center font-bold text-gray-400 text-xl">
                            {singleProperty.agent?.name?.charAt(0) || 'A'}
                         </div>
                      )}
                   </div>
                   <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Listed By</p>
                      <p className="font-bold text-gray-900">{singleProperty.agent?.name || 'Agent'}</p>
                      <p className="text-sm text-gray-600">{singleProperty.agent?.email}</p>
                   </div>
                </div>

                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-4 bg-primary hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 mb-3"
                >
                  <CalendarDays className="w-5 h-5" />
                  Schedule a Visit
                </button>
                <button 
                  onClick={() => setIsMessageModalOpen(true)}
                  className="w-full py-4 bg-blue-50 hover:bg-blue-100 text-primary font-bold rounded-xl transition-all flex items-center justify-center gap-2 mb-3 border border-blue-100"
                >
                  Message Agent
                </button>
                <p className="text-center text-xs text-gray-500">No credit card required</p>
             </div>
          </div>

        </div>
      </div>

      {/* Book Visit Modal */}
      <BookVisitModal 
         isOpen={isModalOpen} 
         onClose={() => setIsModalOpen(false)} 
         property={singleProperty} 
      />

      {/* Message Agent Modal */}
      <MessageAgentModal 
         isOpen={isMessageModalOpen} 
         onClose={() => setIsMessageModalOpen(false)} 
         agent={singleProperty.agent} 
         propertyTitle={singleProperty.title}
      />

      {/* Full Screen Gallery Modal */}
      <AnimatePresence>
         {isGalleryOpen && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
            >
               <div className="flex justify-between items-center p-4 text-white">
                  <div className="font-semibold text-lg">{activeMedia + 1} / {allMedia.length}</div>
                  <button onClick={() => setIsGalleryOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                     <X className="w-6 h-6" />
                  </button>
               </div>
               
               <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                  <button onClick={handlePrevMedia} className="absolute left-4 z-10 p-4 bg-black/50 text-white rounded-full hover:bg-white/20 transition-colors">
                     <ChevronLeft className="w-8 h-8" />
                  </button>
                  
                  <div className="w-full h-full p-4 flex justify-center items-center">
                     {allMedia[activeMedia].type === 'image' ? (
                        <motion.img 
                           key={activeMedia}
                           initial={{ opacity: 0, scale: 0.95 }}
                           animate={{ opacity: 1, scale: 1 }}
                           src={allMedia[activeMedia].url} 
                           className="max-h-full max-w-full object-contain" 
                           alt={`Media ${activeMedia}`}
                        />
                     ) : (
                        <motion.video 
                           key={activeMedia}
                           initial={{ opacity: 0, scale: 0.95 }}
                           animate={{ opacity: 1, scale: 1 }}
                           src={allMedia[activeMedia].url} 
                           className="max-h-full max-w-full object-contain" 
                           controls
                           autoPlay
                        />
                     )}
                  </div>

                  <button onClick={handleNextMedia} className="absolute right-4 z-10 p-4 bg-black/50 text-white rounded-full hover:bg-white/20 transition-colors">
                     <ChevronRight className="w-8 h-8" />
                  </button>
               </div>
            </motion.div>
         )}
      </AnimatePresence>

    </div>
  );
}
