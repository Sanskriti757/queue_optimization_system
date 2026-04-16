import { cn } from '../utils/helpers'

const variants = {
  primary: 'bg-zinc-900 text-white hover:bg-black',
  secondary: 'bg-white text-zinc-700 border border-zinc-300 hover:bg-zinc-100',
  danger: 'bg-zinc-800 text-white hover:bg-zinc-900',
  success: 'bg-zinc-700 text-white hover:bg-zinc-800',
}

function Button({ className, variant = 'primary', isLoading = false, disabled, children, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition duration-200 disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Please wait...' : children}
    </button>
  )
}

export default Button
