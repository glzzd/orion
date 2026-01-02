import React from 'react'
import LoginForm from './LoginForm'

const LoginArea = () => {
  return (
    <div className="w-full space-y-6">
          <div>
            <h1 className="text-2xl font-semibold">Xoş gəlmişsiniz!</h1>
            <p className="text-sm text-muted-foreground">Giriş etmək üçün məlumatlarınızı daxil edin.</p>
          </div>
          <LoginForm />
        </div>
  )
}

export default LoginArea
