import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core'
import { InferSelectModel, sql } from 'drizzle-orm'
import { createInsertSchema } from 'drizzle-zod'

export const bookmarkTable = sqliteTable('bookmarks', {
  id: text('id').primaryKey().notNull(),
  userId: text('user_id').notNull(),
  url: text('url').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  image: text('image').notNull(),
  isFavorite: integer('is_favorite', { mode: 'boolean' }).default(false),
  folderId: text('folder_id'),
  createdAt: text('timestamp').default(sql`CURRENT_TIMESTAMP`)
})

export type SelectBookmark = InferSelectModel<typeof bookmarkTable>

export const createBookmarkInputSchema = createInsertSchema(bookmarkTable, {
  url: (s) => s.url.url(),
  title: (s) => s.title.optional(),
  description: (s) => s.description.optional(),
  image: (s) => s.image.optional(),
  folderId: (s) => s.folderId.optional()
}).omit({ id: true, userId: true })
