import prisma from '@/lib/prisma';
import { FAQ } from '@prisma/client';

export type DbFaq = FAQ;

export interface CreateFaqInput {
  question: string;
  answer: string;
  category?: string;
  published?: boolean;
  sortOrder?: number;
}

export interface UpdateFaqInput {
  question?: string;
  answer?: string;
  category?: string;
  published?: boolean;
  sortOrder?: number;
}

/**
 * Returns only published FAQ items for public website
 */
export async function getPublishedFaqsPublic(): Promise<DbFaq[]> {
  return await prisma.fAQ.findMany({
    where: { published: true },
    orderBy: [
      { sortOrder: 'asc' },
      { createdAt: 'asc' },
    ],
  });
}

/**
 * Returns all FAQ items for Admin CMS management
 */
export async function getAllFaqsAdmin(): Promise<DbFaq[]> {
  return await prisma.fAQ.findMany({
    orderBy: [
      { sortOrder: 'asc' },
      { createdAt: 'asc' },
    ],
  });
}

/**
 * Creates a new FAQ item in PostgreSQL
 */
export async function createFaqAdmin(input: CreateFaqInput): Promise<DbFaq> {
  const maxOrder = await prisma.fAQ.aggregate({
    _max: { sortOrder: true },
  });

  const nextSortOrder = (maxOrder._max.sortOrder ?? 0) + 1;

  return await prisma.fAQ.create({
    data: {
      question: input.question.trim(),
      answer: input.answer.trim(),
      category: (input.category || 'general').trim(),
      published: input.published ?? true,
      sortOrder: input.sortOrder ?? nextSortOrder,
    },
  });
}

/**
 * Updates an existing FAQ item in PostgreSQL
 */
export async function updateFaqAdmin(id: string, input: UpdateFaqInput): Promise<DbFaq> {
  const data: Partial<CreateFaqInput> = {};

  if (input.question !== undefined) data.question = input.question.trim();
  if (input.answer !== undefined) data.answer = input.answer.trim();
  if (input.category !== undefined) data.category = input.category.trim();
  if (input.published !== undefined) data.published = input.published;
  if (input.sortOrder !== undefined) data.sortOrder = input.sortOrder;

  return await prisma.fAQ.update({
    where: { id },
    data,
  });
}

/**
 * Deletes an FAQ item from PostgreSQL
 */
export async function deleteFaqAdmin(id: string): Promise<DbFaq> {
  return await prisma.fAQ.delete({
    where: { id },
  });
}

/**
 * Reorders FAQ items in PostgreSQL
 */
export async function reorderFaqsAdmin(orderedIds: string[]): Promise<void> {
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.fAQ.update({
        where: { id },
        data: { sortOrder: index + 1 },
      })
    )
  );
}
