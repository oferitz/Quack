import { component$ } from '@builder.io/qwik'
import BookmarkCard from '~/routes/bookmarks/components/BookmarkCard'
import type { SelectBookmark } from '~/db/schema/bookmark'
import type { SelectFolder } from '~/db/schema/folder'
import BookmarkListHeader from '~/routes/bookmarks/components/BookmarkListHeader'

interface BookmarkListProps {
  bookmarks: SelectBookmark[]
  folders: SelectFolder[]
}
export default component$<BookmarkListProps>(({ bookmarks, folders }) => {
  return (
    <div class="grid gap-6 items-start max-w-6xl px-4 mx-auto py-6 mt-20">
      <BookmarkListHeader folders={folders} />
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {bookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            folders={folders}
          />
        ))}
      </div>
    </div>
  )
})
