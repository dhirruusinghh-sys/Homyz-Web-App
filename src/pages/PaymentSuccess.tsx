import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // We could verify the session here with our backend if needed
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24 pb-16 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 text-center"
      >
        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Successful!</h1>
        <p className="text-gray-500 mb-8">
          Thank you for your payment. Your booking has been confirmed and the receipt has been securely recorded.
        </p>

        <div className="bg-gray-50 rounded-2xl p-4 mb-8 text-left border border-gray-100">
           <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Transaction ID (Stripe)</p>
           <p className="font-mono text-gray-700 font-medium break-all text-sm">{sessionId || 'TRX-SUCCESS'}</p>
        </div>

        <div className="space-y-3">
          <Link 
            to="/dashboard/customer/payments"
            className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            to="/"
            className="w-full flex items-center justify-center py-4 bg-gray-50 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
          >
            Explore More Properties
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
