import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Search, 
  Trash2, 
  Download, 
  RefreshCcw, 
  CheckCircle, 
  XCircle,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Check,
  X
} from 'lucide-react';

const AdminSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedSubscribers, setSelectedSubscribers] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bulkAction, setBulkAction] = useState('');
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;
  
  useEffect(() => {
    fetchSubscribers();
  }, [currentPage, filterStatus]);
  
  useEffect(() => {
    if (searchQuery) {
      const filtered = subscribers.filter(
        sub => sub.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSubscribers(filtered);
    } else {
      setFilteredSubscribers(subscribers);
    }
  }, [searchQuery, subscribers]);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      // Build query
      let query = supabase
        .from('newsletter_subscribers')
        .select('*', { count: 'exact' });
      
      // Apply filters
      if (filterStatus === 'active') {
        query = query.eq('active', true);
      } else if (filterStatus === 'inactive') {
        query = query.eq('active', false);
      }
      
      // Apply pagination
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      
      // Execute query with range
      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (error) throw error;
      
      setSubscribers(data || []);
      setFilteredSubscribers(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      showNotification('error', 'Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ 
          active: newStatus,
          unsubscribed_at: newStatus ? null : new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setSubscribers(subscribers.map(sub => 
        sub.id === id ? { ...sub, active: newStatus, unsubscribed_at: newStatus ? null : new Date().toISOString() } : sub
      ));
      setFilteredSubscribers(filteredSubscribers.map(sub => 
        sub.id === id ? { ...sub, active: newStatus, unsubscribed_at: newStatus ? null : new Date().toISOString() } : sub
      ));
      
      showNotification('success', `Subscriber ${newStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error updating subscriber status:', error);
      showNotification('error', 'Failed to update subscriber status');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) return;
    
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setSubscribers(subscribers.filter(sub => sub.id !== id));
      setFilteredSubscribers(filteredSubscribers.filter(sub => sub.id !== id));
      showNotification('success', 'Subscriber deleted successfully');
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      showNotification('error', 'Failed to delete subscriber');
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedSubscribers(filteredSubscribers.map(sub => sub.id));
    } else {
      setSelectedSubscribers([]);
    }
  };

  const handleSelectSubscriber = (id) => {
    if (selectedSubscribers.includes(id)) {
      setSelectedSubscribers(selectedSubscribers.filter(subId => subId !== id));
    } else {
      setSelectedSubscribers([...selectedSubscribers, id]);
    }
  };

  const handleBulkAction = (action) => {
    if (selectedSubscribers.length === 0) {
      showNotification('error', 'Please select at least one subscriber');
      return;
    }
    
    setBulkAction(action);
    setShowConfirmation(true);
  };

  const confirmBulkAction = async () => {
    setLoading(true);
    try {
      if (bulkAction === 'delete') {
        const { error } = await supabase
          .from('newsletter_subscribers')
          .delete()
          .in('id', selectedSubscribers);
        
        if (error) throw error;
        
        showNotification('success', `${selectedSubscribers.length} subscribers deleted successfully`);
      } else if (bulkAction === 'activate') {
        const { error } = await supabase
          .from('newsletter_subscribers')
          .update({ active: true, unsubscribed_at: null })
          .in('id', selectedSubscribers);
        
        if (error) throw error;
        
        showNotification('success', `${selectedSubscribers.length} subscribers activated successfully`);
      } else if (bulkAction === 'deactivate') {
        const { error } = await supabase
          .from('newsletter_subscribers')
          .update({ active: false, unsubscribed_at: new Date().toISOString() })
          .in('id', selectedSubscribers);
        
        if (error) throw error;
        
        showNotification('success', `${selectedSubscribers.length} subscribers deactivated successfully`);
      }
      
      // Refresh data and reset selections
      await fetchSubscribers();
      setSelectedSubscribers([]);
    } catch (error) {
      console.error('Error performing bulk action:', error);
      showNotification('error', 'Failed to perform bulk action');
    } finally {
      setLoading(false);
      setShowConfirmation(false);
    }
  };

  const exportSubscribers = () => {
    const dataToExport = filterStatus === 'all' 
      ? subscribers 
      : subscribers.filter(sub => filterStatus === 'active' ? sub.active : !sub.active);
    
    const csvContent = [
      // Header
      ['Email', 'Status', 'Source', 'Subscribed Date', 'Unsubscribed Date'].join(','),
      // Data rows
      ...dataToExport.map(sub => [
        sub.email,
        sub.active ? 'Active' : 'Inactive',
        sub.source || '',
        new Date(sub.subscribed_at).toLocaleDateString(),
        sub.unsubscribed_at ? new Date(sub.unsubscribed_at).toLocaleDateString() : ''
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('success', 'Subscribers exported successfully');
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 5000);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

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
            <AlertTriangle size={18} className="mr-3 mt-0.5 flex-shrink-0" />
          )}
          <p>{notification.message}</p>
        </div>
      )}
      
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-8 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-medium text-white mb-4">Confirm Action</h3>
            <p className="text-gray-300 mb-6">
              {bulkAction === 'delete' 
                ? `Are you sure you want to delete ${selectedSubscribers.length} subscribers? This action cannot be undone.`
                : bulkAction === 'activate'
                ? `Are you sure you want to activate ${selectedSubscribers.length} subscribers?`
                : `Are you sure you want to deactivate ${selectedSubscribers.length} subscribers?`
              }
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmBulkAction}
                className={`px-4 py-2 rounded text-white flex items-center ${
                  bulkAction === 'delete' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-yellow-500 hover:bg-yellow-600'
                }`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                      <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Confirm'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-serif text-white mb-2">Newsletter Subscribers</h1>
        <p className="text-gray-400">
          Manage your newsletter subscribers and their preferences.
        </p>
      </div>
      
      <div className="bg-slate-800 rounded-lg shadow-lg p-6">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search subscribers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
            >
              <option value="all">All Subscribers</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
            
            <button
              onClick={fetchSubscribers}
              className="p-2 text-gray-400 hover:text-white"
              title="Refresh"
            >
              <RefreshCcw size={18} />
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleBulkAction('activate')}
              disabled={selectedSubscribers.length === 0}
              className="px-3 py-1.5 bg-green-600/20 text-green-400 rounded hover:bg-green-600/30 transition-colors text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle size={16} className="mr-1" />
              Activate
            </button>
            <button
              onClick={() => handleBulkAction('deactivate')}
              disabled={selectedSubscribers.length === 0}
              className="px-3 py-1.5 bg-yellow-600/20 text-yellow-400 rounded hover:bg-yellow-600/30 transition-colors text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XCircle size={16} className="mr-1" />
              Deactivate
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              disabled={selectedSubscribers.length === 0}
              className="px-3 py-1.5 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition-colors text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 size={16} className="mr-1" />
              Delete
            </button>
            <button
              onClick={exportSubscribers}
              className="px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30 transition-colors text-sm flex items-center"
            >
              <Download size={16} className="mr-1" />
              Export
            </button>
          </div>
        </div>

        {/* Subscribers Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
          </div>
        ) : (
          <>
            {filteredSubscribers.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-slate-700">
                      <tr>
                        <th scope="col\" className="px-3 py-3">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-yellow-400 border-gray-300 rounded"
                              onChange={handleSelectAll}
                              checked={selectedSubscribers.length === filteredSubscribers.length && filteredSubscribers.length > 0}
                            />
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Source
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Subscribed Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Last Updated
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-slate-800 divide-y divide-gray-700">
                      {filteredSubscribers.map((subscriber) => (
                        <tr key={subscriber.id} className="hover:bg-slate-700/50">
                          <td className="px-3 py-4">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="h-4 w-4 text-yellow-400 border-gray-300 rounded"
                                onChange={() => handleSelectSubscriber(subscriber.id)}
                                checked={selectedSubscribers.includes(subscriber.id)}
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-white">{subscriber.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              subscriber.active 
                                ? 'bg-green-400/20 text-green-300' 
                                : 'bg-red-400/20 text-red-300'
                            }`}>
                              {subscriber.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {subscriber.source || 'website'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {new Date(subscriber.subscribed_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {subscriber.unsubscribed_at 
                              ? `Unsubscribed on ${new Date(subscriber.unsubscribed_at).toLocaleDateString()}`
                              : new Date(subscriber.created_at).toLocaleDateString()
                            }
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-3">
                              {subscriber.active ? (
                                <button
                                  onClick={() => handleStatusChange(subscriber.id, false)}
                                  className="text-yellow-400 hover:text-yellow-300"
                                  title="Deactivate"
                                >
                                  <XCircle size={18} />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleStatusChange(subscriber.id, true)}
                                  className="text-green-400 hover:text-green-300"
                                  title="Activate"
                                >
                                  <CheckCircle size={18} />
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(subscriber.id)}
                                className="text-red-400 hover:text-red-300"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-400">
                    Showing <span className="font-medium">{Math.min((currentPage - 1) * pageSize + 1, totalCount)}</span> to <span className="font-medium">{Math.min(currentPage * pageSize, totalCount)}</span> of <span className="font-medium">{totalCount}</span> subscribers
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded bg-slate-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage >= totalPages}
                      className="p-2 rounded bg-slate-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl text-gray-600 mb-4">📬</div>
                <h3 className="text-xl font-medium text-white mb-2">No subscribers found</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  {searchQuery 
                    ? 'Try adjusting your search query or filters.'
                    : 'There are no newsletter subscribers yet. They will appear here when people subscribe to your newsletter.'}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-4 px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminSubscribers;