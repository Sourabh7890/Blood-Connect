import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase configuration check:', {
  url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING',
  key: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'MISSING',
  urlLength: supabaseUrl?.length || 0,
  keyLength: supabaseAnonKey?.length || 0
})

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!')
  console.error('Expected format:')
  console.error('VITE_SUPABASE_URL=https://your-project.supabase.co')
  console.error('VITE_SUPABASE_ANON_KEY=eyJ...')
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// Validate URL format
if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
  console.error('❌ Invalid Supabase URL format!')
  console.error('Expected: https://your-project.supabase.co')
  console.error('Received:', supabaseUrl)
  throw new Error('Invalid Supabase URL format')
}

// Validate key format
if (!supabaseAnonKey.startsWith('eyJ')) {
  console.error('❌ Invalid Supabase anon key format!')
  console.error('Expected: eyJ...')
  console.error('Received:', supabaseAnonKey.substring(0, 20) + '...')
  throw new Error('Invalid Supabase anon key format')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'x-client-info': 'blood-connect-app'
    }
  }
})

// Test the connection with better error handling and timeout
console.log('🔄 Testing Supabase connection...')
const testConnection = async () => {
  try {
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection test timeout')), 5000)
    )
    
    // Race between the actual request and timeout
    const result = await Promise.race([
      supabase.auth.getSession(),
      timeoutPromise
    ])
    
    const { data, error } = result as any
    
    if (error) {
      console.error('❌ Supabase connection error:', error)
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        statusText: error.statusText
      })
    } else {
      console.log('✅ Supabase connected successfully!')
      console.log('Session status:', data.session ? 'Active session found' : 'No active session')
    }
  } catch (err: any) {
    if (err.message.includes('timeout')) {
      console.warn('⚠️ Supabase connection test timed out - this may indicate network issues')
    } else {
      console.error('❌ Failed to test Supabase connection:', err)
    }
  }
}

testConnection()

// Database types
export interface User {
  id: string
  email: string
  name: string
  role: 'donor' | 'recipient' | 'admin'
  blood_type?: string
  phone?: string
  address?: string
  latitude?: number
  longitude?: number
  status: 'active' | 'inactive' | 'pending'
  last_donation?: string
  donation_count: number
  created_at: string
  updated_at: string
}

export interface BloodRequest {
  id: string
  recipient_id: string
  blood_type: string
  urgency: 'normal' | 'urgent' | 'emergency'
  patient_name: string
  hospital: string
  details?: string
  status: 'active' | 'completed' | 'expired'
  created_at: string
  updated_at: string
  recipient?: User
}

export interface Donation {
  id: string
  donor_id: string
  date: string
  location: string
  blood_amount: number
  status: 'completed' | 'cancelled'
  created_at: string
  donor?: User
}