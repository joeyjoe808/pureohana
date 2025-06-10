import React, { useState, useEffect } from 'react';
import { Calendar, Mail, User, Star, Trash2, Eye, CheckCircle, XCircle, ChevronLeft } from 'lucide-react';

const AdminInquiries = () => {
  // Mock data - in a real application, this would come from Supabase
  const mockInquiries = [
    {
      id: 1,
      name: 'Alexandra Williams',
      email: 'alex.williams@example.com',
      date: '2025-06-02T10:30:00',
      event_type: 'Destination Wedding',
      status: 'new',
      message: 'We are planning our destination wedding in Hawaii for next spring. We love your work and would like to discuss availability and pricing for photography and film coverage.',
      created_at: '2025-06-01T08:15:22'
    },
    {
      id: 2,
      name: 'Michael & Sarah Johnson',
      email: 'mjohnson@example.com',
      date: '2025-07-15T00:00:00',
      event_type: 'Vow Renewal',
      status: 'in-progress',
      message: 'We\'re celebrating our 10th anniversary with a vow renewal in Maui. We\'re looking for a photographer who can capture the intimate celebration with our closest family members.',
      created_at: '2025-05-28T14:22:10'
    },
    {
      id: 3,
      name: 'Daniel Chen',
      email: 'dchen@example.com',
      date: '2025-09-30T00:00:00',
      event_type: 'Engagement',
      status: 'completed',
      message: 'I\'m planning to propose to my girlfriend during our vacation on the North Shore of Oahu and would love to have it photographed discreetly. Would you be available for this special moment?',
      created_at: '2025-05-15T09:45:33'
    }
  ];

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    // Simulate fetching data from API
    const fetchInquiries = () => {
      setLoading(true);
      
      // In a real app, this would be a Supabase call
      setTimeout(() => {
        setInquiries(mockInquiries);
        setLoading(false);
      }, 1000);
    };
    
    fetchInquiries();
  }, []);

  const filteredInquiries = inquiries.filter(inquiry => {
    // Filter by status
    if (filterStatus !== 'all' && inquiry.status !== filterStatus) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        inquiry.name.toLowerCase().includes(query) ||
        inquiry.email.toLowerCase().includes(query) ||
        inquiry.message.toLowerCase().includes(query) ||
        inquiry.event_type.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const handleStatusChange = (id, newStatus) => {
    setInquiries(inquiries.map(inquiry => 
      inquiry.id === id ? { ...inquiry, status: newStatus } : inquiry
    ));
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this inquiry?')) {
      setInquiries(inquiries.filter(inquiry => inquiry.id !== id));
      
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry(null);
      }
    }
  };

  const viewInquiry = (inquiry) => {
    setSelectedInquiry(inquiry);
  };

  const closeInquiryView = () => {
    setSelectedInquiry(null);
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'new':
        return { label: 'New', color: 'bg-blue-400/20 text-blue-300' };
      case 'in-progress':
        return { label: 'In Progress', color: 'bg-yellow-400/20 text-yellow-300' };
      case 'completed':
        return { label: 'Completed', color: 'bg-green-400/20 text-green-300' };
      default:
        return { label: status, color: 'bg-gray-400/20 text-gray-300' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-serif text-white mb-2">Client Inquiries</h1>
        <p className="text-gray-400">
          Manage and respond to client inquiries and booking requests.
        </p>
      </div>

      {selectedInquiry ? (
        <div className="bg-slate-800 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <button
              onClick={closeInquiryView}
              className="text-gray-400 hover:text-white flex items-center"
            >
              <ChevronLeft size={20} className="mr-1" />
              Back to all inquiries
            </button>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleStatusChange(selectedInquiry.id, 'in-progress')}
                className="px-3 py-1.5 bg-yellow-500/20 text-yellow-400 rounded hover:bg-yellow-500/30 transition-colors text-sm"
                disabled={selectedInquiry.status === 'in-progress'}
              >
                Mark In Progress
              </button>
              <button
                onClick={() => handleStatusChange(selectedInquiry.id, 'completed')}
                className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors text-sm"
                disabled={selectedInquiry.status === 'completed'}
              >
                Mark Completed
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-slate-700 rounded-lg p-6 mb-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-medium text-white mb-4">{selectedInquiry.name}</h2>
                  <div className={`px-2 py-1 rounded-full text-xs ${getStatusLabel(selectedInquiry.status).color}`}>
                    {getStatusLabel(selectedInquiry.status).label}
                  </div>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
              </div>
              
              <div className="bg-slate-700 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-4">Response</h3>
                <textarea
                  className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                  rows={6}
                  placeholder="Type your response here..."
                ></textarea>
                
                <div className="flex justify-end mt-4">
                  <button className="px-4 py-2 bg-yellow-400 text-slate-900 rounded hover:bg-yellow-500 transition-colors">
                    Send Response
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-700 rounded-lg p-6 h-fit">
              <h3 className="text-lg font-medium text-white mb-4">Inquiry Details</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Contact Information</div>
                  <div className="flex items-start">
                    <User size={16} className="text-yellow-400 mr-2 mt-1" />
                    <div>
                      <div className="text-white">{selectedInquiry.name}</div>
                      <a href={`mailto:${selectedInquiry.email}`} className="text-yellow-400 hover:text-yellow-300 text-sm">
                        {selectedInquiry.email}
                      </a>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-400 mb-1">Event Type</div>
                  <div className="flex items-center">
                    <Star size={16} className="text-yellow-400 mr-2" />
                    <div className="text-white">{selectedInquiry.event_type}</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-400 mb-1">Event Date</div>
                  <div className="flex items-center">
                    <Calendar size={16} className="text-yellow-400 mr-2" />
                    <div className="text-white">{new Date(selectedInquiry.date).toLocaleDateString()}</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-400 mb-1">Inquiry Received</div>
                  <div className="flex items-center">
                    <Mail size={16} className="text-yellow-400 mr-2" />
                    <div className="text-white">
                      {new Date(selectedInquiry.created_at).toLocaleDateString()} at {new Date(selectedInquiry.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-600">
                  <button
                    onClick={() => handleDelete(selectedInquiry.id)}
                    className="w-full px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors flex items-center justify-center"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete Inquiry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-lg shadow-lg p-6">
          {/* Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search inquiries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Inquiries Table */}
          {filteredInquiries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-slate-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Client
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Event Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Event Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Received
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-slate-800 divide-y divide-gray-700">
                  {filteredInquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-slate-700/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{inquiry.name}</div>
                            <div className="text-sm text-gray-400">{inquiry.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {inquiry.event_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(inquiry.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusLabel(inquiry.status).color}`}>
                          {getStatusLabel(inquiry.status).label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(inquiry.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-3">
                          <button
                            onClick={() => viewInquiry(inquiry)}
                            className="text-gray-400 hover:text-white"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          {inquiry.status === 'new' ? (
                            <button
                              onClick={() => handleStatusChange(inquiry.id, 'in-progress')}
                              className="text-yellow-400 hover:text-yellow-300"
                              title="Mark In Progress"
                            >
                              <CheckCircle size={18} />
                            </button>
                          ) : inquiry.status === 'in-progress' ? (
                            <button
                              onClick={() => handleStatusChange(inquiry.id, 'completed')}
                              className="text-green-400 hover:text-green-300"
                              title="Mark Completed"
                            >
                              <CheckCircle size={18} />
                            </button>
                          ) : null}
                          <button
                            onClick={() => handleDelete(inquiry.id)}
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
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl text-gray-600 mb-4">💬</div>
              <h3 className="text-xl font-medium text-white mb-2">No inquiries found</h3>
              <p className="text-gray-400 mb-6">
                {searchQuery || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'When clients submit inquiries through the contact form, they will appear here.'}
              </p>
              {(searchQuery || filterStatus !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterStatus('all');
                  }}
                  className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminInquiries;