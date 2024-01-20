import { component$ } from '@builder.io/qwik'
import { DocumentHead, Link } from '@builder.io/qwik-city'

export default component$(() => {
  return (
    <div class="prose mt-32">
      <h1>Welcome to Quack</h1>
      <div>
        <Link href="/bookmarks">Bookmarks</Link>
      </div>
    </div>
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
