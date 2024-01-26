import { component$ } from '@builder.io/qwik'
import { type DocumentHead, Link } from '@builder.io/qwik-city'

export default component$(() => {
  return (
      <nav class="mt-20 mx-auto">
          <ul>
              <li>
                  <Link href="/">Home</Link>
              </li>
              <li>
                  <Link href="/bookmarks">Bookmarks</Link>
              </li>
          </ul>
      </nav>
  )
})

export const head: DocumentHead = {
    title: 'Quack',
    meta: [
        {
            name: 'description',
      content: 'A Qwik app for Quack'
    }
  ]
}
