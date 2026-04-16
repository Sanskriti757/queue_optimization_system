import { cn } from '../utils/helpers'

function Card({ title, description, className, children }) {
  return (
    <section
      className={cn(
        'rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_-16px_rgba(15,23,42,0.25)]',
        className,
      )}
    >
      {(title || description) && (
        <header className="mb-4">
          {title && <h3 className="text-base font-semibold text-slate-800">{title}</h3>}
          {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </header>
      )}
      {children}
    </section>
  )
}

export default Card
