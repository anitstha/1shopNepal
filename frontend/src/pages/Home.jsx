import HeroBanner from '../components/home/HeroBanner'
import CategoriesSection from '../components/home/CategoriesSection'
import FeaturedProducts from '../components/home/FeaturedProducts'
import DealSection from '../components/home/DealSection'
import PopularProducts from '../components/home/PopularProducts'
import Seo from '../components/common/Seo'
import { siteUrl } from '../utils/seo'

function Home() {
  const origin = siteUrl()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: '1Shop Nepal',
        url: origin,
        description:
          "Nepal's one-stop online shopping destination for electronics, fashion, groceries and more.",
        potentialAction: {
          '@type': 'SearchAction',
          target: `${origin}/products?search={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        name: '1Shop Nepal',
        url: origin,
        address: 'Putalisadak, Kathmandu, Nepal',
        email: 'support@1shopnepal.com',
      },
    ],
  }

  return (
    <div>
      <Seo
        title="1Shop Nepal — Nepal's One-Stop Online Shopping Store"
        description="Shop electronics, fashion, groceries, beauty and more at 1Shop Nepal. Affordable prices, secure payments and fast delivery across Nepal."
        canonical="/"
        jsonLd={jsonLd}
      />
      <HeroBanner />
      <CategoriesSection />
      <FeaturedProducts />
      <DealSection />
      <PopularProducts />
    </div>
  )
}

export default Home
