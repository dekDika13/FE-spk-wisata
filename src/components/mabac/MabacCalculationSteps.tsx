import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MabacApiResponse } from '@/services/mabacApi';
import { Calculator, TrendingUp, Target, Scale, MapPin } from 'lucide-react';

interface MabacCalculationStepsProps {
  mabacData: MabacApiResponse['data'];
}

const MabacCalculationSteps: React.FC<MabacCalculationStepsProps> = ({ mabacData }) => {
  const formatNumber = (num: number): string => {
    return Number(num).toFixed(3);
  };

  const renderMatrixTable = (matrix: number[][], headers: string[], rowLabels: string[], title: string) => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alternatif</TableHead>
                {headers.map((header, index) => (
                  <TableHead key={index} className="text-center min-w-20">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {matrix.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell className="font-medium">{rowLabels[rowIndex]}</TableCell>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex} className="text-center font-mono text-sm">
                      {formatNumber(cell)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  const criteriaHeaders = mabacData.criteria.map(c => c.code);
  const alternativeNames = mabacData.initial_matrix.map(item => item.name);

  return (
    <div className="space-y-6">
      {/* Step 1: Kriteria dan Bobot */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Scale className="w-5 h-5 mr-2" />
            Langkah 1: Kriteria dan Bobot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mabacData.criteria.map((criteria, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{criteria.code}</h4>
                  <Badge variant={criteria.type === 'benefit' ? 'default' : 'secondary'}>
                    {criteria.type === 'benefit' ? 'Benefit' : 'Cost'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{criteria.name}</p>
                <div className="text-lg font-bold text-blue-600">
                  Bobot: {criteria.weight}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Matriks Awal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Langkah 2: Matriks Keputusan Awal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Matriks yang berisi nilai kriteria untuk setiap alternatif destinasi wisata.
          </p>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Destinasi</TableHead>
                  {mabacData.criteria.map((criteria, index) => (
                    <TableHead key={index} className="text-center min-w-24">
                      <div>
                        <div className="font-semibold">{criteria.code}</div>
                        <div className="text-xs text-gray-500">{criteria.name}</div>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {mabacData.initial_matrix.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    {item.values.map((value, valueIndex) => (
                      <TableCell key={valueIndex} className="text-center font-mono">
                          {value.toLocaleString('id-ID')}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Step 3: Matriks Normalisasi */}
      {renderMatrixTable(
        mabacData.normalized_matrix,
        criteriaHeaders,
        alternativeNames,
        'Langkah 3: Matriks Normalisasi'
      )}
      <div className="text-sm text-gray-600 px-4">
        <p><strong>Penjelasan:</strong> Matriks dinormalisasi menggunakan rumus MABAC untuk mengubah nilai kriteria ke skala 0-1.</p>
      </div>

      {/* Step 4: Matriks Berbobot */}
      {renderMatrixTable(
        mabacData.weighted_matrix,
        criteriaHeaders,
        alternativeNames,
        'Langkah 4: Matriks Berbobot'
      )}
      <div className="text-sm text-gray-600 px-4">
        <p><strong>Penjelasan:</strong> Matriks normalisasi dikalikan dengan bobot masing-masing kriteria.</p>
      </div>

      {/* Step 5: Border Area Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Langkah 5: Border Area Matrix (BAM)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Nilai rata-rata geometris dari setiap kriteria dalam matriks berbobot.
          </p>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kriteria</TableHead>
                  <TableHead className="text-center">Border Area Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mabacData.border_area_matrix.map((value, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {mabacData.criteria[index].code} - {mabacData.criteria[index].name}
                    </TableCell>
                    <TableCell className="text-center font-mono">
                      {formatNumber(value)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Step 6: Distance Matrix */}
      {renderMatrixTable(
        mabacData.distance_matrix,
        criteriaHeaders,
        alternativeNames,
        'Langkah 6: Matriks Jarak dari Border Area'
      )}
      <div className="text-sm text-gray-600 px-4">
        <p><strong>Penjelasan:</strong> Selisih antara matriks berbobot dengan nilai border area untuk setiap kriteria.</p>
      </div>

      {/* Step 7: Final Ranking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Langkah 7: Hasil Akhir Ranking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Skor akhir dihitung dari jumlah nilai dalam matriks jarak untuk setiap alternatif.
          </p>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Rank</TableHead>
                  <TableHead>Destinasi</TableHead>
                  <TableHead className="text-center">Skor MABAC</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mabacData.final_ranking.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-center">
                      <Badge variant={index === 0 ? 'default' : 'secondary'}>
                        #{item.rank}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-center font-mono text-lg">
                      {formatNumber(item.score)}
                    </TableCell>
                    <TableCell className="text-center">
                      {index === 0 && (
                        <Badge className="bg-green-100 text-green-800">
                          🏆 Terbaik
                        </Badge>
                      )}
                      {index === 1 && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          🥈 Kedua
                        </Badge>
                      )}
                      {index === 2 && (
                        <Badge className="bg-orange-100 text-orange-800">
                          🥉 Ketiga
                        </Badge>
                      )}
                      {index > 2 && (
                        <Badge variant="outline">
                          Rekomendasi
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <Calculator className="w-5 h-5 mr-2" />
            Ringkasan Perhitungan MABAC
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-blue-700">
            <p className="mb-2">
              <strong>Metode MABAC</strong> (Multi-Attributive Border Approximation Area Comparison)
              menghitung ranking berdasarkan jarak setiap alternatif dari border area.
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Semakin tinggi skor MABAC, semakin baik alternatif tersebut</li>
              <li>Border area merepresentasikan nilai rata-rata dari semua alternatif</li>
              <li>Alternatif di atas border area mendapat skor positif</li>
              <li>Alternatif di bawah border area mendapat skor negatif</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MabacCalculationSteps;