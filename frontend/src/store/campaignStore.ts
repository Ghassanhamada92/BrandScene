import { create } from 'zustand';
import type { Campaign, ResearchData, Script } from '@brandscene/shared';

interface CampaignState {
  // Data
  campaign: Campaign | null;
  research: ResearchData | null;
  scripts: Script[];
  
  // UI State
  currentStep: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCampaign: (campaign: Campaign) => void;
  setResearch: (research: ResearchData) => void;
  setScripts: (scripts: Script[]) => void;
  setCurrentStep: (step: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  campaign: null,
  research: null,
  scripts: [],
  currentStep: 1,
  isLoading: false,
  error: null,
};

export const useCampaignStore = create<CampaignState>((set) => ({
  ...initialState,
  
  setCampaign: (campaign) => set({ campaign }),
  setResearch: (research) => set({ research }),
  setScripts: (scripts) => set({ scripts }),
  setCurrentStep: (currentStep) => set({ currentStep }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));
