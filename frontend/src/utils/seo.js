const upsertTag = (tagName, attrName, attrValue, content) => {
  const selector = `${tagName}[${attrName}="${attrValue}"]`
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement(tagName)
    el.setAttribute(attrName, attrValue)
    document.head.appendChild(el)
  }
  if (content !== undefined) el.setAttribute('content', content)
  return el
}

export const setPageMeta = ({
  title,
  description,
  canonical,
  image,
  type = 'website',
  noindex = false,
}) => {
  document.title = title

  const url = canonical || window.location.origin + window.location.pathname

  upsertTag('meta', 'name', 'description', description)
  upsertTag('meta', 'name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')

  upsertTag('meta', 'property', 'og:title', title)
  upsertTag('meta', 'property', 'og:description', description)
  upsertTag('meta', 'property', 'og:type', type)
  if (image) upsertTag('meta', 'property', 'og:image', image)
  upsertTag('meta', 'property', 'og:url', url)
  upsertTag('meta', 'property', 'og:site_name', '1Shop Nepal')

  upsertTag('meta', 'name', 'twitter:card', image ? 'summary_large_image' : 'summary')
  upsertTag('meta', 'name', 'twitter:title', title)
  upsertTag('meta', 'name', 'twitter:description', description)
  if (image) upsertTag('meta', 'name', 'twitter:image', image)

  upsertTag('link', 'rel', 'canonical', url)
}

export const setJsonLd = (data) => {
  let script = document.getElementById('seo-jsonld')
  if (!script) {
    script = document.createElement('script')
    script.id = 'seo-jsonld'
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(data)
}

export const clearJsonLd = () => {
  const script = document.getElementById('seo-jsonld')
  if (script) script.remove()
}

export const truncate = (text, max = 160) => {
  const clean = (text || '').replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max - 1).trim()}…`
}

export const siteUrl = () => window.location.origin