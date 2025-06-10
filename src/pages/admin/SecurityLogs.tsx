import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { AlertTriangle, Shield, Search, Calendar, Clock, RefreshCw, User, Activity, Database } from 'lucide-react';

interface SecurityLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  ip_address: string;
  user_agent: string;
  details: any;
  created_at: string;
  user_email?: string;
}

const SecurityLogs = () => {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<SecurityLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 15;
  
  useEffect(() => {
    fetchSecurityLogs();
  }, []);
  
  useEffect(() => {
    applyFilters();
  }, [logs, searchQuery, actionFilter]);
  
  const fetchSecurityLogs = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('security_audit_logs')
        .select(`
          id,
          user_id,
          action,
          resource_type,
          resource_id,
          ip_address,
          user_agent,
          details,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      
      // If your structure allows it, fetch user emails for display
      const logs = data || [];
      const userIds = logs.filter(log => log.user_id).map(log => log.user_id);
      
      if (userIds.length > 0) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, email')
          .in('id', userIds);
          
        if (!userError && userData) {
          const userMap = userData.reduce((acc, user) => {
            acc[user.id] = user.email;
            return acc;
          }, {});
          
          logs.forEach(log => {
            if (log.user_id && userMap[log.user_id]) {
              log.user_email = userMap[log.user_id];
            }
          });
        }
      }
      
      setLogs(logs);
      setFilteredLogs(logs);
    } catch (error) {
      console.error('Error fetching security logs:', error);
      // Implement proper error handling here
    } finally {
      setLoading(false);
    }
  };
  
  const applyFilters = () => {
    let filtered = [...logs];
    
    // Filter by action type
    if (actionFilter !== 'all') {
      filtered = filtered.filter(log => log.action === actionFilter);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log => 
        (log.user_email && log.user_email.toLowerCase().includes(query)) ||
        (log.action && log.action.toLowerCase().includes(query)) ||
        (log.resource_type && log.resource_type.toLowerCase().includes(query)) ||
        (log.resource_id && log.resource_id.toLowerCase().includes(query)) ||
        (log.ip_address && log.ip_address.includes(query))
      );
    }
    
    setFilteredLogs(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  };
  
  const getUniqueActions = () => {
    const actions = logs.map(log => log.action).filter(Boolean);
    return [...new Set(actions)];
  };
  
  // Calculate pagination values
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  
  // Get icon for action type
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'auth_sign_in':
      case 'auth_sign_out':
      case 'auth_sign_in_attempt':
        return <User size={16} className="text-blue-400" />;
      case 'data_create':
      case 'data_update':
      case 'data_delete':
        return <Database size={16} className="text-green-400" />;
      case 'security_alert':
        return <AlertTriangle size={16} className="text-red-400" />;
      default:
        return <Activity size={16} className="text-yellow-400" />;
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-serif text-white mb-2">Security Logs</h1>
        <p className="text-gray-400">
          Monitor security events and user activity across the system.
        </p>
      </div>
      
      <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
            
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
            >
              <option value="all">All Actions</option>
              {getUniqueActions().map(action => (
                <option key={action} value={action}>
                  {action.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={fetchSecurityLogs}
            className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors flex items-center"
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh Logs
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <RefreshCw size={24} className="animate-spin text-yellow-400" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <Shield size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl text-white mb-2">No Security Logs Found</h3>
            <p className="text-gray-400">
              {searchQuery || actionFilter !== 'all' ? 
                "No logs match your current filters. Try adjusting your search criteria." :
                "No security events have been recorded yet."}
            </p>
            {(searchQuery || actionFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActionFilter('all');
                }}
                className="mt-4 px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Resource
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-slate-800 divide-y divide-gray-700">
                  {currentLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-700/40">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-start">
                          <Calendar size={14} className="text-gray-400 mt-0.5 mr-1.5" />
                          <div>
                            <div className="text-sm text-white">
                              {new Date(log.created_at).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-400 flex items-center">
                              <Clock size={10} className="mr-1" /> 
                              {new Date(log.created_at).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getActionIcon(log.action)}
                          <span className="ml-2 text-sm text-white">
                            {log.action?.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm text-white">
                          {log.user_email || 'Anonymous'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm text-white">
                          {log.ip_address || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <span className="text-sm text-white">
                            {log.resource_type || 'N/A'}
                          </span>
                          {log.resource_id && (
                            <span className="text-xs text-gray-400 block mt-1">
                              ID: {log.resource_id}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-400">
                  Showing <span className="font-medium">{indexOfFirstLog + 1}</span> to <span className="font-medium">{Math.min(indexOfLastLog, filteredLogs.length)}</span> of <span className="font-medium">{filteredLogs.length}</span> logs
                </div>
                
                <div className="flex space-x-1">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded bg-slate-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    First
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded bg-slate-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>
                  
                  <div className="px-3 py-1 bg-slate-600 rounded">
                    {currentPage} of {totalPages}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="px-3 py-1 rounded bg-slate-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage >= totalPages}
                    className="px-3 py-1 rounded bg-slate-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Last
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SecurityLogs;