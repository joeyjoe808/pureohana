import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Heading } from '@/components/ui/Heading'
import { Container } from '@/components/ui/Container'
import { createServerClient } from '@/lib/supabase'
import { Plus, Edit, Eye, EyeOff, Trash2, DollarSign } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Manage Services | Admin',
  description: 'Manage your photography services',
}

export default async function AdminServicesPage() {
  const supabase = await createServerClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <Container className="py-12">
        <p className="text-center font-serif text-charcoal-600">Please sign in to manage services</p>
      </Container>
    )
  }

  // Fetch services
  const { data: services, error } = await supabase
    .from('services')
    .select('*')
    .eq('photographer_id', user.id)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching services:', error)
  }

  const allServices = services || []
  const activeServices = allServices.filter(s => s.is_active)
  const inactiveServices = allServices.filter(s => !s.is_active)

  return (
    <Container className="py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Heading level={1} className="mb-2">
              Manage Services
            </Heading>
            <p className="font-serif text-charcoal-600">
              Create and manage your photography service offerings
            </p>
          </div>

          <Link
            href="/admin/services/new"
            className="inline-flex items-center gap-2 bg-sunset-600 text-white px-6 py-3 rounded-luxury font-serif font-medium hover:bg-sunset-700 transition-colors"
          >
            <Plus size={18} />
            Add Service
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-luxury shadow-luxury p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-sunset-100 p-3 rounded-luxury">
                <DollarSign size={24} className="text-sunset-600" />
              </div>
              <div>
                <p className="text-3xl font-display text-charcoal-900">{allServices.length}</p>
                <p className="text-sm font-serif text-charcoal-600">Total Services</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-luxury shadow-luxury p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-100 p-3 rounded-luxury">
                <Eye size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-display text-charcoal-900">{activeServices.length}</p>
                <p className="text-sm font-serif text-charcoal-600">Active</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-luxury shadow-luxury p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-charcoal-100 p-3 rounded-luxury">
                <EyeOff size={24} className="text-charcoal-600" />
              </div>
              <div>
                <p className="text-3xl font-display text-charcoal-900">{inactiveServices.length}</p>
                <p className="text-sm font-serif text-charcoal-600">Inactive</p>
              </div>
            </div>
          </div>
        </div>

        {/* Services List */}
        {allServices.length === 0 ? (
          <div className="bg-white rounded-luxury shadow-luxury p-12 text-center">
            <DollarSign size={64} className="text-charcoal-300 mx-auto mb-4" />
            <Heading level={2} className="mb-2">No Services Yet</Heading>
            <p className="font-serif text-charcoal-600 mb-6">
              Create your first service to showcase your photography offerings
            </p>
            <Link
              href="/admin/services/new"
              className="inline-flex items-center gap-2 bg-sunset-600 text-white px-6 py-3 rounded-luxury font-serif font-medium hover:bg-sunset-700 transition-colors"
            >
              <Plus size={18} />
              Create First Service
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {allServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-luxury shadow-luxury overflow-hidden"
              >
                {/* Cover Image */}
                {service.cover_image_url && (
                  <div className="relative h-48">
                    <Image
                      src={service.cover_image_url}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                    {!service.is_active && (
                      <div className="absolute top-2 right-2 bg-charcoal-800 text-white px-3 py-1 rounded-full text-xs font-serif">
                        Inactive
                      </div>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-display text-xl text-charcoal-900 mb-1">
                        {service.title}
                      </h3>
                      <p className="text-sm font-serif text-charcoal-600 mb-3">
                        {service.description.length > 100
                          ? `${service.description.substring(0, 100)}...`
                          : service.description}
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  {service.features && Array.isArray(service.features) && service.features.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-serif text-charcoal-500 mb-2">Features:</p>
                      <ul className="space-y-1">
                        {service.features.slice(0, 3).map((feature: string, idx: number) => (
                          <li key={idx} className="text-sm text-charcoal-700 flex items-center">
                            <span className="w-1 h-1 bg-sunset-600 rounded-full mr-2"></span>
                            {feature}
                          </li>
                        ))}
                        {service.features.length > 3 && (
                          <li className="text-xs text-charcoal-500 italic">
                            +{service.features.length - 3} more
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Price */}
                  <p className="text-lg font-display text-sunset-600 mb-4">
                    Starting at {service.starting_price}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/services/${service.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border-2 border-sunset-600 text-sunset-600 rounded-luxury font-serif text-sm hover:bg-sunset-50 transition-colors"
                    >
                      <Edit size={16} />
                      Edit
                    </Link>
                    <button
                      className="px-4 py-2 border-2 border-red-600 text-red-600 rounded-luxury hover:bg-red-50 transition-colors"
                      title="Delete service"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-luxury p-6">
          <p className="font-serif text-sm text-blue-900 mb-2">
            <strong>Service Management Tips:</strong>
          </p>
          <ul className="font-serif text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Active services are displayed on your public services page</li>
            <li>Use display order to control how services are arranged</li>
            <li>Add features to highlight what's included in each service</li>
            <li>Choose high-quality cover images that represent each service</li>
          </ul>
        </div>
      </div>
    </Container>
  )
}
