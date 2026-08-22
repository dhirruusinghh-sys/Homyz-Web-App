import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../app/store';
import { getBlogs, deleteBlog } from '../../../features/admin/adminSlice';

export default function AdminBlogs() {
  const dispatch = useDispatch<AppDispatch>();
  const { blogs, isLoading } = useSelector((state: RootState) => state.admin);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getBlogs());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this blog post?')) {
      dispatch(deleteBlog(id));
    }
  };

  const filteredBlogs = blogs?.filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase())) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Blogs</h1>
          <p className="text-sm text-gray-500">Create and manage content for the platform</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            New Post
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map((blog, idx) => (
          <motion.div
            key={blog._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col"
          >
            <div className="relative h-48 overflow-hidden shrink-0">
              <img 
                src={blog.image} 
                alt={blog.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg shadow-sm backdrop-blur-sm ${
                  blog.status === 'published' ? 'bg-green-500/90 text-white' : 'bg-gray-500/90 text-white'
                }`}>
                  {blog.status}
                </span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-bold text-lg text-gray-900 mb-2 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                {blog.title}
              </h3>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>By {blog.author?.name || 'Admin'}</span>
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                  <Eye className="w-4 h-4" /> {blog.views || 0} views
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="p-1.5 text-gray-400 hover:text-primary transition-colors rounded">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(blog._id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
