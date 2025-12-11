const MABAC_API_URL = 'https://wahyu.agencyta.biz.id/v1';

export interface MabacCriteria {
  name: string;
  code: string;
  weight: number;
  type: 'benefit' | 'cost';
}

export interface MabacInitialMatrix {
  id: number;
  name: string;
  values: number[];
}

export interface MabacRanking {
  id: number;
  name: string;
  score: number;
  rank: number;
}

export interface MabacApiResponse {
  message: string;
  code: number;
  data: {
    criteria: MabacCriteria[];
    initial_matrix: MabacInitialMatrix[];
    normalized_matrix: number[][];
    weighted_matrix: number[][];
    border_area_matrix: number[];
    distance_matrix: number[][];
    final_ranking: MabacRanking[];
  };
}

export const mabacAPI = {
  calculateRanking: async (): Promise<MabacApiResponse> => {
    const token = localStorage.getItem('auth_token');

    const response = await fetch(`${MABAC_API_URL}/mabac/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to calculate MABAC ranking');
    }

    return response.json();
  }
};