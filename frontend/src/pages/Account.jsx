import { Link } from 'react-router-dom'
import { Package, Heart, LogOut } from 'lucide-react'
import Seo from '../components/common/Seo'
import { useAuth } from '../context/AuthContext'

function Account() {
  const { user, logout } = useAuth()

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <Seo title="My Account | 1Shop Nepal" description="Manage your 1Shop Nepal profile, orders and wishlist." canonical="/account" noindex />
      <h1 className="text-3xl font-extrabold text-gray-900">My Account</h1>
      <p className="mt-2 text-gray-600">Manage your profile, orders and wishlist.</p>

      <div className="mt-8 p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-orange-600 text-white flex items-center justify-center text-xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <dt className="text-gray-500">Phone</dt>
            <dd className="font-medium text-gray-900">{user.phone || '—'}</dd>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <dt className="text-gray-500">Role</dt>
            <dd className="font-medium text-gray-900 capitalize">{user.role}</dd>
          </div>
        </dl>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Link
            to="/orders"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
          >
            <Package className="w-4 h-4" /> My Orders
          </Link>
          <Link
            to="/wishlist"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
          >
            <Heart className="w-4 h-4" /> Wishlist
          </Link>
        </div>

        <button
          onClick={logout}
          className="mt-3 w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  )
}

export default Account