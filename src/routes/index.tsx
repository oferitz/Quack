import { component$, useSignal, useStore } from '@builder.io/qwik'
import { type DocumentHead, Link } from '@builder.io/qwik-city'

export default component$(() => {
  const store = useStore({ count: 0 })
  return (
    <div class="prose mt-32">
      <h1>Welcome to Quack</h1>
      <div>
        <Link href="/bookmarks">Bookmarks</Link>
      </div>
        <div>
            <button onClick$={() => store.count++}>+</button>
            <div>{store.count}</div>
            <button onClick$={() => store.count--}>-</button>
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
