const ORDER_STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-sky-100 text-sky-700',
  processing: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const PAYMENT_STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700',
  paid: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-200 text-gray-700',
}

function StatusBadge({ status, type = 'order' }) {
  const styles = type === 'payment' ? PAYMENT_STATUS_STYLES : ORDER_STATUS_STYLES
  const normalized = (status || '').toLowerCase()

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${
        styles[normalized] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {normalized}
    </span>
  )
}

export default StatusBadge