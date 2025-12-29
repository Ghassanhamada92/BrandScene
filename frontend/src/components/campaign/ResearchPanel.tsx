'use client';

import { motion } from 'framer-motion';
import { Search, TrendingUp, Users, Target, Lightbulb, CheckCircle2, Loader2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { ResearchData } from '@brandscene/shared';

interface ResearchPanelProps {
  research: ResearchData | null;
  isLoading: boolean;
  onConduct: () => Promise<void>;
  onContinue: () => void;
}

export function ResearchPanel({ research, isLoading, onConduct, onContinue }: ResearchPanelProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Market Research</h2>
              <p className="text-sm text-gray-400">AI-powered insights for your campaign</p>
            </div>
          </div>
          
          {research && (
            <Badge variant="success" className="px-3 py-1">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Completed
            </Badge>
          )}
        </div>

        {!research && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Ready to Research</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Let AI analyze market trends, audience insights, and competitive landscape to optimize your campaign
            </p>
            <Button onClick={onConduct} size="lg">
              <Search className="w-4 h-4 mr-2" />
              Start Research
            </Button>
          </motion.div>
        )}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12"
          >
            <div className="flex flex-col items-center">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-blue-500/20" />
                <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
                <Search className="absolute inset-0 m-auto w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Analyzing Market Data</h3>
              <p className="text-gray-400 text-center max-w-md">
                Our AI is conducting comprehensive research on your target audience, trends, and competitors...
              </p>
              <div className="mt-6 space-y-2 w-full max-w-md">
                {loadingSteps.map((step, index) => (
                  <LoadingStep key={index} {...step} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </GlassCard>

      {/* Research Results */}
      {research && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <ResearchSection
            icon={Users}
            title="Audience Insights"
            items={(research.results as any).insights}
            color="from-purple-500 to-pink-500"
          />
          <ResearchSection
            icon={TrendingUp}
            title="Market Trends"
            items={(research.results as any).trends}
            color="from-blue-500 to-cyan-500"
          />
          <ResearchSection
            icon={Target}
            title="Competitor Analysis"
            items={(research.results as any).competitorAnalysis}
            color="from-orange-500 to-red-500"
          />
          <ResearchSection
            icon={Lightbulb}
            title="Recommendations"
            items={(research.results as any).recommendations}
            color="from-green-500 to-emerald-500"
          />
        </motion.div>
      )}

      {research && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-end"
        >
          <Button onClick={onContinue} size="lg" className="px-8">
            Generate Scripts
          </Button>
        </motion.div>
      )}
    </div>
  );
}

function ResearchSection({
  icon: Icon,
  title,
  items,
  color,
}: {
  icon: any;
  title: string;
  items: string[];
  color: string;
}) {
  return (
    <GlassCard className="p-6" hover={false}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <ul className="space-y-3" role="list">
        {items?.map((item, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-2 text-gray-300 text-sm"
          >
            <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <span>{item}</span>
          </motion.li>
        ))}
      </ul>
    </GlassCard>
  );
}

const loadingSteps = [
  { label: 'Analyzing target audience', delay: 0 },
  { label: 'Identifying market trends', delay: 0.2 },
  { label: 'Evaluating competitors', delay: 0.4 },
  { label: 'Generating recommendations', delay: 0.6 },
];

function LoadingStep({ label, delay }: { label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-center gap-3 text-gray-400 text-sm"
    >
      <Loader2 className="w-4 h-4 animate-spin text-blue-400" aria-hidden="true" />
      <span>{label}</span>
    </motion.div>
  );
}
