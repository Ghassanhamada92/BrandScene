'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useCampaignStore } from '@/store/campaignStore';
import { StageProgress } from '@/components/campaign/StageProgress';
import { BrandInfoForm } from '@/components/campaign/BrandInfoForm';
import { ResearchPanel } from '@/components/campaign/ResearchPanel';
import { ScriptVariants } from '@/components/campaign/ScriptVariants';
import { Button } from '@/components/ui/Button';
import type { CreateCampaignInput } from '@brandscene/shared';

export default function CreateCampaignPage() {
  const router = useRouter();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [campaignId, setCampaignId] = useState<string | null>(null);
  
  const {
    campaign,
    research,
    scripts,
    currentStep,
    isLoading,
    setCampaign,
    setResearch,
    setScripts,
    setCurrentStep,
    setLoading,
    setError,
  } = useCampaignStore();

  const handleBrandInfoSubmit = async (data: CreateCampaignInput) => {
    try {
      setLoading(true);
      setError(null);

      // Create project first
      const project = await api.createProject({
        name: `${data.brandName} - ${data.productName}`,
        description: data.productDescription,
      });
      setProjectId(project.id);

      // Create campaign
      const newCampaign = await api.createCampaign(project.id, data);
      setCampaign(newCampaign);
      setCampaignId(newCampaign.id);
      setCurrentStep(2);

      toast.success('Brand information saved successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save brand information';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleConductResearch = async () => {
    if (!campaignId) return;

    try {
      setLoading(true);
      setError(null);

      const researchData = await api.conductResearch(campaignId);
      setResearch(researchData);

      toast.success('Research completed successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to conduct research';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateScripts = async () => {
    if (!campaignId) return;

    try {
      setLoading(true);
      setError(null);

      const generatedScripts = await api.generateScripts(campaignId, { variantCount: 3 });
      setScripts(generatedScripts);
      setCurrentStep(3);

      toast.success('Scripts generated successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate scripts';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveScript = async (scriptId: string) => {
    try {
      setLoading(true);
      setError(null);

      await api.approveScript(scriptId);
      
      toast.success('Script approved! Moving to scene composition...');
      
      // Redirect to next stage after a delay
      setTimeout(() => {
        router.push(`/projects/${projectId}`);
      }, 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to approve script';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/">
            <Button
              variant="ghost"
              className="mb-4 text-white hover:bg-white/10"
              aria-label="Go back to home"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Create Your Campaign
            </h1>
            <p className="text-gray-400 text-lg">
              Let AI help you create stunning video content
            </p>
          </div>

          <StageProgress currentStage={currentStep} />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {currentStep === 1 && (
            <BrandInfoForm onSubmit={handleBrandInfoSubmit} isLoading={isLoading} />
          )}

          {currentStep === 2 && (
            <ResearchPanel
              research={research}
              isLoading={isLoading}
              onConduct={handleConductResearch}
              onContinue={() => setCurrentStep(3)}
            />
          )}

          {currentStep === 3 && (
            <ScriptVariants
              scripts={scripts}
              isLoading={isLoading}
              onGenerate={handleGenerateScripts}
              onApprove={handleApproveScript}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
