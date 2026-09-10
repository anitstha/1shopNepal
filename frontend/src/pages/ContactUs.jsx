import { useState } from 'react'
import { toast } from 'react-toastify'
import { Mail, Phone, MapPin, Send, Check, Clock3, MessageCircle } from 'lucide-react'
import { InfoPage } from '../components/common/InfoPage'

const channels = [
  {
    icon: Mail,
    label: 'Email us',
    value: 'support@1shopnepal.com',
    href: 'mailto:support@1shopnepal.com',
    hint: 'Replies within 24 hours',
  },
  {
    icon: Phone,
    label: 'Call us',
    value: '+977-9803075499',
    href: 'tel:+9779803075499',
    hint: 'Daily, 9 AM – 8 PM NPT',
  },
  {
    icon: MapPin,
    label: 'Visit us',
    value: 'Kathmandu, Nepal',
    hint: 'Mon–Fri, 10 AM – 6 PM',
  },
]

const inputClasses =
  'w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-neutral-900 outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 placeholder:text-neutral-400 text-sm'

function ContactUs() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    toast.success('Message sent! We will get back to you within 24 hours.')
  }

  return (
    <InfoPage
      title="Contact Us"
      subtitle="Questions, feedback or need a hand with an order? Our support team is here every day of the week and happy to help."
      icon={MessageCircle}
      meta="Response time — under 24 hours"
      wide
    >
      <div className="grid lg:grid-cols-5 gap-10 items-start">
        {/* Left — channels */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-neutral-950 tracking-tight">Get in touch</h2>
          <p className="mt-3 text-neutral-500 leading-relaxed">
            The fastest way to reach us is by email or phone. Whichever way you choose, a real
            person from our team will get back to you.
          </p>

          <div className="mt-8 space-y-1.5">
            {channels.map((c) => {
              const inner = (
                <>
                  <span className="w-12 h-12 shrink-0 rounded-2xl bg-neutral-950 text-white flex items-center justify-center group-hover:scale-105 transition-all">
                    <c.icon className="w-5 h-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      {c.label}
                    </p>
                    <p className="mt-0.5 truncate font-semibold text-neutral-900">{c.value}</p>
                    <p className="text-sm text-neutral-500">{c.hint}</p>
                  </div>
                </>
              )
              return c.href ? (
                <a
                  key={c.label}
                  href={c.href}
                  className="group flex items-center gap-4 rounded-2xl px-4 py-3.5 hover:bg-neutral-50 transition-colors"
                >
                  {inner}
                </a>
              ) : (
                <div key={c.label} className="group flex items-center gap-4 rounded-2xl px-4 py-3.5">
                  {inner}
                </div>
              )
            })}
          </div>

          <div className="mt-6 rounded-2xl bg-neutral-50 border border-neutral-200 p-5 flex items-start gap-3">
            <Clock3 className="w-5 h-5 text-neutral-950 shrink-0 mt-0.5" />
            <p className="text-sm text-neutral-600 leading-relaxed">
              We aim to reply to every enquiry within <strong className="font-semibold text-neutral-900">24 hours</strong>, seven
              days a week — including weekends and public holidays.
            </p>
          </div>
        </div>

        {/* Right — form */}
        <div className="lg:col-span-3">
          <div className="rounded-[28px] bg-white border border-neutral-200 shadow-xl shadow-neutral-900/5 p-6 sm:p-10">
            {sent ? (
              <div className="text-center py-16">
                <span className="inline-flex w-16 h-16 rounded-full bg-neutral-950 text-white items-center justify-center">
                  <Check className="w-8 h-8" />
                </span>
                <h3 className="mt-6 text-2xl font-bold text-neutral-950">Message sent!</h3>
                <p className="mt-2 text-neutral-500 max-w-sm mx-auto">
                  Thanks for reaching out. Our team will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-950 text-white text-sm font-semibold hover:bg-black transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-neutral-950">Send us a message</h2>
                <p className="mt-1.5 text-sm text-neutral-500">
                  Fill in the form below and we will get back to you as soon as possible.
                </p>
                <form onSubmit={handleSubmit} className="mt-8 grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-2">
                      Your name
                    </label>
                    <input required type="text" placeholder="John Shrestha" className={inputClasses} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-800 mb-2">
                      Email address
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="john@example.com"
                      className={inputClasses}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-neutral-800 mb-2">
                      Subject
                    </label>
                    <input required type="text" placeholder="What is this about?" className={inputClasses} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-neutral-800 mb-2">Message</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell us a little more..."
                      className={`${inputClasses} resize-none`}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-neutral-950 text-white text-sm font-semibold hover:bg-black transition-colors shadow-lg shadow-neutral-900/10"
                    >
                      <Send className="w-4 h-4" />
                      Send message
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </InfoPage>
  )
}

export default ContactUs