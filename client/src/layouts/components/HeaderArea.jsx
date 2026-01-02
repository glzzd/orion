import { useAuth } from '@/hooks/useAuth';
import React from 'react';
import logo from "@/assets/orionlogo.png";
import Navbar from './Navbar';

const HeaderArea = () => {
      const { user, logout } = useAuth();
  return (
    <header className="p-4 flex items-center justify-between text-white">
        <div className="font-semibold">
          <img src={logo} alt="Logo" className="h-10" />
        </div>
        <div className='my-0'>
          <Navbar/>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/80">{user?.name}</span>
          <button className="text-sm underline cursor-pointer" onClick={logout}>Çıxış</button>
        </div>
      </header>
  )
}

export default HeaderArea
