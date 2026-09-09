import { useEffect } from 'react'
import { setPageMeta, setJsonLd } from '../../utils/seo'

function Seo({ title, description, canonical, image, type, noindex, jsonLd }) {
  useEffect(() => {
    setPageMeta({ title, description, canonical, image, type, noindex })
    if (jsonLd) setJsonLd(jsonLd)
  }, [title, description, canonical, image, type, noindex, jsonLd])

  return null
}

export default Seo