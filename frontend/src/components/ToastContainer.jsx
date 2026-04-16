import { CheckCircle2, CircleAlert, Info, X } from 'lucide-react'
import { useToast } from '../context/ToastContext'

const variantMap = {
  success: {
    icon: CheckCircle2,
    style: 'border-zinc-300 bg-white text-zinc-800',
  },
  error: {
    icon: CircleAlert,
    style: 'border-zinc-400 bg-zinc-100 text-zinc-900',
  },
  info: {
    icon: Info,
    style: 'border-zinc-300 bg-zinc-50 text-zinc-700',
  },
}

function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[60] space-y-3">
      {toasts.map((toast) => {
        const config = variantMap[toast.variant] || variantMap.success
        const Icon = config.icon
        return (
          <div key={toast.id} className={`pointer-events-auto w-80 rounded-xl border p-3 shadow-md ${config.style}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <Icon className="mt-0.5 size-4" />
                <div>
                  <p className="text-sm font-semibold">{toast.title}</p>
                  {toast.description ? <p className="mt-0.5 text-xs">{toast.description}</p> : null}
                </div>
              </div>
              <button onClick={() => removeToast(toast.id)} className="rounded-md p-1 hover:bg-white/60" type="button">
                <X className="size-4" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ToastContainer
