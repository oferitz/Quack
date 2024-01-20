import { component$ } from '@builder.io/qwik'
import { DocumentHead, routeLoader$ } from '@builder.io/qwik-city'
import BookmarkList from '~/routes/bookmarks/components/BookmarkList'
import { useAuthSession } from '~/routes/plugin@auth'
import { db } from '~/db'
import { bookmarkTable } from '~/db/schema/bookmark'
import { and, eq, SQL } from 'drizzle-orm'
import { folderTable } from '~/db/schema/folder'

export const useBookmarks = routeLoader$(async (requestEvent) => {
  const session = await requestEvent.resolveValue(useAuthSession)
  const userId = session?.user?.email ?? '0'
  const folder = requestEvent.query.get('folder')
  const conditions: SQL[] = [eq(bookmarkTable.userId, userId ?? '0')]

  if (folder && folder !== 'all') {
    conditions.push(eq(bookmarkTable.folderId, folder))
  }

  if (!userId) return []
  const bookmarks = await db
    .select()
    .from(bookmarkTable)
    .where(and(...conditions))
  return bookmarks
})

export const useFolders = routeLoader$(async (requestEvent) => {
  const session = await requestEvent.resolveValue(useAuthSession)
  const userId = session?.user?.email ?? '0'
  const folders = await db
    .select()
    .from(folderTable)
    .where(eq(folderTable.userId, userId ?? '0'))
  return folders
})

export default component$(() => {
  const bookmarks = useBookmarks()
  const folders = useFolders()
  return <BookmarkList bookmarks={bookmarks.value} folders={folders.value} />
})

export const head: DocumentHead = {
  title: 'Quack - Bookmarks',
  meta: [
    {
      name: 'description',
      content: 'The bookmarks page for Quack'
    }
  ]
}
