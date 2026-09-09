import { useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import Seo from '../common/Seo'
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Users,
  MessageSquare,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react'

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Tags },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
]

function AdminLayout() {
  const [open, setOpen] = useState(false)

  const nav = (
    <nav className="flex-1 space-y-1">
      {adminLinks.map((link) => {
        const Icon = link.icon
        return (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-orange-50 hover:text-orange-700'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {link.label}
          </NavLink>
        )
      })}
    </nav>
  )

  return (
    <div className="lg:grid lg:grid-cols-[260px_1fr]">
      <Seo
        title="Admin Dashboard | 1Shop Nepal"
        description="1Shop Nepal administration panel."
        canonical="/admin"
        noindex
      />
      {/* Mobile topbar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 sticky top-16 bg-white z-30">
        <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
        <button
          onClick={() => setOpen((o) => !o)}
          className="p-2 text-gray-600 rounded-lg hover:bg-gray-100"
          aria-label="Toggle admin menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col gap-4 sticky top-16 h-[calc(100vh-4rem)] p-4 border-r border-gray-200 bg-gray-50">
        <div>
          <h1 className="px-3 text-xl font-extrabold text-gray-900">Admin</h1>
          <p className="px-3 text-xs text-gray-500">1ShopNepal</p>
        </div>
        {nav}
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-500 hover:text-orange-600"
        >
          <ExternalLink className="w-4 h-4" /> View Store
        </Link>
      </aside>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-b border-gray-200 bg-white p-4">
          {nav}
        </div>
      )}

      <main className="p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout