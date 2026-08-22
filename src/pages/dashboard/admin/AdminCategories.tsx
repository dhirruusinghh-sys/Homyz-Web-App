import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../app/store';
import { getCategories, createCategory, deleteCategory } from '../../../features/admin/adminSlice';
import { Trash2, Plus } from 'lucide-react';

export default function AdminCategories() {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, isLoading } = useSelector((state: RootState) => state.admin);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    // Basic slug generation for the model
    const slug = name.toLowerCase().replace(/ /g, '-');
    dispatch(createCategory({ name, slug, description }));
    setName('');
    setDescription('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      dispatch(deleteCategory(id));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Manage Categories</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Create Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Add New Category</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1A56DB] outline-none" 
                placeholder="e.g. Villa"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1A56DB] outline-none" 
                placeholder="Optional description"
                rows={3}
              />
            </div>
            <button 
              type="submit" 
              className="w-full flex items-center justify-center gap-2 bg-[#1A56DB] text-white py-2.5 rounded-lg font-semibold hover:bg-[#0c39a3] transition-colors"
            >
              <Plus className="w-5 h-5" /> Add Category
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                  <th className="py-4 px-6 font-semibold">Name</th>
                  <th className="py-4 px-6 font-semibold">Slug</th>
                  <th className="py-4 px-6 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-900">{category.name}</td>
                    <td className="py-4 px-6 text-gray-500 text-sm">{category.slug}</td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => handleDelete(category._id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-500">No categories found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}
