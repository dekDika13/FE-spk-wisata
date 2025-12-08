
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronRight } from 'lucide-react';

interface MabacStep {
  id: number;
  title: string;
  description: string;
  matrix?: number[][];
  headers?: string[];
  alternativeNames?: string[];
  completed: boolean;
}

interface MabacStepDisplayProps {
  steps: MabacStep[];
}

const MabacStepDisplay: React.FC<MabacStepDisplayProps> = ({ steps }) => {
  const formatMatrixValue = (value: number) => {
    return value.toFixed(4);
  };

  return (
    <>
      {steps.map((step) => (
        <Card key={step.id}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Badge className="mr-3">
                Tahap {step.id}
              </Badge>
              <span>{step.title}</span>
              {step.completed && <ChevronRight className="w-4 h-4 ml-2 text-green-500" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{step.description}</p>
            
            {step.matrix && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Alternatif</TableHead>
                      {step.headers?.map((header, i) => (
                        <TableHead key={i}>{header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {step.matrix.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        <TableCell className="font-medium">
                          {step.alternativeNames?.[rowIndex] || `A${rowIndex + 1}`}
                        </TableCell>
                        {row.map((cell, cellIndex) => (
                          <TableCell key={cellIndex}>
                            {formatMatrixValue(cell)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default MabacStepDisplay;
