import { useState } from 'react'
import { Mail, Send } from 'lucide-react'

function Newsletter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="rounded-3xl bg-gray-900 text-white px-6 py-12 sm:px-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mx-auto mb-6 w-14 h-14 rounded-2xl bg-orange-600 flex items-center justify-center">
            <Mail className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold">Subscribe to our Newsletter</h2>
          <p className="mt-3 text-gray-400">
            Get the latest deals, new arrivals and exclusive offers straight to your inbox.
          </p>

          {subscribed ? (
            <p className="mt-6 text-lg font-semibold text-green-400">
              🎉 Thank you for subscribing!
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-orange-600 hover:bg-orange-700 font-semibold transition-colors"
              >
                Subscribe
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

export default Newsletter
