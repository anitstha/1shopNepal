import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  Package,
  Heart,
  LogOut,
  ShieldCheck,
  Save,
  User as UserIcon,
  CheckCircle2,
  Camera,
  ImageOff,
} from 'lucide-react'
import Seo from '../components/common/Seo'
import { toAbsoluteUrl } from '../services/api'
import { useAuth } from '../context/AuthContext'

const inputClass =
  'w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-sm text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent placeholder:text-neutral-400'

function Field({ id, label, ...inputProps }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-neutral-700 mb-1.5">
        {label}
      </label>
      <input id={id} className={inputClass} {...inputProps} />
    </div>
  )
}

function Account() {
  const { user, logout, updateUser, updateProfileImage, isAdmin } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [profileMsg, setProfileMsg] = useState(null)
  const [profileErr, setProfileErr] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState(null)
  const [passwordErr, setPasswordErr] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [photoMsg, setPhotoMsg] = useState(null)
  const [photoErr, setPhotoErr] = useState('')

  const handleProfileChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setProfileErr('')
    setProfileMsg(null)
  }

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value })
    setPasswordErr('')
    setPasswordMsg(null)
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    const name = form.name.trim()
    if (name.length < 2) {
      setProfileErr('Name must be at least 2 characters')
      return
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setProfileErr('Please provide a valid email address')
      return
    }
    if (form.phone.trim() && !/^[0-9]{10}$/.test(form.phone.trim())) {
      setProfileErr('Phone number must be 10 digits')
      return
    }
    setSavingProfile(true)
    setProfileErr('')
    try {
      await updateUser({ name, email: form.email.trim(), phone: form.phone.trim() })
      setProfileMsg('Profile updated successfully')
      toast.success('Profile updated successfully')
    } catch (err) {
      setProfileErr(err.message)
      toast.error(err.message)
    } finally {
      setSavingProfile(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (passwordForm.newPassword.length < 6) {
      setPasswordErr('New password must be at least 6 characters')
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordErr('New passwords do not match')
      return
    }
    setSavingPassword(true)
    setPasswordErr('')
    try {
      await updateUser({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setPasswordMsg('Password changed successfully')
      toast.success('Password changed successfully')
    } catch (err) {
      setPasswordErr(err.message)
      toast.error(err.message)
    } finally {
      setSavingPassword(false)
    }
  }

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) {
      setPhotoErr('Only JPG, PNG, WEBP or GIF images are allowed')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoErr('Image cannot exceed 5MB')
      return
    }
    setUploadingPhoto(true)
    setPhotoErr('')
    setPhotoMsg(null)
    try {
      await updateProfileImage(file)
      setPhotoMsg('Profile picture updated')
      toast.success('Profile picture updated')
    } catch (err) {
      setPhotoErr(err.message)
      toast.error(err.message)
    } finally {
      setUploadingPhoto(false)
      e.target.value = ''
    }
  }

  const handleRemovePhoto = async () => {
    setPhotoErr('')
    setPhotoMsg(null)
    try {
      await updateUser({ profileImage: '' })
      setPhotoMsg('Profile picture removed')
      toast.success('Profile picture removed')
    } catch (err) {
      setPhotoErr(err.message)
      toast.error(err.message)
    }
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Seo
        title="My Account | 1Shop Nepal"
        description="Manage your 1Shop Nepal profile, orders and wishlist."
        canonical="/account"
        noindex
      />
      <h1 className="text-3xl font-extrabold text-neutral-900">My Account</h1>
      <p className="mt-2 text-neutral-500">Manage your profile, orders and wishlist.</p>

      <div className="mt-8 grid md:grid-cols-[320px_1fr] gap-6 items-start">
        {/* Profile summary */}
        <div className="p-6 rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 shrink-0">
              <div className="w-14 h-14 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xl font-bold overflow-hidden">
                {user?.profileImage ? (
                  <img
                    src={toAbsoluteUrl(user?.profileImage)}
                    alt={user?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  (user?.name || 'U').charAt(0).toUpperCase()
                )}
              </div>
              {uploadingPhoto && (
                <span className="absolute -inset-0.5 rounded-full border-2 border-neutral-900 border-t-transparent animate-spin" />
              )}
              <label className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-neutral-900 border-2 border-white flex items-center justify-center cursor-pointer hover:bg-black transition-colors">
                <Camera className="w-3 h-3 text-white" />
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={uploadingPhoto}
                />
              </label>
            </div>
            <div className="min-w-0">
              <div className="text-lg font-semibold text-neutral-900 truncate">{user?.name}</div>
              <div className="text-sm text-neutral-500 truncate">{user?.email}</div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3">
            {user?.profileImage ? (
              <button
                onClick={handleRemovePhoto}
                className="inline-flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-red-600 transition-colors"
              >
                <ImageOff className="w-3.5 h-3.5" /> Remove photo
              </button>
            ) : (
              <span className="text-xs text-neutral-400">No photo yet — tap the camera to add one</span>
            )}
            {photoMsg && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                <CheckCircle2 className="w-3.5 h-3.5" /> {photoMsg}
              </span>
            )}
          </div>

          {photoErr && (
            <div className="mt-3 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600">
              {photoErr}
            </div>
          )}

          <div className="mt-5 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                isAdmin
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-neutral-100 text-neutral-700'
              }`}
            >
              {isAdmin ? <ShieldCheck className="w-3.5 h-3.5" /> : <UserIcon className="w-3.5 h-3.5" />}
              {isAdmin ? 'Administrator' : 'Customer'}
            </span>
          </div>

          <div className="mt-6 space-y-2">
            <Link
              to="/orders"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-neutral-700 border border-neutral-300 rounded-lg hover:border-neutral-900 hover:text-neutral-900 transition-colors"
            >
              <Package className="w-4 h-4" /> My Orders
            </Link>
            <Link
              to="/wishlist"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-neutral-700 border border-neutral-300 rounded-lg hover:border-neutral-900 hover:text-neutral-900 transition-colors"
            >
              <Heart className="w-4 h-4" /> Wishlist
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-neutral-900 hover:bg-black rounded-lg transition-colors"
              >
                <ShieldCheck className="w-4 h-4" /> Admin Dashboard
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* Edit forms */}
        <div className="space-y-6">
          {/* Personal info */}
          <form
            onSubmit={handleProfileSubmit}
            className="p-6 rounded-2xl border border-neutral-200 bg-white shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">Profile Information</h2>
                <p className="text-sm text-neutral-500 mt-0.5">
                  Update your name, email and phone number.
                </p>
              </div>
            </div>

            {profileMsg && (
              <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
                <CheckCircle2 className="w-4 h-4" /> {profileMsg}
              </div>
            )}
            {profileErr && (
              <div className="mt-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                {profileErr}
              </div>
            )}

            <div className="mt-5 grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field
                  id="name"
                  name="name"
                  label="Full Name"
                  type="text"
                  value={form.name}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              <Field
                id="email"
                name="email"
                label="Email"
                type="email"
                value={form.email}
                onChange={handleProfileChange}
                required
              />
              <Field
                id="phone"
                name="phone"
                label="Phone"
                type="tel"
                placeholder="98XXXXXXXX"
                value={form.phone}
                onChange={handleProfileChange}
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-neutral-900 hover:bg-black rounded-lg transition-colors disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {savingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </form>

          {/* Password change */}
          <form
            onSubmit={handlePasswordSubmit}
            className="p-6 rounded-2xl border border-neutral-200 bg-white shadow-sm"
          >
            <h2 className="text-lg font-semibold text-neutral-900">Change Password</h2>
            <p className="text-sm text-neutral-500 mt-0.5">
              Keep your account secure with a strong password.
            </p>

            {passwordMsg && (
              <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
                <CheckCircle2 className="w-4 h-4" /> {passwordMsg}
              </div>
            )}
            {passwordErr && (
              <div className="mt-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                {passwordErr}
              </div>
            )}

            <div className="mt-5 grid sm:grid-cols-3 gap-4">
              <Field
                id="currentPassword"
                name="currentPassword"
                label="Current Password"
                type="password"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                autoComplete="current-password"
                required
              />
              <Field
                id="newPassword"
                name="newPassword"
                label="New Password"
                type="password"
                placeholder="Min 6 characters"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                autoComplete="new-password"
                required
              />
              <Field
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm New Password"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                autoComplete="new-password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-neutral-900 hover:bg-black rounded-lg transition-colors disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {savingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Account