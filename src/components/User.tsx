import { component$ } from '@builder.io/qwik'
import {
  useAuthSession,
  useAuthSignin,
  useAuthSignout
} from '~/routes/plugin@auth'
import { Form } from '@builder.io/qwik-city'

export default component$(() => {
  const session = useAuthSession()
  const signIn = useAuthSignin()
  const signOut = useAuthSignout()
  return (
    <div>
      {session.value?.user ? (
        <div class="flex items-center gap-2">
          <div class="dropdown dropdown-end">
            <div tabIndex={0} role="button" class="mt-1">
              <div class="avatar">
                <div class="w-[32px] rounded-full">
                  <img
                    width="32"
                    height="32"
                    src={session.value.user.image ?? ''}
                    alt={session.value.user.name ?? ''}
                  />
                </div>
              </div>
            </div>
            <div
              tabIndex={0}
              class="dropdown-content z-[1] card card-compact w-64 p-2 shadow bg-neutral text-neutral-content"
            >
              <div class="card-body">
                <div>{session.value.user.name}</div>
                <div>{session.value.user.email}</div>
                <div class="divider m-0" />
                <Form action={signOut}>
                  <button class="btn btn-link btn-sm p-0">Sign Out</button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Form action={signIn}>
          <button>Sign In</button>
        </Form>
      )}
    </div>
  )
})
