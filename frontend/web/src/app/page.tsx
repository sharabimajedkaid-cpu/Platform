'use client'

import { useEffect } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { LoginPage } from '@/components/auth/login-page'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

export default function Home() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center navy-gradient">
        <div className="text-center">
          <div className="w-16 h-16 gold-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
            <span className="text-navy font-black text-2xl">B44</span>
          </div>
          <p className="text-white/70 text-sm">Loading Britishce44 Platform...</p>
        </div>
      </div>
    )
  }

  if (!user) return <LoginPage />
  return <DashboardLayout />
}
