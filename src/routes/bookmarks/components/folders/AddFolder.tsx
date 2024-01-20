import { component$, useSignal } from '@builder.io/qwik'
import { server$, useNavigate } from '@builder.io/qwik-city'
import { useAuthSession } from '~/routes/plugin@auth'
import { LuPlus } from '@qwikest/icons/lucide'
import { generateShortAlphanumericId } from '~/helpers/auth.utils'
import { db } from '~/db'
import { folderTable } from '~/db/schema/folder'

export const addFolder = server$(async (folderName: string, userId: string) => {
  try {
    const folderId = generateShortAlphanumericId()
    if (!userId) {
      throw new Error('User not found')
    }
    const insertItem = {
      id: folderId,
      userId,
      name: folderName
    }
    await db.insert(folderTable).values(insertItem)
    return {
      message: `Added folder ${folderName}`,
      id: folderId
    }
  } catch (e) {
    return {
      message: 'Failed to create folder',
      id: null
    }
  }
})

export default component$(() => {
  const nav = useNavigate()
  const session = useAuthSession()
  const userId = session?.value?.user?.email ?? '0'
  const folderName = useSignal('')

  return (
    <div class="dropdown">
      <div tabIndex={0} class="btn btn-sm bg-base-100 mb-2">
        <LuPlus class="h-4 w-4" />
      </div>
      <div
        tabIndex={0}
        class="card p-8 shadow menu dropdown-content z-[1] bg-neutral"
      >
        <div class="join">
          <input
            bind:value={folderName}
            class="input input-bordered join-item w-80"
            placeholder="Folder name"
          />
          <button
            class="btn btn-primary join-item rounded-r-full"
            onClick$={async () => {
              const response = await addFolder(folderName.value, userId)
              await nav(`/bookmarks/?folder=${response.id}`, {
                forceReload: true
              })
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
})
