-- Create agent_conversations table
CREATE TABLE IF NOT EXISTS public.agent_conversations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  description TEXT,
  agent_type VARCHAR(50) NOT NULL DEFAULT 'general',
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  is_archived BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE
);

-- Create agent_messages table
CREATE TABLE IF NOT EXISTS public.agent_messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER NOT NULL REFERENCES public.agent_conversations(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES public.users(id) ON DELETE SET NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  message_type VARCHAR(50) NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'action', 'tool_call', 'tool_result')),
  status VARCHAR(50) NOT NULL DEFAULT 'completed',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create agent_actions table
CREATE TABLE IF NOT EXISTS public.agent_actions (
  id SERIAL PRIMARY KEY,
  message_id INTEGER NOT NULL REFERENCES public.agent_messages(id) ON DELETE CASCADE,
  conversation_id INTEGER NOT NULL REFERENCES public.agent_conversations(id) ON DELETE CASCADE,
  action_type VARCHAR(50) NOT NULL,
  tool_name VARCHAR(100) NOT NULL,
  input_params JSONB,
  output_result JSONB,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  execution_time_ms INTEGER,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create agent_sessions table for session management
CREATE TABLE IF NOT EXISTS public.agent_sessions (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER NOT NULL REFERENCES public.agent_conversations(id) ON DELETE CASCADE,
  session_key VARCHAR(255) NOT NULL UNIQUE,
  context JSONB,
  state JSONB DEFAULT '{}',
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create agent_analytics table
CREATE TABLE IF NOT EXISTS public.agent_analytics (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER REFERENCES public.agent_conversations(id) ON DELETE SET NULL,
  user_id INTEGER REFERENCES public.users(id) ON DELETE CASCADE,
  agent_type VARCHAR(50) NOT NULL,
  total_messages INTEGER,
  total_actions INTEGER,
  total_tokens_used INTEGER,
  average_response_time_ms NUMERIC,
  success_rate NUMERIC,
  error_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_agent_conversations_user_id ON public.agent_conversations(user_id);
CREATE INDEX idx_agent_conversations_status ON public.agent_conversations(status);
CREATE INDEX idx_agent_conversations_created_at ON public.agent_conversations(created_at);
CREATE INDEX idx_agent_messages_conversation_id ON public.agent_messages(conversation_id);
CREATE INDEX idx_agent_messages_role ON public.agent_messages(role);
CREATE INDEX idx_agent_actions_message_id ON public.agent_actions(message_id);
CREATE INDEX idx_agent_actions_conversation_id ON public.agent_actions(conversation_id);
CREATE INDEX idx_agent_actions_status ON public.agent_actions(status);
CREATE INDEX idx_agent_sessions_conversation_id ON public.agent_sessions(conversation_id);
CREATE INDEX idx_agent_sessions_session_key ON public.agent_sessions(session_key);
CREATE INDEX idx_agent_analytics_user_id ON public.agent_analytics(user_id);
CREATE INDEX idx_agent_analytics_date ON public.agent_analytics(date);

-- Create audit trigger for agent_conversations
CREATE OR REPLACE FUNCTION update_agent_conversations_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER agent_conversations_update_timestamp
BEFORE UPDATE ON public.agent_conversations
FOR EACH ROW
EXECUTE FUNCTION update_agent_conversations_timestamp();

-- Create audit trigger for agent_messages
CREATE OR REPLACE FUNCTION update_agent_messages_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER agent_messages_update_timestamp
BEFORE UPDATE ON public.agent_messages
FOR EACH ROW
EXECUTE FUNCTION update_agent_messages_timestamp();

-- Create audit trigger for agent_sessions
CREATE OR REPLACE FUNCTION update_agent_sessions_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER agent_sessions_update_timestamp
BEFORE UPDATE ON public.agent_sessions
FOR EACH ROW
EXECUTE FUNCTION update_agent_sessions_timestamp();
