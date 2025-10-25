/**
 * Supabase Inquiry Repository Implementation
 *
 * Concrete implementation of IInquiryRepository using Supabase.
 *
 * Single Responsibility: Supabase-specific inquiry data access
 * Dependency Inversion: Implements abstract interface
 */

import { SupabaseClient } from '@supabase/supabase-js';
import {
  IInquiryRepository,
  InquiryFilters,
  InquiryStats,
  Inquiry,
  CreateInquiryInput,
  UpdateInquiryInput,
  InquiryStatus,
  InquiryType,
  Result,
  tryCatch,
  DatabaseError,
  NotFoundError
} from '../../domain';

export class SupabaseInquiryRepository implements IInquiryRepository {
  private readonly TABLE = 'inquiries';

  constructor(private readonly supabase: SupabaseClient) {}

  async findById(id: string): Promise<Result<Inquiry, any>> {
    return tryCatch(
      async () => {
        const { data, error } = await this.supabase
          .from(this.TABLE)
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw new DatabaseError('Failed to fetch inquiry', error);
        if (!data) throw new NotFoundError('Inquiry', id);

        return this.mapToInquiry(data);
      },
      (error) => error as any
    );
  }

  async findAll(filters?: InquiryFilters): Promise<Result<Inquiry[], any>> {
    return tryCatch(
      async () => {
        let query = this.supabase.from(this.TABLE).select('*');

        if (filters?.status) {
          query = query.eq('status', filters.status);
        }
        if (filters?.type) {
          query = query.eq('inquiry_type', filters.type);
        }
        if (filters?.dateFrom) {
          query = query.gte('submitted_at', filters.dateFrom.toISOString());
        }
        if (filters?.dateTo) {
          query = query.lte('submitted_at', filters.dateTo.toISOString());
        }

        const orderBy = filters?.orderBy || 'submitted_at';
        const orderDirection = filters?.orderDirection || 'desc';
        query = query.order(orderBy, { ascending: orderDirection === 'asc' });

        if (filters?.limit) {
          query = query.limit(filters.limit);
        }

        const { data, error } = await query;

        if (error) throw new DatabaseError('Failed to fetch inquiries', error);

        return (data || []).map(this.mapToInquiry);
      },
      (error) => error as any
    );
  }

  async findByStatus(status: InquiryStatus): Promise<Result<Inquiry[], any>> {
    return this.findAll({ status });
  }

  async findByType(type: InquiryType): Promise<Result<Inquiry[], any>> {
    return this.findAll({ type });
  }

  async create(input: CreateInquiryInput): Promise<Result<Inquiry, any>> {
    return tryCatch(
      async () => {
        const { data, error } = await this.supabase
          .from(this.TABLE)
          .insert([
            {
              name: input.name,
              email: input.email,
              phone: input.phone || null,
              subject: input.subject,
              message: input.message,
              inquiry_type: input.inquiryType,
              source: input.source || 'website_contact',
              status: 'new',
              metadata: input.metadata || {}
            }
          ])
          .select()
          .single();

        if (error) throw new DatabaseError('Failed to create inquiry', error);

        // TODO: Trigger email notification here
        // await this.sendEmailNotification(data.id);

        return this.mapToInquiry(data);
      },
      (error) => error as any
    );
  }

  async update(id: string, input: UpdateInquiryInput): Promise<Result<Inquiry, any>> {
    return tryCatch(
      async () => {
        const updateData: any = {};
        if (input.status !== undefined) updateData.status = input.status;
        if (input.respondedAt !== undefined) updateData.responded_at = input.respondedAt;
        if (input.resolvedAt !== undefined) updateData.resolved_at = input.resolvedAt;

        const { data, error } = await this.supabase
          .from(this.TABLE)
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) throw new DatabaseError('Failed to update inquiry', error);
        if (!data) throw new NotFoundError('Inquiry', id);

        return this.mapToInquiry(data);
      },
      (error) => error as any
    );
  }

  async markAsRead(id: string): Promise<Result<void, any>> {
    return tryCatch(
      async () => {
        const { error } = await this.supabase
          .from(this.TABLE)
          .update({ status: 'read' })
          .eq('id', id);

        if (error) throw new DatabaseError('Failed to mark inquiry as read', error);
      },
      (error) => error as any
    );
  }

  async markAsSpam(id: string): Promise<Result<void, any>> {
    return tryCatch(
      async () => {
        const { error } = await this.supabase
          .from(this.TABLE)
          .update({ status: 'spam' })
          .eq('id', id);

        if (error) throw new DatabaseError('Failed to mark inquiry as spam', error);
      },
      (error) => error as any
    );
  }

  async delete(id: string): Promise<Result<void, any>> {
    return tryCatch(
      async () => {
        const { error } = await this.supabase.from(this.TABLE).delete().eq('id', id);

        if (error) throw new DatabaseError('Failed to delete inquiry', error);
      },
      (error) => error as any
    );
  }

  async getStats(): Promise<Result<InquiryStats, any>> {
    return tryCatch(
      async () => {
        // This is a simplified implementation
        // In production, you'd use more efficient queries
        const { data: allInquiries, error } = await this.supabase
          .from(this.TABLE)
          .select('*');

        if (error) throw new DatabaseError('Failed to fetch inquiry stats', error);

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

        const stats: InquiryStats = {
          total: allInquiries?.length || 0,
          byStatus: {} as Record<InquiryStatus, number>,
          byType: {} as Record<InquiryType, number>,
          averageResponseTime: 0,
          todayCount: 0,
          weekCount: 0,
          monthCount: 0
        };

        // Calculate stats from data
        // Implementation simplified for brevity

        return stats;
      },
      (error) => error as any
    );
  }

  async search(query: string): Promise<Result<Inquiry[], any>> {
    return tryCatch(
      async () => {
        const { data, error } = await this.supabase
          .from(this.TABLE)
          .select('*')
          .or(`name.ilike.%${query}%,email.ilike.%${query}%,subject.ilike.%${query}%,message.ilike.%${query}%`)
          .order('submitted_at', { ascending: false });

        if (error) throw new DatabaseError('Failed to search inquiries', error);

        return (data || []).map(this.mapToInquiry);
      },
      (error) => error as any
    );
  }

  private mapToInquiry(data: any): Inquiry {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      inquiryType: data.inquiry_type as InquiryType,
      status: data.status as InquiryStatus,
      source: data.source,
      metadata: data.metadata || {},
      submittedAt: new Date(data.submitted_at),
      respondedAt: data.responded_at ? new Date(data.responded_at) : null,
      resolvedAt: data.resolved_at ? new Date(data.resolved_at) : null
    };
  }
}
