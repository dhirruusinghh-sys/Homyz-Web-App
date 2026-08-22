import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../app/store';
import { getCities, createCity, deleteCity } from '../../../features/admin/adminSlice';
import { Trash2, Plus } from 'lucide-react';

export default function AdminCities() {
  const dispatch = useDispatch<AppDispatch>();
  const { cities, isLoading } = useSelector((state: RootState) => state.admin);
  
  const [name, setName] = useState('');
  const [state, setStateName] = useState('');
  const [country, setCountry] = useState('US');

  useEffect(() => {
    dispatch(getCities());
  }, [dispatch]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    dispatch(createCity({ name, state, country }));
    setName('');
    setStateName('');
    setCountry('US');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this city?')) {
      dispatch(deleteCity(id));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Manage Cities</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Create Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Add New City</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City Name</label>
              <select 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1A56DB] outline-none bg-white" 
              >
                <option value="">Select City</option>
                <option value="Mumbai">Mumbai</option>
                <option value="New Delhi">New Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="New York">New York</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="London">London</option>
                <option value="Toronto">Toronto</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State / Region</label>
              <select 
                value={state}
                onChange={(e) => setStateName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1A56DB] outline-none bg-white" 
              >
                <option value="">Select State</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Delhi">Delhi</option>
                <option value="Karnataka">Karnataka</option>
                <option value="NY">New York (NY)</option>
                <option value="CA">California (CA)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <select 
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1A56DB] outline-none bg-white" 
              >
                <option value="">Select Country</option>
                <option value="India">India</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="Canada">Canada</option>
              </select>
            </div>
            <button 
              type="submit" 
              className="w-full flex items-center justify-center gap-2 bg-[#1A56DB] text-white py-2.5 rounded-lg font-semibold hover:bg-[#0c39a3] transition-colors"
            >
              <Plus className="w-5 h-5" /> Add City
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
                  <th className="py-4 px-6 font-semibold">City Name</th>
                  <th className="py-4 px-6 font-semibold">State</th>
                  <th className="py-4 px-6 font-semibold">Country</th>
                  <th className="py-4 px-6 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cities.map((city) => (
                  <tr key={city._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-900">{city.name}</td>
                    <td className="py-4 px-6 text-gray-500 text-sm">{city.state || '-'}</td>
                    <td className="py-4 px-6 text-gray-500 text-sm">{city.country}</td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => handleDelete(city._id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {cities.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">No cities found.</td>
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
