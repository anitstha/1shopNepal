function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary:
      'bg-neutral-900 text-white hover:bg-black disabled:bg-neutral-300 disabled:text-neutral-400',
    outline:
      'text-neutral-900 border border-neutral-300 hover:border-neutral-900 hover:bg-neutral-50 disabled:text-neutral-400 disabled:border-neutral-200',
  }

  return (
    <button
      className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-full transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button