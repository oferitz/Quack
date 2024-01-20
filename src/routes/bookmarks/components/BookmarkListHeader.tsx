import { component$, useSignal } from '@builder.io/qwik'
import { server$, useNavigate } from '@builder.io/qwik-city'
import type { SelectFolder } from '~/db/schema/folder'
import BookmarkFolders from '~/routes/bookmarks/components/folders/BookmarkFolders'
import { cn } from '~/helpers/style.utils'
import { useAuthSession } from '~/routes/plugin@auth'
import { generateShortAlphanumericId } from '~/helpers/auth.utils'
import { unfurl } from 'unfurl.js'
import { db } from '~/db'
import { bookmarkTable } from '~/db/schema/bookmark'

interface AddBookmarkArgs {
  url: string
  userId: string
  folderId?: string
}
export const addBookmark = server$(
  async ({ url, userId, folderId }: AddBookmarkArgs) => {
    try {
      const bookmarkId = generateShortAlphanumericId()
      if (!userId) {
        return {
          message: 'User not found'
        }
      }
      const metadata = await unfurl(url)

      const insertItem = {
        id: bookmarkId,
        userId,
        url,
        title: metadata.title || '',
        description: metadata.description || '',
        folderId: folderId || null,
        image:
          metadata.open_graph.images?.[0]?.url ||
          metadata.twitter_card.images[0]?.url ||
          '/favicon.svg'
      }
      await db.insert(bookmarkTable).values(insertItem)
      return {
        message: `Added bookmark ${insertItem.title}`
      }
    } catch (e) {
      return {
        message: 'Failed to create bookmark'
      }
    }
  }
)
interface BookmarkListHeaderProps {
  folders: SelectFolder[]
}
export default component$<BookmarkListHeaderProps>(({ folders }) => {
  const nav = useNavigate()
  const session = useAuthSession()
  const userId = session.value?.user?.email ?? '0'
  const open = useSignal(false)
  const url = useSignal('')
  return (
    <div class="flex justify-between items-center mt-4">
      <BookmarkFolders folders={folders} />
      <button
        class="btn btn-sm btn-secondary"
        onClick$={() => {
          open.value = true
        }}
      >
        New Bookmark
      </button>
      <dialog class={cn('modal', open.value && 'modal-open')}>
        <div class="modal-box">
          <h3 class="font-bold text-lg">Add new bookmark</h3>
          <div class="py-4">
            <input
              bind:value={url}
              placeholder="URL"
              class="input input-bordered join-item w-full"
            />
          </div>
          <div class="modal-action">
            <button
              class="btn btn-sm"
              onClick$={() => {
                open.value = false
              }}
            >
              Cancel
            </button>
            <button
              class="btn btn-sm btn-primary"
              onClick$={async () => {
                await addBookmark({ url: url.value, userId })
                open.value = false
                url.value = ''
                await nav('/bookmarks/?folder=all', {
                  forceReload: true
                })
              }}
            >
              Add
            </button>
          </div>
        </div>
      </dialog>
    </div>
  )
})
