-- BrandScene AI Platform Database Schema
-- PostgreSQL 15+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  current_stage INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Brand Information table
CREATE TABLE brand_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  brand_name VARCHAR(255) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_description TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  key_benefits JSONB,
  brand_voice VARCHAR(100),
  tone VARCHAR(100),
  additional_context TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Research Data table (Stage 1)
CREATE TABLE research_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  research_type VARCHAR(100) NOT NULL,
  query TEXT NOT NULL,
  results JSONB NOT NULL,
  sources JSONB,
  confidence_score DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scripts table (Stage 1)
CREATE TABLE scripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  variant_number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  duration_seconds INTEGER,
  tone VARCHAR(100),
  style VARCHAR(100),
  metadata JSONB,
  status VARCHAR(50) DEFAULT 'pending',
  approved BOOLEAN DEFAULT FALSE,
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scenes table (Stage 2)
CREATE TABLE scenes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  script_id UUID NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,
  scene_number INTEGER NOT NULL,
  narration_text TEXT NOT NULL,
  visual_description TEXT NOT NULL,
  duration_seconds DECIMAL(5,2) NOT NULL,
  mood VARCHAR(100),
  camera_angle VARCHAR(100),
  transition_type VARCHAR(100),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Image Variations table (Stage 2)
CREATE TABLE image_variations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scene_id UUID NOT NULL REFERENCES scenes(id) ON DELETE CASCADE,
  variation_number INTEGER NOT NULL,
  prompt TEXT NOT NULL,
  image_url TEXT,
  generation_params JSONB,
  selected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Video Clips table (Stage 3)
CREATE TABLE video_clips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scene_id UUID NOT NULL REFERENCES scenes(id) ON DELETE CASCADE,
  source_type VARCHAR(50) NOT NULL,
  source_url TEXT NOT NULL,
  duration_seconds DECIMAL(5,2) NOT NULL,
  resolution VARCHAR(20),
  file_size_mb DECIMAL(10,2),
  thumbnail_url TEXT,
  metadata JSONB,
  processing_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audio Tracks table (Stage 3)
CREATE TABLE audio_tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  script_id UUID NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,
  track_type VARCHAR(50) NOT NULL,
  audio_url TEXT NOT NULL,
  duration_seconds DECIMAL(5,2) NOT NULL,
  voice_id VARCHAR(100),
  file_size_mb DECIMAL(10,2),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Final Videos table (Stage 4)
CREATE TABLE final_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  script_id UUID NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds DECIMAL(5,2) NOT NULL,
  resolution VARCHAR(20),
  file_size_mb DECIMAL(10,2),
  render_settings JSONB,
  status VARCHAR(50) DEFAULT 'rendering',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

-- Transitions table (Stage 4)
CREATE TABLE transitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  final_video_id UUID NOT NULL REFERENCES final_videos(id) ON DELETE CASCADE,
  from_scene_id UUID NOT NULL REFERENCES scenes(id),
  to_scene_id UUID NOT NULL REFERENCES scenes(id),
  transition_type VARCHAR(100) NOT NULL,
  duration_seconds DECIMAL(3,2) NOT NULL,
  parameters JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity Log table
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  details JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_brand_info_project_id ON brand_info(project_id);
CREATE INDEX idx_research_data_project_id ON research_data(project_id);
CREATE INDEX idx_scripts_project_id ON scripts(project_id);
CREATE INDEX idx_scripts_status ON scripts(status);
CREATE INDEX idx_scenes_script_id ON scenes(script_id);
CREATE INDEX idx_image_variations_scene_id ON image_variations(scene_id);
CREATE INDEX idx_video_clips_scene_id ON video_clips(scene_id);
CREATE INDEX idx_audio_tracks_script_id ON audio_tracks(script_id);
CREATE INDEX idx_final_videos_project_id ON final_videos(project_id);
CREATE INDEX idx_activity_log_project_id ON activity_log(project_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_brand_info_updated_at BEFORE UPDATE ON brand_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scripts_updated_at BEFORE UPDATE ON scripts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scenes_updated_at BEFORE UPDATE ON scenes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_video_clips_updated_at BEFORE UPDATE ON video_clips FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
