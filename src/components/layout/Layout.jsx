import { Header } from './Header'

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>
    </div>
  )
}
