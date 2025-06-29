// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email.trim())
}

export const validatePhone = (phone: string): boolean => {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '')
  // Check if exactly 10 digits
  return cleanPhone.length === 10
}

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('At least 8 characters')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('One uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('One lowercase letter')
  }
  
  if (!/\d/.test(password)) {
    errors.push('One number')
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('One special character')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '')
  
  // Format as (XXX) XXX-XXXX if 10 digits
  if (cleanPhone.length === 10) {
    return `(${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`
  }
  
  return phone
}

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name.trim())
}