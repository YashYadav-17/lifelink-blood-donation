import { createContext, useContext, useEffect, useState } from 'react'
import { AlertCircle, AlertTriangle, CheckCircle2, X } from 'lucide-react'

const ToastContext = createContext()

const toneMap = {
	success: 'success',
	error: 'danger',
	warning: 'warning',
	info: 'primary'
}

function ToastIcon({ type }) {
	if (type === 'warning') return <AlertTriangle size={18} />
	if (type === 'error') return <AlertCircle size={18} />
	return <CheckCircle2 size={18} />
}

export function ToastProvider({ children }) {
	const [toast, setToast] = useState(null)

	useEffect(() => {
		if (toast) {
			const t = setTimeout(() => setToast(null), 3500)
			return () => clearTimeout(t)
		}
		return undefined
	}, [toast])

	const tone = toneMap[toast?.type] || 'success'

	return (
		<ToastContext.Provider value={setToast}>
			{children}
			{toast && (
				<div className="toast-container position-fixed top-0 end-0 p-3 lifelink-toast-wrap">
					<div className={`toast show align-items-center text-bg-${tone} border-0`} role="status" aria-live="polite" aria-atomic="true">
						<div className="d-flex align-items-center">
							<div className="toast-body d-flex align-items-center gap-2">
								<ToastIcon type={toast.type} />
								<span>{toast.text}</span>
							</div>
							<button
								type="button"
								className="btn-close btn-close-white me-2 m-auto"
								aria-label="Close notification"
								onClick={() => setToast(null)}
							/>
						</div>
					</div>
				</div>
			)}
		</ToastContext.Provider>
	)
}

export const useToast = () => useContext(ToastContext)

export function BloodBadge({ value }) {
	return <span className="blood-badge">{value}</span>
}

export function StatusBadge({ value }) {
	return <span className={`status ${String(value).toLowerCase().replace(' ', '-')}`}>{value}</span>
}

export function SectionTitle({ eyebrow, title, text, action }) {
	return (
		<div className="section-title">
			<div>
				<span className="eyebrow">{eyebrow}</span>
				<h2>{title}</h2>
				{text && <p>{text}</p>}
			</div>
			{action}
		</div>
	)
}

export function EmptyState({ title = 'Nothing to show', text = 'Try changing your filters or check back later.' }) {
	return (
		<div className="empty">
			<AlertCircle size={30} />
			<h3>{title}</h3>
			<p>{text}</p>
		</div>
	)
}

export function Modal({ title, children, onClose }) {
	return (
		<div className="modal-wrap" role="dialog" aria-modal="true">
			<div className="modal">
				<button className="icon-btn close" onClick={onClose} aria-label="Close">
					<X />
				</button>
				<h2>{title}</h2>
				{children}
			</div>
		</div>
	)
}
