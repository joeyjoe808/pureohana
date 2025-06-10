import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Save, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  ArrowUp, 
  ArrowDown,
  Trash,
  Plus
} from 'lucide-react';

const AdminNavigation = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [navItems, setNavItems] = useState([]);
  const [newItem, setNewItem] = useState({ label: '', url: '' });
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    fetchNavigation();
  }, []);

  const fetchNavigation = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('navigation_items')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      
      setNavItems(data || []);
    } catch (error) {
      console.error('Error fetching navigation:', error);
      showNotification('error', 'Failed to load navigation menu');
    } finally {
      setLoading(false);
    }
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    
    const newItems = [...navItems];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    
    // Update display order
    newItems[index].display_order = index;
    newItems[index - 1].display_order = index - 1;
    
    setNavItems(newItems);
  };

  const handleMoveDown = (index) => {
    if (index === navItems.length - 1) return;
    
    const newItems = [...navItems];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    
    // Update display order
    newItems[index].display_order = index;
    newItems[index + 1].display_order = index + 1;
    
    setNavItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...navItems];
    newItems[index][field] = value;
    setNavItems(newItems);
  };

  const handleDeleteItem = (index) => {
    if (confirm('Are you sure you want to delete this navigation item?')) {
      const newItems = [...navItems];
      const deletedItem = newItems.splice(index, 1)[0];
      
      // Reorder remaining items
      newItems.forEach((item, idx) => {
        item.display_order = idx;
      });
      
      setNavItems(newItems);
      
      // If the item exists in the database, delete it
      if (deletedItem.id) {
        deleteNavItem(deletedItem.id);
      }
    }
  };

  const deleteNavItem = async (id) => {
    try {
      const { error } = await supabase
        .from('navigation_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting navigation item:', error);
      showNotification('error', 'Failed to delete navigation item');
    }
  };

  const handleAddNewItem = () => {
    if (!newItem.label.trim() || !newItem.url.trim()) {
      showNotification('error', 'Please fill out both label and URL');
      return;
    }
    
    const newNavItems = [...navItems, {
      label: newItem.label,
      url: newItem.url,
      display_order: navItems.length,
      is_active: true
    }];
    
    setNavItems(newNavItems);
    setNewItem({ label: '', url: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // First delete all existing items
      const { error: deleteError } = await supabase
        .from('navigation_items')
        .delete()
        .gte('id', 0); // This is a trick to delete all items
      
      if (deleteError) throw deleteError;
      
      // Then insert all the current items
      const { error: insertError } = await supabase
        .from('navigation_items')
        .insert(navItems.map((item, index) => ({
          label: item.label,
          url: item.url,
          display_order: index,
          is_active: item.is_active !== false // Default to true if not specified
        })));
      
      if (insertError) throw insertError;
      
      showNotification('success', 'Navigation menu saved successfully');
      fetchNavigation(); // Refresh data
    } catch (error) {
      console.error('Error saving navigation menu:', error);
      showNotification('error', 'Failed to save navigation menu');
    } finally {
      setSaving(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 5000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-md shadow-lg flex items-start ${
          notification.type === 'success' ? 'bg-green-500/20 border border-green-500/30 text-green-400' :
          notification.type === 'error' ? 'bg-red-500/20 border border-red-500/30 text-red-400' : 
          'bg-blue-500/20 border border-blue-500/30 text-blue-400'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle size={18} className="mr-3 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertCircle size={18} className="mr-3 mt-0.5 flex-shrink-0" />
          )}
          <p>{notification.message}</p>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-serif text-white mb-2">Navigation Menu Management</h1>
        <p className="text-gray-400">
          Edit and rearrange items in your website's main navigation menu.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-medium text-white mb-6">Main Navigation</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Label
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    URL / Path
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-800 divide-y divide-gray-700">
                {navItems.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => handleItemChange(index, 'label', e.target.value)}
                        className="w-full px-3 py-1 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                        placeholder="Menu Label"
                        required
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={item.url}
                        onChange={(e) => handleItemChange(index, 'url', e.target.value)}
                        className="w-full px-3 py-1 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                        placeholder="/page-path"
                        required
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`is_active_${index}`}
                          checked={item.is_active !== false}
                          onChange={(e) => handleItemChange(index, 'is_active', e.target.checked)}
                          className="mr-2"
                        />
                        <label htmlFor={`is_active_${index}`} className="text-gray-300 text-sm">
                          Active
                        </label>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-1">
                        <button
                          type="button"
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <ArrowUp size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveDown(index)}
                          disabled={index === navItems.length - 1}
                          className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <ArrowDown size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(index)}
                        className="text-red-400 hover:text-red-300"
                        title="Delete"
                      >
                        <Trash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                
                {/* Add new item row */}
                <tr className="bg-slate-700/30">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={newItem.label}
                      onChange={(e) => setNewItem({...newItem, label: e.target.value})}
                      className="w-full px-3 py-1 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                      placeholder="New Menu Label"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={newItem.url}
                      onChange={(e) => setNewItem({...newItem, url: e.target.value})}
                      className="w-full px-3 py-1 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                      placeholder="/page-path"
                    />
                  </td>
                  <td colSpan={2} className="px-6 py-4">
                    <span className="text-gray-400 text-sm">Will be added to the end</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      type="button"
                      onClick={handleAddNewItem}
                      className="px-3 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors flex items-center ml-auto"
                    >
                      <Plus size={16} className="mr-1" />
                      Add
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-yellow-400 text-slate-900 rounded-sm hover:bg-yellow-500 transition-colors flex items-center font-medium disabled:opacity-70"
          >
            {saving ? (
              <>
                <RefreshCw size={18} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Save Navigation Menu
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminNavigation;