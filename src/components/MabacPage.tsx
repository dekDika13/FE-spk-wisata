
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, ArrowLeft } from 'lucide-react';
import { useApiDestinations } from '@/hooks/useApiDestinations';
import { WisataLocation } from '@/types';
import MabacMethodExplanation from './mabac/MabacMethodExplanation';
import MabacCriteriaTable from './mabac/MabacCriteriaTable';
import MabacCalculationControls from './mabac/MabacCalculationControls';
import MabacResults from './mabac/MabacResults';
import MabacCalculationSteps from './mabac/MabacCalculationSteps';
import { mabacAPI, MabacApiResponse, MabacCriteria } from '@/services/mabacApi';
import { toast } from 'sonner';

interface MabacPageProps {
  onBack: () => void;
}

const MabacPage: React.FC<MabacPageProps> = ({ onBack }) => {
  const { destinations, loadDestinations } = useApiDestinations();
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<{ location: WisataLocation; score: number; rank: number }[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [criteria, setCriteria] = useState<MabacCriteria[]>([]);
  const [mabacData, setMabacData] = useState<MabacApiResponse['data'] | null>(null);

  React.useEffect(() => {
    loadDestinations();
  }, []);

  const calculateMabac = async () => {
    setIsCalculating(true);
    try {
      const response = await mabacAPI.calculateRanking();
      
      const rankedResults = response.data.final_ranking.map(item => {
        const location = destinations.find(dest => dest.id === item.id.toString());
        return {
          location: location || {
            id: item.id.toString(),
            name: item.name,
            slug: '',
            category: '',
            shortDescription: '',
            fullDescription: '',
            address: '',
            latitude: 0,
            longitude: 0,
            mainImage: '',
            gallery: [],
            openingHours: '',
            ticketPrice: 0,
            facilities: [],
            status: 'published' as const,
            createdAt: '',
            averageRating: 0,
            totalReviews: 0
          },
          score: item.score,
          rank: item.rank
        };
      });

      setResults(rankedResults);
      setCriteria(response.data.criteria);
      setMabacData(response.data);
      setShowResults(true);
      toast.success('Perhitungan MABAC berhasil!');
    } catch (error) {
      toast.error('Gagal melakukan perhitungan MABAC');
      console.error('MABAC calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const resetCalculation = () => {
    setResults([]);
    setShowResults(false);
    setCriteria([]);
    setMabacData(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Metode MABAC</h1>
            <p className="text-gray-600">Multi-Attributive Border Approximation Area Comparison</p>
          </div>
        </div>
        <Badge className="bg-bali-gradient text-white">
          <Calculator className="w-4 h-4 mr-2" />
          Sistem Pengambilan Keputusan
        </Badge>
      </div>

      {/* Method Explanation */}
      <MabacMethodExplanation />

      {/* Criteria Table */}
      {criteria.length > 0 && <MabacCriteriaTable criteria={criteria} />}

      {/* Calculation Controls */}
      <MabacCalculationControls
        onCalculate={calculateMabac}
        onReset={resetCalculation}
        isCalculating={isCalculating}
        currentStep={0}
        hasResults={showResults}
        hasSteps={false}
        locationsCount={destinations.length}
      />

      {/* Calculation Steps */}
      {showResults && mabacData && <MabacCalculationSteps mabacData={mabacData} />}

      {/* Final Results Summary */}
      {showResults && (
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Hasil</CardTitle>
          </CardHeader>
          <CardContent>
            <MabacResults results={results} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MabacPage;
