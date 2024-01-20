import { text, sqliteTable } from 'drizzle-orm/sqlite-core'
import { type InferSelectModel, sql } from 'drizzle-orm'
import { createInsertSchema } from 'drizzle-zod'

export const folderTable = sqliteTable('folders', {
  id: text('id').primaryKey().notNull(),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  createdAt: text('timestamp').default(sql`CURRENT_TIMESTAMP`)
})

export type SelectFolder = InferSelectModel<typeof folderTable>

export const createFolderInputSchema = createInsertSchema(folderTable).omit({
  id: true,
  userId: true
})
