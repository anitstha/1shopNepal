import { useState } from 'react'
import { Send, CheckCircle2 } from 'lucide-react'

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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="relative overflow-hidden rounded-[28px] bg-neutral-100 px-6 py-14 sm:px-14">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-neutral-200 blur-3xl" />
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
            Stay in the loop
          </h2>
          <p className="mt-3 text-neutral-500">
            Get the latest deals, new arrivals and exclusive offers straight to
            your inbox. No spam — unsubscribe anytime.
          </p>

          {subscribed ? (
            <p className="mt-8 inline-flex items-center gap-2 text-base font-semibold text-green-600 bg-white rounded-full px-6 py-3 shadow-sm">
              <CheckCircle2 className="w-5 h-5" />
              Thank you for subscribing!
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-5 py-3.5 rounded-full border border-neutral-300 bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-neutral-900 hover:bg-black text-white font-semibold transition-colors"
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