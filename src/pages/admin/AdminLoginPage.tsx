import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    // Redirect only once on mount
    navigate('/admin/products', { replace: true });
    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
        <p className="text-center">Logging in as admin...</p>
      </div>
    </div>
  );
  // No login form, no authentication
};



export default AdminLoginPage;
