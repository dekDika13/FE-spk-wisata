
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface MabacCriteria {
  name: string;
  code: string;
  weight: number;
  type: 'benefit' | 'cost';
}

interface MabacCriteriaTableProps {
  criteria: MabacCriteria[];
}

const MabacCriteriaTable: React.FC<MabacCriteriaTableProps> = ({ criteria }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Kriteria dan Bobot Penilaian</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kode</TableHead>
              <TableHead>Kriteria</TableHead>
              <TableHead>Bobot</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Deskripsi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {criteria.map((criterion, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{criterion.code}</TableCell>
                <TableCell>{criterion.name}</TableCell>
                <TableCell>{(criterion.weight * 100).toFixed(0)}%</TableCell>
                <TableCell>
                  <Badge variant={criterion.type === 'benefit' ? 'default' : 'secondary'}>
                    {criterion.type === 'benefit' ? 'Benefit' : 'Cost'}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {criterion.type === 'benefit' ? 'Semakin tinggi semakin baik' : 'Semakin rendah semakin baik'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MabacCriteriaTable;
