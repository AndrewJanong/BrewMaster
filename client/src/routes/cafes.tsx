import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/cafes')({
  component: () => <div>Hello /cafes!</div>,
})
