import { component$ } from '@builder.io/qwik'
import ThemeToggle from '~/components/ThemeToggle'
import User from '~/components/User'
import QuackIcon from '~/assets/duck-color-icon.svg'
export default component$(() => {
  return (
    <header class="fixed z-50 top-0 w-full shadow-sm flex items-center justify-between h-16 p-4 bg-base-300 border-b border-b-primary/20">
      <div class="flex items-center gap-4">
        <img
          src={QuackIcon}
          alt="Quack"
          class="w-8 h-8 -scale-x-100"
          width={64}
          height={64}
        />
        <h1 class="text-3xl font-bold text-primary">Quack</h1>
      </div>
      <div class="flex items-center gap-4">
        <User />
        <ThemeToggle />
      </div>
    </header>
  )
})
