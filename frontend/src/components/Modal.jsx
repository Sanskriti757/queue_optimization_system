import Button from './Button'

function Modal({ open, title, description, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onClose, isLoading = false }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        {description && <p className="mt-2 text-sm text-slate-600">{description}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Modal
