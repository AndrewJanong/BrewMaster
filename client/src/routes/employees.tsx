import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/employees')({
  component: () => <div>Hello /employees!</div>,
})
