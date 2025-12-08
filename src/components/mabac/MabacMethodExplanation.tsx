
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

const MabacMethodExplanation: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Tentang Metode MABAC
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">
          Metode MABAC adalah salah satu metode pengambilan keputusan multi-kriteria yang digunakan 
          untuk menentukan ranking destinasi wisata berdasarkan berbagai kriteria penilaian.
        </p>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Tahapan Perhitungan MABAC:</h4>
          <ol className="space-y-1 text-sm list-decimal list-inside">
            <li>Membentuk Matriks Keputusan Awal</li>
            <li>Normalisasi Matriks Keputusan</li>
            <li>Menghitung Matriks Tertimbang</li>
            <li>Menentukan Matriks Area Perbatasan</li>
            <li>Matriks Jarak Alternatif dari Batas</li>
            <li>Nilai Preferensi dan Perangkingan</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default MabacMethodExplanation;
