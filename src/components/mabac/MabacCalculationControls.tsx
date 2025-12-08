
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

interface MabacCalculationControlsProps {
  onCalculate: () => void;
  onReset: () => void;
  isCalculating: boolean;
  currentStep: number;
  hasResults: boolean;
  hasSteps: boolean;
  locationsCount: number;
}

const MabacCalculationControls: React.FC<MabacCalculationControlsProps> = ({
  onCalculate,
  onReset,
  isCalculating,
  currentStep,
  hasResults,
  hasSteps,
  locationsCount
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Perhitungan MABAC</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4">
          <Button 
            onClick={onCalculate} 
            disabled={isCalculating || locationsCount === 0}
            className="bg-bali-gradient hover:opacity-90"
          >
            <Play className="w-4 h-4 mr-2" />
            {isCalculating ? 'Menghitung...' : 'Mulai Perhitungan MABAC'}
          </Button>
          {(hasResults || hasSteps) && (
            <Button variant="outline" onClick={onReset}>
              Reset Hasil
            </Button>
          )}
        </div>
        
        {isCalculating && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-blue-600">
                Sedang memproses tahap {currentStep}/6...
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MabacCalculationControls;
