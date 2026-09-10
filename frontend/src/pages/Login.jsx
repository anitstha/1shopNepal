import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import Seo from '../components/common/Seo'
import { useAuth } from '../context/AuthContext'

const inputClass =
  'w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'

function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const data = await login(form)
      toast.success(`Welcome back${data.name ? `, ${data.name.split(' ')[0]}` : ''}!`)
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <Seo
        title="Sign In | 1Shop Nepal"
        description="Sign in to your 1Shop Nepal account to view orders, manage your wishlist and check out securely."
        canonical="/login"
      />
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-gray-600">Sign in to your 1ShopNepal account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 sm:p-8 rounded-2xl border border-gray-200 bg-white shadow-sm space-y-5"
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={inputClass}
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors disabled:opacity-60"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-medium text-orange-600 hover:text-orange-700">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
