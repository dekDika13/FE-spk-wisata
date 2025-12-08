import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Search, Eye, Check, X, Clock, RefreshCw } from 'lucide-react';
import { useWisata } from '@/hooks/useWisata';
import { useApiAuth } from '@/hooks/useApiAuth';
import { useApiDestinations } from '@/hooks/useApiDestinations';
import { destinationAPI } from '@/services/api';
import { WisataLocation } from '@/types';
import WisataForm from './WisataForm';
import { toast } from 'sonner';

const AdminPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<'list' | 'add' | 'edit'>('list');
  const [editingLocation, setEditingLocation] = useState<WisataLocation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectingLocationId, setRejectingLocationId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  // Use API destinations for admin
  const { destinations, loadDestinations, isLoading } = useApiDestinations();
  const { getPendingLocations, approveLocation, rejectLocation } = useWisata();
  const { user } = useApiAuth();

  // Reload destinations on mount
  useEffect(() => {
    loadDestinations();
  }, []);

  const filteredLocations = destinations.filter(location =>
    (location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const pendingLocations = getPendingLocations();

  const handleAddNew = () => {
    setCurrentView('add');
    setEditingLocation(null);
  };

  const handleEdit = (location: WisataLocation) => {
    setCurrentView('edit');
    setEditingLocation(location);
  };

  const handleDelete = async (locationId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus tempat wisata ini?')) {
      setIsDeleting(locationId);
      try {
        await destinationAPI.delete(Number(locationId));
        toast.success('Tempat wisata berhasil dihapus!');
        // Reload destinations after delete
        await loadDestinations();
      } catch (error) {
        console.error('Error deleting destination:', error);
        toast.error('Gagal menghapus tempat wisata. Silakan coba lagi.');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleApprove = (locationId: string) => {
    if (user?.id) {
      approveLocation(locationId, user.id);
      toast.success('Tempat wisata berhasil disetujui dan dipublikasi!');
    }
  };

  const handleReject = (locationId: string) => {
    if (user?.id && rejectionReason.trim()) {
      rejectLocation(locationId, user.id, rejectionReason);
      setRejectingLocationId(null);
      setRejectionReason('');
      toast.success('Pengajuan tempat wisata berhasil ditolak.');
    }
  };

  const handleFormSave = async () => {
    setCurrentView('list');
    setEditingLocation(null);
    // Reload destinations after save
    await loadDestinations();
  };

  const handleFormCancel = () => {
    setCurrentView('list');
    setEditingLocation(null);
  };

  const handleRefresh = async () => {
    await loadDestinations();
    toast.success('Data berhasil diperbarui');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800">Terpublikasi</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Menunggu Review</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Ditolak</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (currentView === 'add' || currentView === 'edit') {
    return (
      <div className="min-h-screen bg-muted/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <WisataForm
            location={editingLocation || undefined}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
            isAdmin={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Panel - Kelola Tempat Wisata</h1>
          <p className="text-muted-foreground">Kelola tempat wisata dan review pengajuan dari wisatawan</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleAddNew} className="bg-bali-gradient hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Tempat Wisata
          </Button>
        </div>
      </div>

      <Tabs defaultValue="locations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="locations">Daftar Tempat Wisata</TabsTrigger>
          <TabsTrigger value="pending" className="relative">
            Pengajuan Baru
            {pendingLocations.length > 0 && (
              <Badge className="ml-2 bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full">
                {pendingLocations.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Daftar Tempat Wisata */}
        <TabsContent value="locations" className="space-y-6">
          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Cari berdasarkan nama atau kategori..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card>
            <CardHeader>
              <CardTitle>Daftar Tempat Wisata ({filteredLocations.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="text-muted-foreground">Memuat data...</div>
                </div>
              ) : filteredLocations.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground text-4xl mb-4">📍</div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Belum ada tempat wisata
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Tambahkan tempat wisata baru untuk memulai
                  </p>
                  <Button onClick={handleAddNew} className="bg-bali-gradient hover:opacity-90">
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Tempat Wisata
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Foto</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Alamat</TableHead>
                        <TableHead>Harga</TableHead>
                        <TableHead>MABAC Score</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLocations.map((location) => (
                        <TableRow key={location.id}>
                          <TableCell>
                            <img
                              src={location.mainImage}
                              alt={location.name}
                              className="w-16 h-12 object-cover rounded"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{location.name}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{location.category}</Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{location.address}</TableCell>
                          <TableCell>{formatPrice(location.ticketPrice)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <span>{location.mabacScore?.toFixed(3) || 'N/A'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(location)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(location.id)}
                                disabled={isDeleting === location.id}
                                className="text-destructive hover:text-destructive"
                              >
                                {isDeleting === location.id ? (
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pengajuan Baru */}
        <TabsContent value="pending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Pengajuan Tempat Wisata Baru ({pendingLocations.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingLocations.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground text-4xl mb-4">📝</div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Tidak ada pengajuan baru
                  </h3>
                  <p className="text-muted-foreground">
                    Pengajuan tempat wisata dari wisatawan akan muncul di sini
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingLocations.map((location) => (
                    <Card key={location.id} className="border-l-4 border-l-yellow-400">
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                          <div className="lg:col-span-1">
                            <img
                              src={location.mainImage}
                              alt={location.name}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          </div>
                          <div className="lg:col-span-2 space-y-2">
                            <h3 className="text-lg font-semibold">{location.name}</h3>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary">{location.category}</Badge>
                              <span className="text-sm text-muted-foreground">
                                Diajukan: {new Date(location.createdAt).toLocaleDateString('id-ID')}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{location.shortDescription}</p>
                            <p className="text-sm text-muted-foreground">📍 {location.address}</p>
                            <p className="text-sm text-foreground">💰 {formatPrice(location.ticketPrice)}</p>
                          </div>
                          <div className="lg:col-span-1 flex flex-col space-y-2">
                            <Button
                              onClick={() => handleApprove(location.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Setujui
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="border-destructive text-destructive hover:bg-destructive/10"
                                  onClick={() => setRejectingLocationId(location.id)}
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Tolak
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Tolak Pengajuan</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <p className="text-sm text-muted-foreground">
                                    Berikan alasan penolakan untuk "{location.name}"
                                  </p>
                                  <Textarea
                                    placeholder="Masukkan alasan penolakan..."
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    rows={3}
                                  />
                                  <div className="flex justify-end space-x-2">
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setRejectingLocationId(null);
                                        setRejectionReason('');
                                      }}
                                    >
                                      Batal
                                    </Button>
                                    <Button
                                      onClick={() => handleReject(location.id)}
                                      disabled={!rejectionReason.trim()}
                                      className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                    >
                                      Tolak Pengajuan
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(location)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Detail
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;