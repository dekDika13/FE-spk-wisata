
import { WisataLocation } from '@/types';

export interface MabacCriteria {
  name: string;
  weight: number;
  type: 'benefit' | 'cost';
}

export interface MabacStep {
  id: number;
  title: string;
  description: string;
  matrix?: number[][];
  headers?: string[];
  alternativeNames?: string[];
  completed: boolean;
}

export const DEFAULT_CRITERIA: MabacCriteria[] = [
  { name: 'Rating', weight: 0.25, type: 'benefit' },
  { name: 'Reviews', weight: 0.20, type: 'benefit' },
  { name: 'Harga', weight: 0.15, type: 'cost' },
  { name: 'Fasilitas', weight: 0.20, type: 'benefit' },
  { name: 'Aksesibilitas', weight: 0.20, type: 'benefit' }
];

export const createRawDataMatrix = (locations: WisataLocation[]): number[][] => {
  return locations.map(location => [
    location.averageRating || 0,
    location.totalReviews || 0,
    location.ticketPrice,
    location.facilities.length,
    Math.random() * 5 // Simulasi aksesibilitas
  ]);
};

export const normalizeMatrix = (rawData: number[][], criteria: MabacCriteria[]): number[][] => {
  return rawData.map(row => 
    row.map((value, colIndex) => {
      const column = rawData.map(r => r[colIndex]);
      const max = Math.max(...column);
      const min = Math.min(...column);
      
      if (criteria[colIndex].type === 'benefit') {
        return max === min ? 1 : (value - min) / (max - min);
      } else {
        return max === min ? 1 : (max - value) / (max - min);
      }
    })
  );
};

export const calculateWeightedMatrix = (normalizedMatrix: number[][], criteria: MabacCriteria[]): number[][] => {
  return normalizedMatrix.map(row =>
    row.map((value, colIndex) => value * criteria[colIndex].weight)
  );
};

export const calculateBorderMatrix = (weightedMatrix: number[][], criteria: MabacCriteria[]): number[] => {
  return criteria.map(criterion => {
    const weights = weightedMatrix.map(row => row[criteria.indexOf(criterion)]);
    return weights.reduce((a, b) => a * b, 1) ** (1 / weights.length);
  });
};

export const calculateDistanceMatrix = (weightedMatrix: number[][], borderMatrix: number[]): number[][] => {
  return weightedMatrix.map(row =>
    row.map((value, colIndex) => value - borderMatrix[colIndex])
  );
};

export const calculatePreferenceScores = (distanceMatrix: number[][]): number[] => {
  return distanceMatrix.map(row =>
    row.reduce((sum, value) => sum + value, 0)
  );
};

export const createMabacStep = (
  id: number,
  title: string,
  description: string,
  matrix: number[][] | number[],
  headers: string[],
  alternativeNames: string[]
): MabacStep => {
  return {
    id,
    title,
    description,
    matrix: Array.isArray(matrix[0]) ? matrix as number[][] : [matrix as number[]],
    headers,
    alternativeNames,
    completed: true
  };
};
