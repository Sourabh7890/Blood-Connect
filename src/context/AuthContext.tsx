import React, { createContext, useState, useContext, useEffect } from 'react'
import { supabase, type User } from '../lib/supabase'
import { Session } from '@supabase/supabase-js'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  session: Session | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => Promise<void>
  updateUser: (userData: Partial<User>) => Promise<void>
}

interface RegisterData {
  name: string
  email: string
  password: string
  role: 'donor' | 'recipient'
  bloodType?: string
  phone?: string
  address?: string
  latitude?: number
  longitude?: number
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log('🔄 AuthProvider initializing...')
    
    // Check if environment variables are available
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    console.log('Environment check:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'missing'
    })

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing Supabase environment variables!')
      toast.error('Database configuration missing. Please check environment variables.')
      setIsLoading(false)
      return
    }

    // Get initial session with improved error handling
    const initializeAuth = async () => {
      try {
        console.log('🔄 Getting initial session...')
        
        // Create a promise that resolves with session data or null on timeout
        const getSessionWithTimeout = () => {
          return new Promise<{ data: { session: Session | null }, error: any }>((resolve) => {
            const timeoutId = setTimeout(() => {
              console.warn('⚠️ Session request timed out - continuing without session')
              resolve({ data: { session: null }, error: null })
            }, 8000) // Reduced timeout to 8 seconds
            
            supabase.auth.getSession()
              .then((result) => {
                clearTimeout(timeoutId)
                resolve(result)
              })
              .catch((error) => {
                clearTimeout(timeoutId)
                resolve({ data: { session: null }, error })
              })
          })
        }
        
        const { data: { session }, error } = await getSessionWithTimeout()
        
        if (error) {
          console.error('❌ Session error:', error)
          // Don't throw for network errors - just continue without session
          if (error.message?.includes('fetch') || error.message?.includes('network')) {
            console.warn('⚠️ Network error during session fetch - continuing offline')
            toast.error('Unable to connect to database. Some features may be limited.')
          } else {
            throw error
          }
        }

        console.log('✅ Initial session:', session ? 'found' : 'none')
        setSession(session)
        
        if (session?.user) {
          console.log('🔄 Fetching user profile for:', session.user.id)
          await fetchUserProfile(session.user.id)
        } else {
          console.log('✅ No session - setting loading to false')
          setIsLoading(false)
        }
      } catch (error: any) {
        console.error('❌ Failed to initialize auth:', error)
        
        // Provide more specific error messages but don't block the app
        if (error.message?.includes('fetch') || error.message?.includes('network')) {
          toast.error('Unable to connect to database. Please check your internet connection.')
        } else if (error.message?.includes('timeout')) {
          toast.error('Connection is slow. You can still browse the app.')
        } else {
          toast.error('Authentication service unavailable. Some features may be limited.')
        }
        
        // Always set loading to false so the app doesn't hang
        setIsLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes with error handling
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session ? 'session exists' : 'no session')
      setSession(session)
      if (session?.user) {
        try {
          await fetchUserProfile(session.user.id)
        } catch (error) {
          console.error('❌ Error fetching profile on auth change:', error)
          setIsLoading(false)
        }
      } else {
        setUser(null)
        setIsLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('🔄 Fetching user profile for:', userId)
      
      // Add timeout to profile fetch as well
      const fetchWithTimeout = () => {
        return new Promise<any>((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new Error('Profile fetch timeout'))
          }, 5000) // 5 second timeout for profile fetch
          
          supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single()
            .then((result) => {
              clearTimeout(timeoutId)
              resolve(result)
            })
            .catch((error) => {
              clearTimeout(timeoutId)
              reject(error)
            })
        })
      }
      
      const { data, error } = await fetchWithTimeout()

      if (error) {
        console.error('❌ Error fetching user profile:', error)
        // If user profile doesn't exist, that's okay - they might be in the middle of registration
        if (error.code === 'PGRST116') {
          console.log('ℹ️ User profile not found - user might be registering')
          setUser(null)
          setIsLoading(false)
          return
        }
        // For timeout or network errors, don't throw - just continue
        if (error.message?.includes('timeout') || error.message?.includes('fetch')) {
          console.warn('⚠️ Profile fetch failed - continuing without profile')
          toast.error('Unable to load user profile. Please refresh the page.')
          setUser(null)
          setIsLoading(false)
          return
        }
        throw error
      }
      
      console.log('✅ User profile fetched successfully')
      setUser(data)
    } catch (error) {
      console.error('❌ Error fetching user profile:', error)
      toast.error('Failed to load user profile')
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      console.log('🔄 Attempting login for:', email)
      
      // Add timeout to login as well
      const loginWithTimeout = () => {
        return new Promise<any>((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new Error('Login request timed out. Please check your connection and try again.'))
          }, 10000) // 10 second timeout for login
          
          supabase.auth.signInWithPassword({
            email,
            password,
          }).then((result) => {
            clearTimeout(timeoutId)
            resolve(result)
          }).catch((error) => {
            clearTimeout(timeoutId)
            reject(error)
          })
        })
      }
      
      const { error } = await loginWithTimeout()
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials.')
        }
        if (error.message.includes('timeout')) {
          throw new Error('Login request timed out. Please check your connection and try again.')
        }
        throw error
      }
      console.log('✅ Login successful')
    } catch (error: any) {
      console.error('❌ Login error:', error)
      toast.error(error.message || 'Login failed')
      throw error
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      console.log('🔄 Attempting registration for:', userData.email)
      
      // Add timeout to registration
      const registerWithTimeout = () => {
        return new Promise<any>((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new Error('Registration request timed out. Please check your connection and try again.'))
          }, 15000) // 15 second timeout for registration
          
          supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
            options: {
              emailRedirectTo: undefined, // Disable email confirmation
            }
          }).then((result) => {
            clearTimeout(timeoutId)
            resolve(result)
          }).catch((error) => {
            clearTimeout(timeoutId)
            reject(error)
          })
        })
      }
      
      // Sign up the user
      const { data: authData, error: authError } = await registerWithTimeout()

      if (authError) {
        if (authError.message.includes('already registered')) {
          throw new Error('An account with this email already exists. Please try logging in.')
        }
        if (authError.message.includes('timeout')) {
          throw new Error('Registration request timed out. Please check your connection and try again.')
        }
        throw authError
      }

      if (authData.user) {
        console.log('✅ User created, creating profile...')
        
        // Create user profile with timeout
        const createProfileWithTimeout = () => {
          return new Promise<any>((resolve, reject) => {
            const timeoutId = setTimeout(() => {
              reject(new Error('Profile creation timed out. Please try logging in.'))
            }, 10000) // 10 second timeout for profile creation
            
            supabase
              .from('users')
              .insert([
                {
                  id: authData.user.id,
                  email: userData.email,
                  name: userData.name,
                  role: userData.role,
                  blood_type: userData.bloodType,
                  phone: userData.phone,
                  address: userData.address,
                  latitude: userData.latitude,
                  longitude: userData.longitude,
                  status: 'active',
                  donation_count: 0,
                },
              ])
              .then((result) => {
                clearTimeout(timeoutId)
                resolve(result)
              })
              .catch((error) => {
                clearTimeout(timeoutId)
                reject(error)
              })
          })
        }
        
        const { error: profileError } = await createProfileWithTimeout()

        if (profileError) {
          console.error('❌ Profile creation error:', profileError)
          if (profileError.message?.includes('timeout')) {
            throw new Error('Profile creation timed out. Please try logging in to complete setup.')
          }
          throw new Error('Failed to create user profile. Please try again.')
        }
        
        console.log('✅ Profile created successfully')
      }
    } catch (error: any) {
      console.error('❌ Registration error:', error)
      toast.error(error.message || 'Registration failed')
      throw error
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      toast.success('Logged out successfully')
    } catch (error: any) {
      console.error('Logout error:', error)
      toast.error('Failed to logout')
      throw error
    }
  }

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', user.id)

      if (error) throw error

      setUser({ ...user, ...userData })
      toast.success('Profile updated successfully!')
    } catch (error: any) {
      console.error('Update user error:', error)
      toast.error('Failed to update profile')
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!session,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}