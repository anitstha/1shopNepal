import { ShieldCheck, Truck, BadgeCheck, Headphones } from 'lucide-react'
import SectionHeader from '../common/SectionHeader'

const reasons = [
  {
    icon: ShieldCheck,
    title: 'Secure Payment',
    desc: 'Pay safely with cash on delivery, eSewa, Khalti or bank transfer.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    desc: 'Quick and reliable delivery to your doorstep across all of Nepal.',
  },
  {
    icon: BadgeCheck,
    title: 'Quality Products',
    desc: 'Every product is quality-checked to ensure you get the best value.',
  },
  {
    icon: Headphones,
    title: 'Customer Support',
    desc: 'Our friendly support team is here to help you 24/7.',
  },
]

function WhyChooseUs() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader
        title="Why Choose 1ShopNepal?"
        subtitle="The smartest way to shop online in Nepal"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {reasons.map((reason) => (
          <div
            key={reason.title}
            className="p-6 rounded-2xl border border-gray-200 hover:shadow-lg hover:border-orange-200 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
              <reason.icon className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">{reason.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{reason.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default WhyChooseUs
