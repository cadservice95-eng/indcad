import { and, desc, eq, isNull, ne, or, sql } from "drizzle-orm";
import { admins, customers, enquiries, getDb, type DbOrTx } from "../db";

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export type CustomerInput = {
  email: string;
  name: string;
  company?: string | null;
  phone?: string | null;
  country?: string | null;
  city?: string | null;
  website?: string | null;
};

/**
 * One customer per email address. Matching is by exact (case-insensitive) email
 * only — never by name — so unrelated people are never merged. Blank fields in a
 * later submission never overwrite details we already hold.
 */
export async function upsertCustomer(db: DbOrTx, input: CustomerInput) {
  const email = normalizeEmail(input.email);
  const [row] = await db
    .insert(customers)
    .values({
      email,
      name: input.name,
      company: input.company || null,
      phone: input.phone || null,
      country: input.country || null,
      city: input.city || null,
      website: input.website || null,
    })
    .onConflictDoUpdate({
      target: customers.email,
      set: {
        name: sql`excluded.name`,
        company: sql`coalesce(excluded.company, ${customers.company})`,
        phone: sql`coalesce(excluded.phone, ${customers.phone})`,
        country: sql`coalesce(excluded.country, ${customers.country})`,
        city: sql`coalesce(excluded.city, ${customers.city})`,
        website: sql`coalesce(excluded.website, ${customers.website})`,
        updatedAt: new Date(),
      },
    })
    .returning();
  return row;
}

export async function getSoleAdminId(db: DbOrTx): Promise<string | null> {
  const [row] = await db.select({ id: admins.id }).from(admins).limit(1);
  return row?.id ?? null;
}

/** Other enquiries from the same customer (by customer record or identical email). */
export async function customerHistory(customerId: string, email: string, excludeEnquiryId: string) {
  const db = await getDb();
  return db
    .select({
      id: enquiries.id,
      referenceNumber: enquiries.referenceNumber,
      type: enquiries.type,
      status: enquiries.status,
      service: enquiries.service,
      subject: enquiries.subject,
      createdAt: enquiries.createdAt,
    })
    .from(enquiries)
    .where(and(or(eq(enquiries.customerId, customerId), eq(enquiries.email, normalizeEmail(email))), ne(enquiries.id, excludeEnquiryId), isNull(enquiries.deletedAt)))
    .orderBy(desc(enquiries.createdAt))
    .limit(25);
}
