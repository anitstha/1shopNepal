import { useEffect, useState } from 'react'
import { Loader2, Search, Shield, ShieldCheck, User as UserIcon, Loader } from 'lucide-react'
import { adminApi } from '../../services/api'

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [busyId, setBusyId] = useState(null)

  useEffect(() => {
    let mounted = true
    adminApi
      .getUsers({ search })
      .then((res) => {
        if (mounted) setUsers(res.users)
      })
      .catch((err) => {
        if (mounted) setError(err.message)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [search])

  const handleRoleChange = async (user) => {
    const action = user.role === 'admin' ? 'revoke admin' : 'make admin'
    if (!window.confirm(`${action === 'make admin' ? 'Promote' : 'Demote'} "${user.email}" to ${action.includes('revoke') ? 'customer' : 'admin'}?`)) return
    setBusyId(user._id)
    setError('')
    try {
      const newRole = user.role === 'admin' ? 'customer' : 'admin'
      const res = await adminApi.updateUser(user._id, { role: newRole })
      setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, ...res.user } : u)))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  const handleActiveToggle = async (user) => {
    const next = !user.isActive
    if (!window.confirm(`${next ? 'Enable' : 'Disable'} account for "${user.email}"?`)) return
    setBusyId(user._id)
    setError('')
    try {
      const res = await adminApi.updateUser(user._id, { isActive: next })
      setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, ...res.user } : u)))
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  const submitSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput.trim())
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Users</h1>
        <p className="mt-1 text-gray-600">Manage user roles and account status.</p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>
      )}

      <form onSubmit={submitSearch} className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name or email"
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </form>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-white rounded-2xl border border-gray-200">
          <p className="text-lg font-medium">No users found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u._id} className={`hover:bg-gray-50 ${!u.isActive ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-9 h-9 rounded-full bg-orange-100 text-orange-700 font-bold text-sm">
                          {u.name.charAt(0).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{u.name}</p>
                          <p className="text-xs text-gray-500 truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${
                          u.role === 'admin'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {u.role === 'admin' ? (
                          <ShieldCheck className="w-3 h-3" />
                        ) : (
                          <UserIcon className="w-3 h-3" />
                        )}
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                          u.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {u.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(u.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleRoleChange(u)}
                          disabled={busyId === u._id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-600 disabled:opacity-50"
                        >
                          {busyId === u._id ? (
                            <Loader className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Shield className="w-3.5 h-3.5" />
                          )}
                          {u.role === 'admin' ? 'Demote' : 'Make Admin'}
                        </button>
                        <button
                          onClick={() => handleActiveToggle(u)}
                          disabled={busyId === u._id}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border disabled:opacity-50 ${
                            u.isActive
                              ? 'border-red-200 text-red-600 hover:bg-red-500 hover:text-white'
                              : 'border-green-300 text-green-700 hover:bg-green-600 hover:text-white'
                          }`}
                        >
                          {busyId === u._id ? (
                            <Loader className="w-3.5 h-3.5 animate-spin" />
                          ) : null}
                          {u.isActive ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUsers