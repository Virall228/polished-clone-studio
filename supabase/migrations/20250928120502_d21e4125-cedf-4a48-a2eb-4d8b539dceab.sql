-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'moderator', 'player', 'viewer');
CREATE TYPE team_role AS ENUM ('captain', 'player', 'substitute');
CREATE TYPE tournament_format AS ENUM ('single_elimination', 'double_elimination', 'round_robin', 'swiss');
CREATE TYPE tournament_status AS ENUM ('upcoming', 'registration_open', 'ongoing', 'completed', 'cancelled');
CREATE TYPE match_status AS ENUM ('scheduled', 'live', 'completed', 'postponed', 'cancelled');
CREATE TYPE news_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE news_category AS ENUM ('tournament', 'team', 'player', 'game_update', 'announcement', 'general');
CREATE TYPE notification_type AS ENUM ('info', 'success', 'warning', 'error', 'tournament', 'team', 'match');
CREATE TYPE achievement_rarity AS ENUM ('common', 'rare', 'epic', 'legendary');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT NOT NULL UNIQUE,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    telegram_id TEXT,
    role user_role NOT NULL DEFAULT 'player',
    is_online BOOLEAN NOT NULL DEFAULT false,
    last_seen TIMESTAMP WITH TIME ZONE,
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_stats table
CREATE TABLE public.user_stats (
    id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    games_played INTEGER NOT NULL DEFAULT 0,
    wins INTEGER NOT NULL DEFAULT 0,
    losses INTEGER NOT NULL DEFAULT 0,
    win_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    rank TEXT,
    points INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create achievements table
CREATE TABLE public.achievements (
    id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    rarity achievement_rarity NOT NULL DEFAULT 'common',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_achievements table
CREATE TABLE public.user_achievements (
    id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, achievement_id)
);

-- Create games table
CREATE TABLE public.games (
    id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    icon TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create game_modes table
CREATE TABLE public.game_modes (
    id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    team_size INTEGER NOT NULL,
    maps TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create teams table
CREATE TABLE public.teams (
    id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    tag TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    description TEXT,
    captain_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create team_members table
CREATE TABLE public.team_members (
    id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    role team_role NOT NULL DEFAULT 'player',
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    is_active BOOLEAN NOT NULL DEFAULT true,
    UNIQUE(team_id, user_id)
);

-- Create team_stats table
CREATE TABLE public.team_stats (
    id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_id UUID NOT NULL UNIQUE REFERENCES public.teams(id) ON DELETE CASCADE,
    matches_played INTEGER NOT NULL DEFAULT 0,
    wins INTEGER NOT NULL DEFAULT 0,
    losses INTEGER NOT NULL DEFAULT 0,
    draws INTEGER NOT NULL DEFAULT 0,
    win_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    points INTEGER NOT NULL DEFAULT 0,
    ranking INTEGER NOT NULL DEFAULT 0,
    last_match TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tournaments table
CREATE TABLE public.tournaments (
    id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    format tournament_format NOT NULL DEFAULT 'single_elimination',
    status tournament_status NOT NULL DEFAULT 'upcoming',
    prize_pool INTEGER NOT NULL DEFAULT 0,
    max_participants INTEGER NOT NULL DEFAULT 16,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    registration_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    rules TEXT NOT NULL,
    organizer_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tournament_participants table
CREATE TABLE public.tournament_participants (
    id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    is_active BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT participant_type_check CHECK (
        (team_id IS NOT NULL AND user_id IS NULL) OR 
        (team_id IS NULL AND user_id IS NOT NULL)
    )
);

-- Create matches table
CREATE TABLE public.matches (
    id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
    team1_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    team2_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    score1 INTEGER NOT NULL DEFAULT 0,
    score2 INTEGER NOT NULL DEFAULT 0,
    status match_status NOT NULL DEFAULT 'scheduled',
    scheduled_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    map TEXT,
    round INTEGER,
    winner_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create news table
CREATE TABLE public.news (
    id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    cover_image_url TEXT,
    author_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    published_at TIMESTAMP WITH TIME ZONE,
    status news_status NOT NULL DEFAULT 'draft',
    tags TEXT[] DEFAULT '{}',
    category news_category NOT NULL DEFAULT 'general',
    views INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
    id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL DEFAULT 'info',
    is_read BOOLEAN NOT NULL DEFAULT false,
    action_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_modes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- User stats policies
CREATE POLICY "User stats are viewable by everyone" ON public.user_stats
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own stats" ON public.user_stats
    FOR UPDATE USING (auth.uid() = user_id);

-- Achievements policies (read-only for users)
CREATE POLICY "Achievements are viewable by everyone" ON public.achievements
    FOR SELECT USING (true);

-- User achievements policies
CREATE POLICY "User achievements are viewable by everyone" ON public.user_achievements
    FOR SELECT USING (true);

-- Games policies (read-only for users)
CREATE POLICY "Games are viewable by everyone" ON public.games
    FOR SELECT USING (true);

CREATE POLICY "Game modes are viewable by everyone" ON public.game_modes
    FOR SELECT USING (true);

-- Teams policies
CREATE POLICY "Teams are viewable by everyone" ON public.teams
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create teams" ON public.teams
    FOR INSERT WITH CHECK (auth.uid() = captain_id);

CREATE POLICY "Team captains can update their teams" ON public.teams
    FOR UPDATE USING (auth.uid() = captain_id);

-- Team members policies
CREATE POLICY "Team members are viewable by everyone" ON public.team_members
    FOR SELECT USING (true);

CREATE POLICY "Team captains can manage members" ON public.team_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.teams 
            WHERE teams.id = team_members.team_id 
            AND teams.captain_id = auth.uid()
        )
    );

-- Team stats policies
CREATE POLICY "Team stats are viewable by everyone" ON public.team_stats
    FOR SELECT USING (true);

-- Tournaments policies
CREATE POLICY "Tournaments are viewable by everyone" ON public.tournaments
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create tournaments" ON public.tournaments
    FOR INSERT WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Tournament organizers can update their tournaments" ON public.tournaments
    FOR UPDATE USING (auth.uid() = organizer_id);

-- Tournament participants policies
CREATE POLICY "Tournament participants are viewable by everyone" ON public.tournament_participants
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can join tournaments" ON public.tournament_participants
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Matches policies
CREATE POLICY "Matches are viewable by everyone" ON public.matches
    FOR SELECT USING (true);

-- News policies
CREATE POLICY "Published news are viewable by everyone" ON public.news
    FOR SELECT USING (status = 'published');

CREATE POLICY "Authors can manage their news" ON public.news
    FOR ALL USING (auth.uid() = author_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Create functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, username, first_name, last_name, telegram_id)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name',
        NEW.raw_user_meta_data->>'telegram_id'
    );
    
    INSERT INTO public.user_stats (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON public.user_stats
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_stats_updated_at BEFORE UPDATE ON public.team_stats
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tournaments_updated_at BEFORE UPDATE ON public.tournaments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON public.matches
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON public.news
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON public.games
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial data
INSERT INTO public.games (name, short_name, icon) VALUES
    ('Counter-Strike 2', 'CS2', '🎯'),
    ('Valorant', 'VAL', '🔫'),
    ('League of Legends', 'LoL', '🏆'),
    ('Dota 2', 'DOTA', '⚔️');

INSERT INTO public.game_modes (game_id, name, team_size, maps) 
SELECT 
    g.id,
    CASE 
        WHEN g.short_name = 'CS2' THEN 'Competitive'
        WHEN g.short_name = 'VAL' THEN 'Unrated'
        WHEN g.short_name = 'LoL' THEN 'Ranked Solo/Duo'
        WHEN g.short_name = 'DOTA' THEN 'All Pick'
    END,
    CASE 
        WHEN g.short_name IN ('CS2', 'VAL') THEN 5
        WHEN g.short_name IN ('LoL', 'DOTA') THEN 5
    END,
    CASE 
        WHEN g.short_name = 'CS2' THEN ARRAY['de_dust2', 'de_mirage', 'de_inferno', 'de_cache', 'de_overpass']
        WHEN g.short_name = 'VAL' THEN ARRAY['Bind', 'Haven', 'Split', 'Ascent', 'Icebox']
        WHEN g.short_name = 'LoL' THEN ARRAY['Summoners Rift']
        WHEN g.short_name = 'DOTA' THEN ARRAY['Radiant vs Dire']
    END
FROM public.games g;

INSERT INTO public.achievements (name, description, icon, rarity) VALUES
    ('First Win', 'Win your first match', '🏅', 'common'),
    ('Team Player', 'Join your first team', '👥', 'common'),
    ('Tournament Fighter', 'Participate in your first tournament', '🏟️', 'rare'),
    ('Champion', 'Win a tournament', '👑', 'epic'),
    ('Legend', 'Win 5 tournaments', '⭐', 'legendary');