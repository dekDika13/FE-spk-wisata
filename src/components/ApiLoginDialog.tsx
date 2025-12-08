
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApiAuth } from '@/hooks/useApiAuth';
import { toast } from 'sonner';

interface ApiLoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const ApiLoginDialog: React.FC<ApiLoginDialogProps> = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useApiAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login({ username, password });
      toast.success('Login berhasil!');
      onClose();
      setUsername('');
      setPassword('');
    } catch (error) {
      toast.error('Username atau password salah');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Masuk ke Akun Anda
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Masukkan username Anda"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Masukkan password Anda"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-bali-gradient hover:opacity-90"
            disabled={isLoading}
          >
            {isLoading ? 'Memproses...' : 'Masuk'}
          </Button>
        </form>
        
        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            Belum punya akun?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-bali-ocean hover:underline font-medium"
            >
              Daftar sekarang
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiLoginDialog;
