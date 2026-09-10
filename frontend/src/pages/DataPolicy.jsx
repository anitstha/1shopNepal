import { ShieldCheck, Database, ScrollText, Lock, Cookie, Share2, UserCheck } from 'lucide-react'
import { InfoPage, InfoSection } from '../components/common/InfoPage'

const sections = [
  { id: 'collect', icon: Database, title: 'Information we collect' },
  { id: 'use', icon: ScrollText, title: 'How we use your information' },
  { id: 'security', icon: Lock, title: 'Payment & data security' },
  { id: 'cookies', icon: Cookie, title: 'Cookies' },
  { id: 'sharing', icon: Share2, title: 'Sharing your information' },
  { id: 'rights', icon: UserCheck, title: 'Your rights' },
]

const corpus = [
  {
    id: 'collect',
    title: 'Information we collect',
    intro: 'Everything we ask for has a clear purpose — to serve you better.',
    body: (
      <>
        <p>
          When you create an account or place an order, we collect the details you provide — such
          as your name, email address, phone number, delivery address and order history. We also
          collect basic technical information like your browser and device type to keep the site
          working smoothly.
        </p>
      </>
    ),
  },
  {
    id: 'use',
    title: 'How we use your information',
    intro: 'Your data powers your experience — and nothing else.',
    body: (
      <>
        <p>
          We use your information to process orders, arrange delivery, provide customer support and
          keep you updated about your purchases. With your consent, we may occasionally send
          promotional emails about products and offers you may like. You can opt out at any time.
        </p>
      </>
    ),
  },
  {
    id: 'security',
    title: 'Payment & data security',
    intro: 'Your security is built into every transaction.',
    body: (
      <>
        <p>
          All sensitive data is transmitted over secured connections and we never store your full
          card details. Payment is collected in cash on delivery, so no online payment information is
          handled or stored.
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies',
    intro: 'Small files, big convenience.',
    body: (
      <>
        <p>
          We use cookies to keep you signed in, remember items in your cart and understand how
          visitors use the site so we can improve it. You can disable cookies in your browser, but
          some features may not work as intended.
        </p>
      </>
    ),
  },
  {
    id: 'sharing',
    title: 'Sharing your information',
    intro: 'We only share what is needed to get your order to your door.',
    body: (
      <>
        <p>
          We only share the minimum information needed to deliver your order — for example your
          address with our courier partners. We never sell your personal information to third
          parties.
        </p>
      </>
    ),
  },
  {
    id: 'rights',
    title: 'Your rights',
    intro: 'You stay in control of your data.',
    body: (
      <>
        <p>
          You can access, correct or delete your personal information at any time from your account
          settings, or by contacting us at{' '}
          <a href="mailto:support@1shopnepal.com" className="font-semibold text-neutral-900 underline underline-offset-2 hover:text-black">
            support@1shopnepal.com
          </a>
          .
        </p>
      </>
    ),
  },
]

function DataPolicy() {
  return (
    <InfoPage
      title="Privacy Policy"
      subtitle="Your privacy matters to us. Here is a plain-language rundown of what information we collect, why, and the choices you have."
      icon={ShieldCheck}
      meta="Last updated — January 2026"
    >
      {/* Table of contents */}
      <div className="rounded-[28px] bg-white border border-neutral-200 p-6 sm:p-8 mb-10 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400 mb-5">
          On this page
        </p>
        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
          {sections.map((s, i) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="group flex items-center gap-3 py-2 rounded-xl text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors"
              >
                <span className="font-display text-neutral-300 group-hover:text-neutral-400">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <s.icon className="w-4 h-4 text-neutral-400 group-hover:text-neutral-950 transition-colors" />
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Sections */}
      {corpus.map((c, i) => (
        <div key={c.id} id={c.id} className="scroll-mt-24">
          <InfoSection index={i + 1} title={c.title} intro={c.intro}>
            {c.body}
          </InfoSection>
        </div>
      ))}

      <p className="mt-10 pt-6 border-t border-neutral-200 text-xs text-neutral-400 leading-relaxed">
        This policy may be updated from time to time. Changes will be posted on this page, so check
        back whenever you need certainty about how we handle your data.
      </p>
    </InfoPage>
  )
}

export default DataPolicy