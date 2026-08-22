import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../app/store';
import { getAgentProperties, deleteProperty } from '../../../features/properties/propertySlice';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye, Plus } from 'lucide-react';

export default function ManageListings() {
  const dispatch = useDispatch<AppDispatch>();
  const { properties, isLoading } = useSelector((state: RootState) => state.property);

  useEffect(() => {
    dispatch(getAgentProperties());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      dispatch(deleteProperty(id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
        <Link 
          to="/dashboard/agent/properties/add" 
          className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/30 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Property
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading properties...</div>
        ) : properties.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            You haven't listed any properties yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500">
              <thead className="bg-gray-50/50 text-gray-700 font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {properties.map((property) => (
                  <tr key={property._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={property.images?.[0] || 'https://via.placeholder.com/150'} 
                          alt={property.title} 
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-1">{property.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{property.propertyType} • {property.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      ${property.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize
                        ${property.status === 'approved' ? 'bg-green-100 text-green-700' 
                        : property.status === 'pending' ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'}`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/properties/${property._id}`} className="p-2 text-gray-400 hover:text-blue-600 transition-colors bg-gray-50 hover:bg-blue-50 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link to={`/dashboard/agent/properties/edit/${property._id}`} className="p-2 text-gray-400 hover:text-indigo-600 transition-colors bg-gray-50 hover:bg-indigo-50 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(property._id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors bg-gray-50 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
