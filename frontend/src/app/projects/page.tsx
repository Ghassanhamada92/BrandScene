'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Film, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import type { Project } from '@brandscene/shared';
import toast from 'react-hot-toast';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setIsLoading(false);
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

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Your Projects</h1>
              <p className="text-gray-400">Manage your video campaigns</p>
            </div>
            <Link href="/create">
              <Button size="lg">
                <Plus className="w-5 h-5 mr-2" />
                New Project
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <GlassCard key={i} className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-white/10 rounded w-3/4" />
                  <div className="h-4 bg-white/10 rounded w-full" />
                  <div className="h-4 bg-white/10 rounded w-2/3" />
                </div>
              </GlassCard>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <GlassCard className="p-12 max-w-md mx-auto">
              <Film className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-white mb-2">No Projects Yet</h2>
              <p className="text-gray-400 mb-6">
                Create your first video campaign to get started
              </p>
              <Link href="/create">
                <Button size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Project
                </Button>
              </Link>
            </GlassCard>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/projects/${project.id}`}>
        <GlassCard className="p-6 cursor-pointer h-full">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Film className="w-6 h-6 text-white" />
            </div>
            <Badge variant={project.status === 'active' ? 'success' : 'secondary'}>
              {project.status}
            </Badge>
          </div>

          <h3 className="text-xl font-semibold text-white mb-2">{project.name}</h3>
          {project.description && (
            <p className="text-sm text-gray-400 mb-4 line-clamp-2">{project.description}</p>
          )}

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="w-3 h-3" aria-hidden="true" />
            <span>{formatDate(project.createdAt)}</span>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
}
