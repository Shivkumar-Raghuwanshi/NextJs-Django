"use client"
import React from 'react';
import {useRouter} from 'next/navigation'
import authService from '@/lib/authService';
import {Button} from "@/components/ui/button"
const Logout: React.FC = () => {
  const router = useRouter()

  const handleLogout = () => {
    authService.logout();
    router.push('/');
  };

  return (
    <div>
      <Button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Logout
      </Button>
    </div>
  );
};

export default Logout;