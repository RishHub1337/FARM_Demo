import React from 'react'
import Header from '../pages/Header'

const AuthLayout = ({children}) => {
  return (
    <div>
      <header className="w-full py-4">
          <Header />
        </header>

        {/* Main content naturally flows below */}
        <main className="mt-4 pb-10">
            {children}
        </main>
    </div>
  )
}

export default AuthLayout
