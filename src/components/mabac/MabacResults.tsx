
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { WisataLocation } from '@/types';

interface MabacResultsProps {
  results: { location: WisataLocation; score: number }[];
}

const MabacResults: React.FC<MabacResultsProps> = ({ results }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hasil Akhir Perangkingan Destinasi Wisata</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Destinasi</TableHead>
                <TableHead>Nilai Preferensi</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Status Rekomendasi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result, index) => (
                <TableRow key={result.location.id}>
                  <TableCell>
                    <Badge variant={index < 3 ? 'default' : 'secondary'}>
                      #{index + 1}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{result.location.name}</TableCell>
                  <TableCell>{result.score.toFixed(3)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{result.location.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={index < 3 ? 'default' : 'secondary'}
                      className={index < 3 ? 'bg-green-500' : ''}
                    >
                      {index < 3 ? 'Sangat Direkomendasikan' : 'Direkomendasikan'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MabacResults;
