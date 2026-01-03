import { useAuth } from '@/hooks/useAuth';
import React from 'react';
import logo from "@/assets/orionlogo.png";
import Navbar from './Navbar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Settings, ChevronRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const HeaderArea = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="px-6 py-4 flex items-center justify-between text-white bg-[#124459]">
        <div className="font-semibold">
          <img src={logo} alt="Logo" className="w-32" />
        </div>
        <div className='my-0 hidden md:block'>
          <Navbar/>
        </div>
        <div className="flex items-center gap-4 bg-white/10 px-4 py-2 rounded-md">
          <DropdownMenu onOpenChange={setIsOpen}>
            <DropdownMenuTrigger className="focus:outline-none cursor-pointer">
              <div className="flex justify-between items-center gap-3 group">
                
                <Avatar className="h-10 w-10 border-2 border-white/10 group-hover:border-white/20 transition-all">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-white/10 text-white font-medium">
                    {getInitials(user?.firstName)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium text-white group-hover:text-white/90 transition-colors">
                    {user?.lastName ? `${user.lastName} ${user.firstName}` : user?.name}
                  </p>
                  <p className="text-xs text-white/60 group-hover:text-white/70 transition-colors capitalize">{user?.role || 'User'}</p>
                </div>
                <div className="hidden sm:block transition-transform duration-200">
                    {isOpen ? <ChevronDown size={16} className="text-white/70" /> : <ChevronRight size={16} className="text-white/70" />}
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2">
              <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer gap-2">
                <User size={16} />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2">
                <Settings size={16} />
                <span>Ayarlar</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600 cursor-pointer gap-2">
                <LogOut size={16} />
                <span>Çıxış</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
  )
}

export default HeaderArea
