'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Inquiry {
  id: string
  name: string
  email: string
  phone?: string
  event_type: string
  event_date?: string
  vision: string
  referral?: string
  status: 'new' | 'contacted' | 'closed'
  notes?: string
  created_at: string
  contacted_at?: string
  closed_at?: string
}

interface InquiriesClientProps {
  inquiries: Inquiry[]
}

export default function InquiriesClient({ inquiries: initialInquiries }: InquiriesClientProps) {
  const [inquiries, setInquiries] = useState(initialInquiries)
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'closed'>('all')
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const supabase = createClient()

  const filteredInquiries = inquiries.filter(inquiry =>
    filter === 'all' || inquiry.status === filter
  )

  async function updateStatus(id: string, newStatus: 'new' | 'contacted' | 'closed') {
    setIsUpdating(true)
    try {
      const updateData: any = { status: newStatus }

      if (newStatus === 'contacted' && !inquiries.find(i => i.id === id)?.contacted_at) {
        updateData.contacted_at = new Date().toISOString()
      }
      if (newStatus === 'closed' && !inquiries.find(i => i.id === id)?.closed_at) {
        updateData.closed_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('contact_submissions')
        .update(updateData)
        .eq('id', id)

      if (!error) {
        setInquiries(prev =>
          prev.map(inquiry =>
            inquiry.id === id ? { ...inquiry, ...updateData } : inquiry
          )
        )
      }
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const statusColors = {
    new: 'bg-sunset-100 text-sunset-800 border-sunset-200',
    contacted: 'bg-ocean-100 text-ocean-800 border-ocean-200',
    closed: 'bg-charcoal-100 text-charcoal-800 border-charcoal-200'
  }

  const stats = {
    total: inquiries.length,
    new: inquiries.filter(i => i.status === 'new').length,
    contacted: inquiries.filter(i => i.status === 'contacted').length,
    closed: inquiries.filter(i => i.status === 'closed').length
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-charcoal-200">
          <div className="text-sm text-charcoal-600">Total Inquiries</div>
          <div className="text-2xl font-bold text-charcoal-900">{stats.total}</div>
        </div>
        <div className="bg-sunset-50 p-4 rounded-lg shadow-sm border border-sunset-200">
          <div className="text-sm text-sunset-700">New</div>
          <div className="text-2xl font-bold text-sunset-900">{stats.new}</div>
        </div>
        <div className="bg-ocean-50 p-4 rounded-lg shadow-sm border border-ocean-200">
          <div className="text-sm text-ocean-700">Contacted</div>
          <div className="text-2xl font-bold text-ocean-900">{stats.contacted}</div>
        </div>
        <div className="bg-charcoal-50 p-4 rounded-lg shadow-sm border border-charcoal-200">
          <div className="text-sm text-charcoal-700">Closed</div>
          <div className="text-2xl font-bold text-charcoal-900">{stats.closed}</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-charcoal-200">
        {(['all', 'new', 'contacted', 'closed'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 font-medium capitalize transition-colors ${
              filter === status
                ? 'border-b-2 border-sunset-600 text-sunset-600'
                : 'text-charcoal-600 hover:text-charcoal-900'
            }`}
          >
            {status}
            {status !== 'all' && ` (${stats[status]})`}
          </button>
        ))}
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {filteredInquiries.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-charcoal-200 text-center">
            <p className="text-charcoal-600">No inquiries found</p>
          </div>
        ) : (
          filteredInquiries.map(inquiry => (
            <div
              key={inquiry.id}
              className="bg-white p-6 rounded-lg shadow-sm border border-charcoal-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-charcoal-900">{inquiry.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusColors[inquiry.status]}`}>
                      {inquiry.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-charcoal-600">
                    <div>
                      <a href={`mailto:${inquiry.email}`} className="text-ocean-600 hover:underline">
                        {inquiry.email}
                      </a>
                      {inquiry.phone && <span className="ml-3">{inquiry.phone}</span>}
                    </div>
                    <div className="font-medium text-charcoal-900">
                      {inquiry.event_type}
                      {inquiry.event_date && (
                        <span className="ml-3 text-charcoal-600">
                          {new Date(inquiry.event_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm text-charcoal-500">
                  {formatDate(inquiry.created_at)}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-semibold text-charcoal-900 mb-1">Their Vision:</p>
                <p className="text-sm text-charcoal-700 whitespace-pre-wrap">{inquiry.vision}</p>
              </div>

              {inquiry.referral && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-charcoal-900 mb-1">How They Found Us:</p>
                  <p className="text-sm text-charcoal-700">{inquiry.referral}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t border-charcoal-200">
                {inquiry.status === 'new' && (
                  <button
                    onClick={() => updateStatus(inquiry.id, 'contacted')}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    Mark as Contacted
                  </button>
                )}
                {inquiry.status === 'contacted' && (
                  <button
                    onClick={() => updateStatus(inquiry.id, 'closed')}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-charcoal-600 text-white rounded-lg hover:bg-charcoal-700 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    Mark as Closed
                  </button>
                )}
                {inquiry.status !== 'new' && (
                  <button
                    onClick={() => updateStatus(inquiry.id, 'new')}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-charcoal-200 text-charcoal-900 rounded-lg hover:bg-charcoal-300 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    Reopen
                  </button>
                )}
                <a
                  href={`mailto:${inquiry.email}?subject=Re: Your Photography Inquiry for ${inquiry.event_type}`}
                  className="px-4 py-2 bg-white border border-charcoal-300 text-charcoal-900 rounded-lg hover:bg-charcoal-50 transition-colors text-sm font-medium"
                >
                  Send Email
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
