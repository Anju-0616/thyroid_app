// src/components/Layout.jsx
import Sidebar from './Navbar'
import Topbar from './Topbar'

export default function Layout({ children, title, onAuthChange }) {
  return (
    <div className='min-h-screen bg-gray-50'>
      <Sidebar onAuthChange={onAuthChange} />
      <Topbar title={title} />
      <main className='ml-56 pt-16 min-h-screen'>
        <div className='p-8'>
          {children}
        </div>
      </main>
    </div>
  )
}