-- Create STABLE helper function to avoid auth.uid() initplan on every row
CREATE OR REPLACE FUNCTION public.current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT auth.uid()
$$;

-- ============================================
-- PROFILES: Merge and optimize policies
-- ============================================
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles
AS PERMISSIVE
FOR SELECT
TO public
USING (true);

CREATE POLICY "Users can manage their own profile"
ON public.profiles
AS PERMISSIVE
FOR ALL
TO authenticated
USING (user_id = (SELECT public.current_user_id()))
WITH CHECK (user_id = (SELECT public.current_user_id()));

-- ============================================
-- USER_STATS: Optimize policies
-- ============================================
DROP POLICY IF EXISTS "User stats are viewable by everyone" ON public.user_stats;
DROP POLICY IF EXISTS "Users can update their own stats" ON public.user_stats;

CREATE POLICY "User stats are viewable by everyone"
ON public.user_stats
AS PERMISSIVE
FOR SELECT
TO public
USING (true);

CREATE POLICY "Users can manage their own stats"
ON public.user_stats
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (user_id = (SELECT public.current_user_id()))
WITH CHECK (user_id = (SELECT public.current_user_id()));

-- ============================================
-- TEAMS: Optimize policies
-- ============================================
DROP POLICY IF EXISTS "Teams are viewable by everyone" ON public.teams;
DROP POLICY IF EXISTS "Authenticated users can create teams" ON public.teams;
DROP POLICY IF EXISTS "Team captains can update their teams" ON public.teams;

CREATE POLICY "Teams are viewable by everyone"
ON public.teams
AS PERMISSIVE
FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can create teams"
ON public.teams
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (captain_id = (SELECT public.current_user_id()));

CREATE POLICY "Team captains can update their teams"
ON public.teams
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (captain_id = (SELECT public.current_user_id()))
WITH CHECK (captain_id = (SELECT public.current_user_id()));

-- ============================================
-- TEAM_MEMBERS: Merge and optimize policies
-- ============================================
DROP POLICY IF EXISTS "Team members are viewable by everyone" ON public.team_members;
DROP POLICY IF EXISTS "Team captains can manage members" ON public.team_members;

CREATE POLICY "Team members are viewable by everyone"
ON public.team_members
AS PERMISSIVE
FOR SELECT
TO public
USING (true);

CREATE POLICY "Team captains can manage members"
ON public.team_members
AS PERMISSIVE
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.teams t
    WHERE t.id = team_members.team_id
      AND t.captain_id = (SELECT public.current_user_id())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.teams t
    WHERE t.id = team_members.team_id
      AND t.captain_id = (SELECT public.current_user_id())
  )
);

-- ============================================
-- TOURNAMENTS: Optimize policies
-- ============================================
DROP POLICY IF EXISTS "Tournaments are viewable by everyone" ON public.tournaments;
DROP POLICY IF EXISTS "Authenticated users can create tournaments" ON public.tournaments;
DROP POLICY IF EXISTS "Tournament organizers can update their tournaments" ON public.tournaments;

CREATE POLICY "Tournaments are viewable by everyone"
ON public.tournaments
AS PERMISSIVE
FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can create tournaments"
ON public.tournaments
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (organizer_id = (SELECT public.current_user_id()));

CREATE POLICY "Tournament organizers can update their tournaments"
ON public.tournaments
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (organizer_id = (SELECT public.current_user_id()))
WITH CHECK (organizer_id = (SELECT public.current_user_id()));

-- ============================================
-- TOURNAMENT_PARTICIPANTS: Merge and optimize
-- ============================================
DROP POLICY IF EXISTS "Tournament participants are viewable by everyone" ON public.tournament_participants;
DROP POLICY IF EXISTS "Authenticated users can join tournaments" ON public.tournament_participants;

CREATE POLICY "Tournament participants are viewable by everyone"
ON public.tournament_participants
AS PERMISSIVE
FOR SELECT
TO public
USING (true);

CREATE POLICY "Users can manage their tournament participation"
ON public.tournament_participants
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (user_id = (SELECT public.current_user_id()) OR team_id IN (
  SELECT t.id FROM public.teams t WHERE t.captain_id = (SELECT public.current_user_id())
));

