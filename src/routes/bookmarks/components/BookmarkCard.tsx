import { component$, useSignal } from '@builder.io/qwik'
import { Link, server$, useLocation, useNavigate } from '@builder.io/qwik-city'
import { Image } from '@unpic/qwik'
import { bookmarkTable, SelectBookmark } from '~/db/schema/bookmark'
import { LuTrash } from '@qwikest/icons/lucide'
import { SelectFolder } from '~/db/schema/folder'
import { db } from '~/db'
import { eq } from 'drizzle-orm'

export const updateBookmarkFolder = server$(
  async (bookmarkId: string, folderId: string) => {
    try {
      await db
        .update(bookmarkTable)
        .set({ folderId })
        .where(eq(bookmarkTable.id, bookmarkId))
      return {
        message: 'Folder updated'
      }
    } catch (e) {
      return {
        message: 'Failed to update folder'
      }
    }
  }
)

const deleteBookmark = server$(async (bookmarkId: string) => {
  try {
    await db.delete(bookmarkTable).where(eq(bookmarkTable.id, bookmarkId))
    return {
      message: 'deleted bookmark'
    }
  } catch (e) {
    return {
      message: 'Failed to delete bookmark'
    }
  }
})

interface BookmarkCardProps {
  bookmark: SelectBookmark
  folders: SelectFolder[]
}
export default component$<BookmarkCardProps>(({ bookmark, folders }) => {
  const nav = useNavigate()
  const location = useLocation()

  return (
    <div class="card bg-base-100 border border-primary/20">
      <figure class="px-4 pt-4">
        <Image
          src={bookmark.image}
          alt={bookmark.title}
          class="rounded-sm"
          layout="constrained"
          width={800}
          height={600}
        />
      </figure>
      <div class="card-body">
        <Link
          href={bookmark.url}
          target="_blank"
          class="text-center card-title text-base text-primary line-clamp-2 hover:text-accent"
        >
          {bookmark.title}
        </Link>

        <p class="text-sm text-center line-clamp-3">{bookmark.description}</p>
        <div class="card-actions mt-5">
          <div class="flex items-center justify-between w-full">
            <select
              class="select select-bordered select-sm mr-2"
              onChange$={async (event) => {
                const selectedValue = (event.target as HTMLSelectElement).value
                await updateBookmarkFolder(bookmark.id, selectedValue)
              }}
            >
              <option value="all" selected={bookmark.folderId === 'all'}>
                All
              </option>
              {folders.map((folder) => (
                <option
                  key={folder.id}
                  value={folder.id}
                  selected={bookmark.folderId === folder.id}
                >
                  {folder.name}
                </option>
              ))}
            </select>
            <span
              class="cursor-pointer"
              onClick$={async () => {
                await deleteBookmark(bookmark.id)
                await nav(location.url.href, { forceReload: true })
              }}
            >
              <LuTrash class="h-4 w-4 text-rose-500" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
})
