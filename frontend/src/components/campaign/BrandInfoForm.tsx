'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Building2, Package, Users, Lightbulb, MessageSquare } from 'lucide-react';
import { createCampaignSchema, CreateCampaignInput } from '@brandscene/shared';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { GlassCard } from '@/components/ui/GlassCard';

interface BrandInfoFormProps {
  onSubmit: (data: CreateCampaignInput) => Promise<void>;
  isLoading?: boolean;
}

export function BrandInfoForm({ onSubmit, isLoading }: BrandInfoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCampaignInput>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: {
      videoLength: 30,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <GlassCard className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Brand Information</h2>
            <p className="text-sm text-gray-400">Tell us about your brand and product</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Brand Name */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-purple-400" />
              <label htmlFor="brandName" className="text-sm font-medium text-white">
                Brand Name <span className="text-red-400" aria-label="required">*</span>
              </label>
            </div>
            <Input
              id="brandName"
              {...register('brandName')}
              placeholder="e.g., TechFlow Solutions"
              error={errors.brandName?.message}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              aria-required="true"
              aria-invalid={!!errors.brandName}
              aria-describedby={errors.brandName ? 'brandName-error' : undefined}
            />
          </motion.div>

          {/* Product Name */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-pink-400" />
              <label htmlFor="productName" className="text-sm font-medium text-white">
                Product Name <span className="text-red-400" aria-label="required">*</span>
              </label>
            </div>
            <Input
              id="productName"
              {...register('productName')}
              placeholder="e.g., FlowBoard Pro"
              error={errors.productName?.message}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              aria-required="true"
              aria-invalid={!!errors.productName}
            />
          </motion.div>

          {/* Product Description */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <label htmlFor="productDescription" className="text-sm font-medium text-white">
                Product Description <span className="text-red-400" aria-label="required">*</span>
              </label>
            </div>
            <Textarea
              id="productDescription"
              {...register('productDescription')}
              placeholder="Describe your product, its features, and what makes it unique..."
              rows={4}
              error={errors.productDescription?.message}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              aria-required="true"
              aria-invalid={!!errors.productDescription}
            />
          </motion.div>

          {/* Target Audience */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-green-400" />
              <label htmlFor="targetAudience" className="text-sm font-medium text-white">
                Target Audience <span className="text-red-400" aria-label="required">*</span>
              </label>
            </div>
            <Textarea
              id="targetAudience"
              {...register('targetAudience')}
              placeholder="Describe your ideal customer: demographics, interests, pain points..."
              rows={3}
              error={errors.targetAudience?.message}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              aria-required="true"
              aria-invalid={!!errors.targetAudience}
            />
          </motion.div>

          {/* Optional Fields */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6 pt-4 border-t border-white/10"
          >
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              Optional Details
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Brand Voice */}
              <div>
                <label htmlFor="brandVoice" className="text-sm font-medium text-white mb-2 block">
                  Brand Voice
                </label>
                <Input
                  id="brandVoice"
                  {...register('brandVoice')}
                  placeholder="e.g., Professional, Friendly"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>

              {/* Tone */}
              <div>
                <label htmlFor="tone" className="text-sm font-medium text-white mb-2 block">
                  Tone
                </label>
                <Input
                  id="tone"
                  {...register('tone')}
                  placeholder="e.g., Inspirational, Upbeat"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Additional Context */}
            <div>
              <label htmlFor="additionalContext" className="text-sm font-medium text-white mb-2 block">
                Additional Context
              </label>
              <Textarea
                id="additionalContext"
                {...register('additionalContext')}
                placeholder="Any specific requirements, themes, or messages to include..."
                rows={3}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex justify-end"
        >
          <Button
            type="submit"
            size="lg"
            isLoading={isLoading}
            disabled={isLoading}
            className="px-8"
            aria-label="Continue to research phase"
          >
            {isLoading ? 'Processing...' : 'Continue to Research'}
          </Button>
        </motion.div>
      </GlassCard>
    </form>
  );
}
