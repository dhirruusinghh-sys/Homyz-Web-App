import { Star, MessageSquare, Trash2, CheckCircle, Search, Filter } from 'lucide-react';
import { useState } from 'react';

const dummyReviews = [
  {
    id: 'REV-001',
    property: 'Modern Villa in Beverly Hills',
    user: 'Emily Chen',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    comment: 'Absolutely stunning property. The agent was incredibly helpful and walked us through every detail.',
    date: 'Aug 15, 2026',
    status: 'published',
  },
  {
    id: 'REV-002',
    property: 'Luxury Penthouse',
    user: 'Michael Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    rating: 2,
    comment: 'The location is great but the pictures were quite misleading regarding the space in the living room.',
    date: 'Aug 12, 2026',
    status: 'flagged',
  },
  {
    id: 'REV-003',
    property: 'Minimalist Beachside Home',
    user: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    comment: 'Perfect for a family getaway. The beach access is phenomenal!',
    date: 'Aug 10, 2026',
    status: 'published',
  },
  {
    id: 'REV-004',
    property: 'Cozy Family Suburban House',
    user: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    rating: 1,
    comment: 'Terrible experience. The agent never showed up for the scheduled visit and stopped replying.',
    date: 'Aug 05, 2026',
    status: 'pending',
  }
];

export default function AdminReviews() {
  const [reviews, setReviews] = useState(dummyReviews);
  const [searchTerm, setSearchTerm] = useState('');

  const handleStatusChange = (id: string, newStatus: string) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, idx) => (
      <Star 
        key={idx} 
        className={`w-3.5 h-3.5 ${idx < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} 
      />
    ));
  };

  const filteredReviews = reviews.filter(r => 
    r.property.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Reviews</h1>
          <p className="text-sm text-gray-500">Moderate property and agent reviews from customers</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search reviews..."
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

      <div className="grid gap-6">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col md:flex-row gap-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="md:w-64 shrink-0 border-r border-gray-200 pr-6">
              <div className="flex items-center gap-3 mb-3">
                <img src={review.avatar} alt={review.user} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{review.user}</h3>
                  <span className="text-xs text-gray-500">{review.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {renderStars(review.rating)}
              </div>
              <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                review.status === 'published' ? 'bg-green-50 text-green-700' :
                review.status === 'flagged' ? 'bg-red-50 text-red-700' :
                'bg-yellow-50 text-yellow-700'
              }`}>
                {review.status}
              </span>
            </div>

            <div className="flex-1">
              <h4 className="font-bold text-gray-900 text-sm mb-2">{review.property}</h4>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100 italic">
                "{review.comment}"
              </p>

              <div className="flex items-center gap-2">
                {review.status !== 'published' && (
                  <button 
                    onClick={() => handleStatusChange(review.id, 'published')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-100 transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Approve
                  </button>
                )}
                {review.status !== 'flagged' && (
                  <button 
                    onClick={() => handleStatusChange(review.id, 'flagged')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg text-xs font-semibold hover:bg-yellow-100 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Flag
                  </button>
                )}
                <button 
                  onClick={() => {
                    if(window.confirm('Delete this review permanently?')) {
                       setReviews(reviews.filter(r => r.id !== review.id));
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors ml-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredReviews.length === 0 && (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No Reviews Found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
