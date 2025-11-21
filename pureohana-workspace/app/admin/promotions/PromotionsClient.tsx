'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Promotion } from '@/lib/supabase/types'
import { Plus, Eye, EyeOff, Edit, Trash2, ExternalLink, Calendar, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface PromotionsClientProps {
  initialPromotions: Promotion[]
}

export default function PromotionsClient({ initialPromotions }: PromotionsClientProps) {
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')

  const filteredPromotions = promotions.filter(promo => {
    if (filter === 'active') return promo.is_active
    if (filter === 'inactive') return !promo.is_active
    return true
  })

  const stats = {
    total: promotions.length,
    active: promotions.filter(p => p.is_active).length,
    inactive: promotions.filter(p => !p.is_active).length,
    totalViews: promotions.reduce((sum, p) => sum + p.view_count, 0),
    totalInquiries: promotions.reduce((sum, p) => sum + p.inquiry_count, 0),
  }

  async function toggleActive(id: string, currentStatus: boolean) {
    try {
      const response = await fetch(`/api/admin/promotions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      })

      if (!response.ok) throw new Error('Failed to update')

      setPromotions(prev =>
        prev.map(p => (p.id === id ? { ...p, is_active: !currentStatus } : p))
      )
    } catch (error) {
      console.error('Error toggling promotion:', error)
      alert('Failed to update promotion status')
    }
  }

  async function deletePromotion(id: string) {
    if (!confirm('Are you sure you want to delete this promotion? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/promotions/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete')

      setPromotions(prev => prev.filter(p => p.id !== id))
    } catch (error) {
      console.error('Error deleting promotion:', error)
      alert('Failed to delete promotion')
    }
  }

  function isPromotionValid(promo: Promotion): boolean {
    const now = new Date()
    const validFrom = promo.valid_from ? new Date(promo.valid_from) : null
    const validUntil = promo.valid_until ? new Date(promo.valid_until) : null
    return (!validFrom || now >= validFrom) && (!validUntil || now <= validUntil)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-charcoal-900">Promotions</h1>
          <p className="text-charcoal-600 mt-1">Manage your seasonal offers and special deals</p>
        </div>
        <Link href="/admin/promotions/new">
          <Button variant="primary" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Promotion
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-soft border border-charcoal-100">
          <p className="text-sm text-charcoal-600">Total</p>
          <p className="text-2xl font-bold text-charcoal-900">{stats.total}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow-soft border border-green-200">
          <p className="text-sm text-green-700">Active</p>
          <p className="text-2xl font-bold text-green-900">{stats.active}</p>
        </div>
        <div className="bg-charcoal-50 p-4 rounded-lg shadow-soft border border-charcoal-200">
          <p className="text-sm text-charcoal-600">Inactive</p>
          <p className="text-2xl font-bold text-charcoal-900">{stats.inactive}</p>
        </div>
        <div className="bg-ocean-50 p-4 rounded-lg shadow-soft border border-ocean-200">
          <p className="text-sm text-ocean-700">Total Views</p>
          <p className="text-2xl font-bold text-ocean-900">{stats.totalViews}</p>
        </div>
        <div className="bg-sunset-50 p-4 rounded-lg shadow-soft border border-sunset-200">
          <p className="text-sm text-sunset-700">Total Inquiries</p>
          <p className="text-2xl font-bold text-sunset-900">{stats.totalInquiries}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-sunset-600 text-white'
              : 'bg-white text-charcoal-700 hover:bg-charcoal-50'
          }`}
        >
          All ({stats.total})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'active'
              ? 'bg-sunset-600 text-white'
              : 'bg-white text-charcoal-700 hover:bg-charcoal-50'
          }`}
        >
          Active ({stats.active})
        </button>
        <button
          onClick={() => setFilter('inactive')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'inactive'
              ? 'bg-sunset-600 text-white'
              : 'bg-white text-charcoal-700 hover:bg-charcoal-50'
          }`}
        >
          Inactive ({stats.inactive})
        </button>
      </div>

      {/* Promotions List */}
      {filteredPromotions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-soft p-12 text-center">
          <p className="text-charcoal-600 mb-4">No promotions found.</p>
          <Link href="/admin/promotions/new">
            <Button variant="primary">Create Your First Promotion</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPromotions.map(promo => {
            const isValid = isPromotionValid(promo)

            return (
              <div
                key={promo.id}
                className="bg-white rounded-lg shadow-soft border border-charcoal-100 p-6 hover:shadow-luxury transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-charcoal-900">{promo.title}</h3>
                      {promo.is_active && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                          Active
                        </span>
                      )}
                      {!isValid && promo.is_active && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                          Not in Date Range
                        </span>
                      )}
                    </div>

                    {promo.tagline && (
                      <p className="text-charcoal-600 mb-3">{promo.tagline}</p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-charcoal-600">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {promo.promotional_price}
                        {promo.savings_text && (
                          <span className="text-sunset-600 font-semibold ml-1">
                            ({promo.savings_text})
                          </span>
                        )}
                      </span>

                      {(promo.valid_from || promo.valid_until) && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {promo.valid_from && promo.valid_until
                            ? `${new Date(promo.valid_from).toLocaleDateString()} - ${new Date(promo.valid_until).toLocaleDateString()}`
                            : promo.valid_from
                            ? `From ${new Date(promo.valid_from).toLocaleDateString()}`
                            : `Until ${new Date(promo.valid_until!).toLocaleDateString()}`}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-4 mt-3 text-sm">
                      <span className="text-charcoal-500">
                        Views: <span className="font-semibold text-charcoal-900">{promo.view_count}</span>
                      </span>
                      <span className="text-charcoal-500">
                        Inquiries: <span className="font-semibold text-charcoal-900">{promo.inquiry_count}</span>
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <a
                      href={`/promo/${promo.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-charcoal-50 rounded-lg transition-colors"
                      title="View promotion page"
                    >
                      <ExternalLink className="w-5 h-5 text-charcoal-600" />
                    </a>

                    <button
                      onClick={() => toggleActive(promo.id, promo.is_active)}
                      className="p-2 hover:bg-charcoal-50 rounded-lg transition-colors"
                      title={promo.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {promo.is_active ? (
                        <EyeOff className="w-5 h-5 text-charcoal-600" />
                      ) : (
                        <Eye className="w-5 h-5 text-charcoal-600" />
                      )}
                    </button>

                    <Link
                      href={`/admin/promotions/${promo.id}/edit`}
                      className="p-2 hover:bg-charcoal-50 rounded-lg transition-colors"
                      title="Edit promotion"
                    >
                      <Edit className="w-5 h-5 text-charcoal-600" />
                    </Link>

                    <button
                      onClick={() => deletePromotion(promo.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete promotion"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>

                {/* Direct Link */}
                <div className="mt-4 pt-4 border-t border-charcoal-100">
                  <p className="text-xs text-charcoal-500 mb-1">Direct Link:</p>
                  <code className="text-xs bg-charcoal-50 px-2 py-1 rounded text-charcoal-700 break-all">
                    {typeof window !== 'undefined' ? window.location.origin : ''}/promo/{promo.slug}
                  </code>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
