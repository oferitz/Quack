import { component$ } from '@builder.io/qwik'
import { folderTable, SelectFolder } from '~/db/schema/folder'
import { cn } from '~/helpers/style.utils'
import AddFolder from '~/routes/bookmarks/components/folders/AddFolder'
import { LuFolder, LuX } from '@qwikest/icons/lucide'
import { useLocation, Link, useNavigate, server$ } from '@builder.io/qwik-city'
import { db } from '~/db'
import { eq } from 'drizzle-orm'
import { bookmarkTable } from '~/db/schema/bookmark'

export const deleteFolder = server$(async (folder: string) => {
  try {
    await db.transaction(async (tx) => {
      await tx.delete(folderTable).where(eq(folderTable.id, folder))
      await tx
        .update(bookmarkTable)
        .set({ folderId: null })
        .where(eq(bookmarkTable.folderId, folder))
    })

    return {
      message: 'deleted folder'
    }
  } catch (e) {
    return {
      message: 'Failed to delete folder'
    }
  }
})

interface BookmarkFoldersProps {
  folders: SelectFolder[]
}
export default component$<BookmarkFoldersProps>(({ folders }) => {
  const location = useLocation()
  const selectedFolder = location.url.searchParams.get('folder')
  const nav = useNavigate()
  return (
    <div class="flex flex-1 items-center flex-wrap mr-2">
      <Link href="/bookmarks?folder=all">
        <button
          class={cn(
            'btn btn-sm h-8 mb-2 mr-2',
            selectedFolder === 'all' ? 'btn-primary' : 'bg-base-100'
          )}
        >
          <LuFolder class="mr-2 h-4 w-4" /> All
        </button>
      </Link>

      {folders.map((folder) => {
        const isSelected = selectedFolder === folder.id
        return (
          <button
            key={folder.id}
            class={cn(
              'btn btn-sm flex items-center h-8 mb-2 mr-2',
              isSelected ? 'btn-primary' : 'bg-base-100'
            )}
          >
            <Link
              href={`/bookmarks?folder=${folder.id}`}
              class="flex items-center"
            >
              <LuFolder class="mr-2 h-4 w-4" />
              <span>{folder.name}</span>
            </Link>
            {isSelected && (
              <span
                onClick$={async () => {
                  const response = await deleteFolder(folder.id)
                  await nav('/bookmarks/?folder=all', { forceReload: true })
                }}
              >
                <LuX class="ml-2 h-4 w-4" />
              </span>
            )}
          </button>
        )
      })}
      <AddFolder />
    </div>
  )
})
