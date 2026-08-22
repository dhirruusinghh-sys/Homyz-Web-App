
import { X, Calendar as CalendarIcon, Clock, AlignLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/store';
import { createBooking } from '../../features/bookings/bookingSlice';
import { toast } from 'react-toastify';

const TIME_SLOTS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
];

const schema = z.object({
  visitDate: z.string().min(1, 'Please select a date'),
  timeSlot: z.string().min(1, 'Please select a time slot'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface BookVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: any;
}

export default function BookVisitModal({ isOpen, onClose, property }: BookVisitModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { isLoading } = useSelector((state: RootState) => state.bookings);

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const selectedSlot = watch('timeSlot');

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast.error('Please login to book a visit');
      return;
    }

    try {
      const payload = {
        propertyId: property._id,
        visitDate: data.visitDate,
        timeSlot: data.timeSlot,
        notes: data.notes,
      };
      
      await dispatch(createBooking(payload)).unwrap();
      toast.success('Visit booked successfully!');
      reset();
      onClose();
    } catch (error: any) {
      toast.error(error || 'Failed to book visit');
    }
  };

  // Prevent selecting past dates
  const today = new Date().toISOString().split('T')[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Book Property Visit</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              {/* Property Info summary */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                   <img src={property.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=200'} alt="Property" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 line-clamp-1">{property.title}</h4>
                  <p className="text-sm text-gray-500 line-clamp-1">{property.city}, {property.state}</p>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <CalendarIcon className="w-4 h-4 text-primary" />
                  Select Date
                </label>
                <input
                  type="date"
                  min={today}
                  {...register('visitDate')}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all ${
                    errors.visitDate ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10'
                  }`}
                />
                {errors.visitDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.visitDate.message}</p>
                )}
              </div>

              {/* Time Slots */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Available Time Slots
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setValue('timeSlot', slot, { shouldValidate: true })}
                      className={`py-2 px-3 text-sm font-medium rounded-lg border transition-all ${
                        selectedSlot === slot
                          ? 'border-primary bg-primary text-white shadow-md'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-primary/50 hover:bg-primary/5'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                {errors.timeSlot && (
                  <p className="mt-2 text-sm text-red-500">{errors.timeSlot.message}</p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <AlignLeft className="w-4 h-4 text-primary" />
                  Special Notes (Optional)
                </label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  placeholder="Any specific requirements for your visit?"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-primary hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center"
                >
                  {isLoading ? (
                     <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Confirm Booking'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
