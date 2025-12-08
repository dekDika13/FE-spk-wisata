
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApiAuth } from '@/hooks/useApiAuth';
import { toast } from 'sonner';

interface ApiRegisterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const ApiRegisterDialog: React.FC<ApiRegisterDialogProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: '',
    full_name: '',
    bod: '',
    address: ''
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const { register, isLoading } = useApiAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Password tidak cocok');
      return;
    }

    try {
      await register({
        username: formData.username,
        password: formData.password,
        email: formData.email,
        phone: formData.phone,
        full_name: formData.full_name,
        bod: formData.bod,
        address: formData.address,
        photo: photo || undefined
      });
      
      toast.success('Registrasi berhasil!');
      onClose();
      setFormData({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        phone: '',
        full_name: '',
        bod: '',
        address: ''
      });
      setPhoto(null);
    } catch (error) {
      toast.error('Registrasi gagal');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Daftar Akun Baru
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Nama Lengkap</Label>
            <Input
              id="full_name"
              type="text"
              placeholder="Masukkan nama lengkap"
              value={formData.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Masukkan username"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Masukkan email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Nomor Telepon</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Masukkan nomor telepon"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bod">Tanggal Lahir</Label>
            <Input
              id="bod"
              type="date"
              value={formData.bod}
              onChange={(e) => handleInputChange('bod', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Alamat</Label>
            <Input
              id="address"
              type="text"
              placeholder="Masukkan alamat"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">Foto Profil</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Masukkan password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Konfirmasi password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              required
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-bali-gradient hover:opacity-90"
            disabled={isLoading}
          >
            {isLoading ? 'Memproses...' : 'Daftar'}
          </Button>
        </form>
        
        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            Sudah punya akun?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-bali-ocean hover:underline font-medium"
            >
              Masuk di sini
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiRegisterDialog;
