import prisma from '@/lib/prisma';
import { Testimonial } from '@prisma/client';

export type DbTestimonial = Testimonial;

export interface CreateTestimonialInput {
  name: string;
  company?: string | null;
  position?: string | null;
  content: string;
  photo?: string | null;
  rating?: number;
  published?: boolean;
  sortOrder?: number;
}

export interface UpdateTestimonialInput {
  name?: string;
  company?: string | null;
  position?: string | null;
  content?: string;
  photo?: string | null;
  rating?: number;
  published?: boolean;
  sortOrder?: number;
}

/**
 * Returns only published testimonials for public web application
 */
export async function getPublishedTestimonialsPublic(): Promise<DbTestimonial[]> {
  return await prisma.testimonial.findMany({
    where: { published: true },
    orderBy: [
      { sortOrder: 'asc' },
      { createdAt: 'desc' },
    ],
  });
}

/**
 * Returns all testimonials for Admin CMS management
 */
export async function getAllTestimonialsAdmin(): Promise<DbTestimonial[]> {
  return await prisma.testimonial.findMany({
    orderBy: [
      { sortOrder: 'asc' },
      { createdAt: 'desc' },
    ],
  });
}

/**
 * Creates a new testimonial in PostgreSQL
 */
export async function createTestimonialAdmin(input: CreateTestimonialInput): Promise<DbTestimonial> {
  const maxOrder = await prisma.testimonial.aggregate({
    _max: { sortOrder: true },
  });

  const nextSortOrder = (maxOrder._max.sortOrder ?? 0) + 1;

  return await prisma.testimonial.create({
    data: {
      name: input.name.trim(),
      company: input.company ? input.company.trim() : null,
      position: input.position ? input.position.trim() : null,
      content: input.content.trim(),
      photo: input.photo ? input.photo.trim() : null,
      rating: Math.min(5, Math.max(1, input.rating ?? 5)),
      published: input.published ?? true,
      sortOrder: input.sortOrder ?? nextSortOrder,
    },
  });
}

/**
 * Updates an existing testimonial in PostgreSQL
 */
export async function updateTestimonialAdmin(id: string, input: UpdateTestimonialInput): Promise<DbTestimonial> {
  const data: Partial<CreateTestimonialInput> = {};

  if (input.name !== undefined) data.name = input.name.trim();
  if (input.company !== undefined) data.company = input.company ? input.company.trim() : null;
  if (input.position !== undefined) data.position = input.position ? input.position.trim() : null;
  if (input.content !== undefined) data.content = input.content.trim();
  if (input.photo !== undefined) data.photo = input.photo ? input.photo.trim() : null;
  if (input.rating !== undefined) data.rating = Math.min(5, Math.max(1, input.rating));
  if (input.published !== undefined) data.published = input.published;
  if (input.sortOrder !== undefined) data.sortOrder = input.sortOrder;

  return await prisma.testimonial.update({
    where: { id },
    data,
  });
}

/**
 * Deletes a testimonial from PostgreSQL
 */
export async function deleteTestimonialAdmin(id: string): Promise<DbTestimonial> {
  return await prisma.testimonial.delete({
    where: { id },
  });
}

/**
 * Reorders testimonials in PostgreSQL
 */
export async function reorderTestimonialsAdmin(orderedIds: string[]): Promise<void> {
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.testimonial.update({
        where: { id },
        data: { sortOrder: index + 1 },
      })
    )
  );
}
