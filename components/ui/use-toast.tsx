"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface ToastProps {
  title: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
}

interface ToastState extends ToastProps {
  id: string
  visible: boolean
}

const toastStore: {
  toasts: ToastState[]
  add: (toast: ToastProps) => void
  remove: (id: string) => void
  update: (id: string, toast: Partial<ToastProps>) => void
} = {
  toasts: [],
  add: () => {},
  remove: () => {},
  update: () => {},
}

export function Toast({ toast }: { toast: ToastState }) {
  return (
    <div
      className={`pointer-events-auto relative flex w-full max-w-md rounded-lg border p-4 shadow-lg transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full ${
        toast.variant === "destructive"
          ? "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-50"
          : "border-gray-200 bg-white text-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
      }`}
    >
      <div className="grid gap-1">
        {toast.title && <div className="text-sm font-semibold">{toast.title}</div>}
        {toast.description && <div className="text-sm opacity-90">{toast.description}</div>}
      </div>
      <button
        onClick={() => toastStore.remove(toast.id)}
        className="absolute right-2 top-2 rounded-md p-1 text-gray-950/50 opacity-70 transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 dark:text-gray-50/50"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  )
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastState[]>([])

  useEffect(() => {
    toastStore.toasts = []
    toastStore.add = (toast: ToastProps) => {
      const id = Math.random().toString(36).substring(2, 9)
      const newToast: ToastState = {
        ...toast,
        id,
        visible: true,
      }
      toastStore.toasts = [...toastStore.toasts, newToast]
      setToasts(toastStore.toasts)

      if (toast.duration !== 0) {
        setTimeout(() => {
          toastStore.remove(id)
        }, toast.duration || 5000)
      }
    }

    toastStore.remove = (id: string) => {
      toastStore.toasts = toastStore.toasts.filter((t) => t.id !== id)
      setToasts(toastStore.toasts)
    }

    toastStore.update = (id: string, toast: Partial<ToastProps>) => {
      toastStore.toasts = toastStore.toasts.map((t) => (t.id === id ? { ...t, ...toast } : t))
      setToasts(toastStore.toasts)
    }
  }, [])

  return (
    <div className="fixed top-0 z-[100] flex flex-col gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col-reverse md:max-w-[420px]">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  )
}

export const toast = (props: ToastProps) => {
  toastStore.add(props)
}

toast.dismiss = (id?: string) => {
  if (id) {
    toastStore.remove(id)
  } else {
    toastStore.toasts.forEach((t) => toastStore.remove(t.id))
  }
}

toast.update = (id: string, props: Partial<ToastProps>) => {
  toastStore.update(id, props)
}

// Add useToast hook for compatibility
export function useToast() {
  return {
    toast,
    dismiss: toast.dismiss,
    update: toast.update,
  }
}
