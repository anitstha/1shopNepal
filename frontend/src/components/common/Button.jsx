function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary:
      'bg-orange-600 text-white hover:bg-orange-700 disabled:bg-gray-300',
    outline:
      'text-orange-600 border border-orange-600 hover:bg-orange-50 disabled:text-gray-400 disabled:border-gray-300',
  }

  return (
    <button
      className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
