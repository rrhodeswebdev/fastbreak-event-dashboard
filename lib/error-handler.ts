import { toast } from 'sonner'

export enum ErrorType {
  CLIENT_ERROR = '4xx',
  SERVER_ERROR = '5xx',
}

export interface ErrorHandlerOptions {
  customMessage?: string
  context?: string
  errorType?: ErrorType
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message)
  }
  return 'An unexpected error occurred'
}

export function handleError(error: unknown, options: ErrorHandlerOptions = {}) {
  const { customMessage, context, errorType } = options
  const message = customMessage || getErrorMessage(error)
  const type = errorType || ErrorType.SERVER_ERROR

  console.error(context ? `[${context}]` : '[Error]', error)
  toast.error(message)

  return { message, type }
}
