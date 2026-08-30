import prisma from '@/lib/prisma';
import { LeadStatus, Prisma } from '@prisma/client';

export interface DbLeadNote {
  id: string;
  leadId: string;
  text: string;
  createdAt: Date;
  author?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export interface DbLead {
  id: string;
  name: string;
  company?: string | null;
  phone: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
  source: string;
  status: LeadStatus;
  assignedTo?: string | null;
  createdAt: Date;
  updatedAt: Date;
  notes?: DbLeadNote[];
}

/**
 * Fetches paginated leads for Admin CRM
 */
export async function getPaginatedLeadsAdmin(
  page = 1,
  limit = 10,
  search = '',
  statusFilter = 'ALL',
  sortBy = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<{ leads: DbLead[]; total: number; totalPages: number; page: number }> {
  try {
    const where: Prisma.LeadWhereInput = {};

    if (search.trim()) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (statusFilter && statusFilter !== 'ALL' && Object.values(LeadStatus).includes(statusFilter as LeadStatus)) {
      where.status = statusFilter as LeadStatus;
    }

    const skip = (page - 1) * limit;
    const orderBy: Prisma.LeadOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const [total, leads] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          notes: {
            orderBy: { createdAt: 'desc' },
            include: {
              author: {
                select: { id: true, name: true, email: true },
              },
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      leads,
      total,
      totalPages,
      page,
    };
  } catch {
    return { leads: [], total: 0, totalPages: 1, page: 1 };
  }
}

/**
 * Fetches a single lead by ID
 */
export async function getLeadByIdAdmin(id: string): Promise<DbLead | null> {
  return await prisma.lead.findUnique({
    where: { id },
    include: {
      notes: {
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    },
  });
}

/**
 * Creates a lead (public website contact form submission)
 */
export async function createLeadPublic(data: {
  name: string;
  company?: string;
  phone: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
  source?: string;
}): Promise<DbLead> {
  if (!data.name || !data.email || !data.phone) {
    throw new Error('Name, email, and phone number are required.');
  }

  return await prisma.lead.create({
    data: {
      name: data.name.trim(),
      company: data.company?.trim() || null,
      phone: data.phone.trim(),
      email: data.email.toLowerCase().trim(),
      projectType: data.projectType || 'custom',
      budget: data.budget || 'Unspecified',
      message: data.message.trim(),
      source: data.source || 'Website Contact Form',
      status: LeadStatus.NEW,
    },
  });
}

/**
 * Updates lead status
 */
export async function updateLeadStatusAdmin(id: string, status: LeadStatus): Promise<DbLead> {
  return await prisma.lead.update({
    where: { id },
    data: { status },
  });
}

/**
 * Assigns lead to user
 */
export async function assignLeadAdmin(id: string, assignedTo: string): Promise<DbLead> {
  return await prisma.lead.update({
    where: { id },
    data: { assignedTo },
  });
}

/**
 * Adds a note to a lead timeline
 */
export async function addLeadNoteAdmin(leadId: string, authorId: string | null, text: string) {
  if (!text.trim()) {
    throw new Error('Note text cannot be empty.');
  }

  return await prisma.leadNote.create({
    data: {
      leadId,
      authorId,
      text: text.trim(),
    },
    include: {
      author: {
        select: { id: true, name: true, email: true },
      },
    },
  });
}

/**
 * Deletes a lead record
 */
export async function deleteLeadAdmin(id: string): Promise<void> {
  await prisma.lead.delete({ where: { id } });
}

/**
 * Exports all leads as CSV data
 */
export async function exportLeadsCsvAdmin(): Promise<string> {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const headers = ['ID', 'Name', 'Company', 'Email', 'Phone', 'Project Type', 'Budget', 'Status', 'Source', 'Assigned To', 'Created At'];
  const rows = leads.map((l) => [
    `"${l.id}"`,
    `"${l.name.replace(/"/g, '""')}"`,
    `"${(l.company || '').replace(/"/g, '""')}"`,
    `"${l.email}"`,
    `"${l.phone}"`,
    `"${l.projectType}"`,
    `"${l.budget}"`,
    `"${l.status}"`,
    `"${l.source}"`,
    `"${(l.assignedTo || '').replace(/"/g, '""')}"`,
    `"${l.createdAt.toISOString()}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
