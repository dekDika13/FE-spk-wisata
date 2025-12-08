
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import WisataForm from './WisataForm';
import { useApiAuth } from '@/hooks/useApiAuth';

const SubmitWisataDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useApiAuth();

  const handleSave = () => {
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-bali-gradient hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Ajukan Tempat Wisata
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajukan Tempat Wisata Baru</DialogTitle>
        </DialogHeader>
        <WisataForm
          onSave={handleSave}
          onCancel={handleCancel}
          isAdmin={false}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SubmitWisataDialog;