-- ============================================
-- NEWS: Merge multiple SELECT policies
-- ============================================
DROP POLICY IF EXISTS "Published news are viewable by everyone" ON public.news;
DROP POLICY IF EXISTS "Authors can manage their news" ON public.news;

CREATE POLICY "News are viewable (author or published)"
ON public.news
AS PERMISSIVE
FOR SELECT
TO public
USING (
  status = 'published'
  OR author_id = (SELECT public.current_user_id())
);

CREATE POLICY "Authors can manage their news"
ON public.news
AS PERMISSIVE
FOR ALL
TO authenticated
USING (author_id = (SELECT public.current_user_id()))
WITH CHECK (author_id = (SELECT public.current_user_id()));

-- ============================================
-- NOTIFICATIONS: Merge and optimize
-- ============================================
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;

CREATE POLICY "Users manage their own notifications"
ON public.notifications
AS PERMISSIVE
FOR ALL
TO authenticated
USING (user_id = (SELECT public.current_user_id()))
WITH CHECK (user_id = (SELECT public.current_user_id()));

-- ============================================
-- TERMS_AGREEMENTS: Merge and optimize
-- ============================================
DROP POLICY IF EXISTS "Users can view their own terms agreements" ON public.terms_agreements;
DROP POLICY IF EXISTS "Users can insert their own terms agreements" ON public.terms_agreements;

CREATE POLICY "Users manage their own terms agreements"
ON public.terms_agreements
AS PERMISSIVE
FOR ALL
TO authenticated
USING (user_id = (SELECT public.current_user_id()))
WITH CHECK (user_id = (SELECT public.current_user_id()));

-- ============================================
-- SUBSCRIPTIONS: Merge and optimize
-- ============================================
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.subscriptions;

CREATE POLICY "Users manage their own subscription"
ON public.subscriptions
AS PERMISSIVE
FOR ALL
TO authenticated
USING (user_id = (SELECT public.current_user_id()))
WITH CHECK (user_id = (SELECT public.current_user_id()));

-- ============================================
-- USER_ROLES: Merge and optimize
-- ============================================
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

CREATE POLICY "Users can view their roles or admins view all"
ON public.user_roles
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (
  user_id = (SELECT public.current_user_id())
  OR public.has_role((SELECT public.current_user_id()), 'admin'::app_role)
);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
AS PERMISSIVE
FOR ALL
TO authenticated
USING (public.has_role((SELECT public.current_user_id()), 'admin'::app_role))
WITH CHECK (public.has_role((SELECT public.current_user_id()), 'admin'::app_role));

-- ============================================
-- TEAM_INVITES: Merge and optimize
-- ============================================
DROP POLICY IF EXISTS "Team invites are viewable by team members" ON public.team_invites;
DROP POLICY IF EXISTS "Team captains can manage invites" ON public.team_invites;

CREATE POLICY "Team invites viewable by members and public if active"
ON public.team_invites
AS PERMISSIVE
FOR SELECT
TO public
USING (
  is_active = true
  OR EXISTS (
    SELECT 1
    FROM public.team_members tm
    WHERE tm.team_id = team_invites.team_id
      AND tm.user_id = (SELECT public.current_user_id())
      AND tm.is_active = true
  )
);

CREATE POLICY "Team captains can manage invites"
ON public.team_invites
AS PERMISSIVE
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.teams t
    WHERE t.id = team_invites.team_id
      AND t.captain_id = (SELECT public.current_user_id())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.teams t
    WHERE t.id = team_invites.team_id
      AND t.captain_id = (SELECT public.current_user_id())
  )
);

-- ============================================
-- TOURNAMENT_INVITES: Merge and optimize
-- ============================================
DROP POLICY IF EXISTS "Tournament invites are viewable by everyone" ON public.tournament_invites;
DROP POLICY IF EXISTS "Team captains can manage tournament invites" ON public.tournament_invites;

CREATE POLICY "Tournament invites are viewable by everyone"
ON public.tournament_invites
AS PERMISSIVE
FOR SELECT
TO public
USING (true);

CREATE POLICY "Team captains can manage tournament invites"
ON public.tournament_invites
AS PERMISSIVE
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.teams t
    WHERE t.id = tournament_invites.team_id
      AND t.captain_id = (SELECT public.current_user_id())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.teams t
    WHERE t.id = tournament_invites.team_id
      AND t.captain_id = (SELECT public.current_user_id())
  )
);