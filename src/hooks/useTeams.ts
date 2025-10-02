import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

export const useTeams = () => {
  const { user } = useAuth();
  const [myTeams, setMyTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyTeams();
    } else {
      setMyTeams([]);
      setLoading(false);
    }
  }, [user]);

  const fetchMyTeams = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch teams where user is a member
      const { data: memberships, error } = await supabase
        .from('team_members')
        .select(`
          *,
          teams:team_id (
            id,
            name,
            tag,
            logo_url,
            captain_id,
            game_id,
            description,
            is_active,
            created_at
          )
        `)
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) throw error;

      const teams = memberships?.map(m => m.teams).filter(Boolean) || [];
      setMyTeams(teams);
    } catch (error: any) {
      console.error('Error fetching teams:', error);
      toast.error('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const createTeam = async (teamData: {
    name: string;
    tag: string;
    game_id: string;
    description?: string;
  }) => {
    if (!user) {
      toast.error('Please sign in to create a team');
      return null;
    }

    try {
      // Create team
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
          ...teamData,
          captain_id: user.id,
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // Add creator as team member
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: user.id,
          role: 'captain',
        });

      if (memberError) throw memberError;

      toast.success('Team created successfully!');
      fetchMyTeams();
      return team;
    } catch (error: any) {
      console.error('Error creating team:', error);
      toast.error(error.message || 'Failed to create team');
      return null;
    }
  };

  const generateInviteLink = async (teamId: string) => {
    if (!user) return null;

    try {
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

      const { data, error } = await supabase
        .from('team_invites')
        .insert({
          team_id: teamId,
          token,
          created_by: user.id,
          expires_at: expiresAt.toISOString(),
          max_uses: 10,
        })
        .select()
        .single();

      if (error) throw error;

      const inviteUrl = `${window.location.origin}/teams/join/${token}`;
      toast.success('Invite link generated!');
      return inviteUrl;
    } catch (error: any) {
      console.error('Error generating invite:', error);
      toast.error('Failed to generate invite link');
      return null;
    }
  };

  const joinTeamByInvite = async (token: string) => {
    if (!user) {
      toast.error('Please sign in to join a team');
      return false;
    }

    try {
      // Fetch invite
      const { data: invite, error: inviteError } = await supabase
        .from('team_invites')
        .select('*')
        .eq('token', token)
        .eq('is_active', true)
        .single();

      if (inviteError || !invite) {
        toast.error('Invalid or expired invite link');
        return false;
      }

      // Check if expired
      if (new Date(invite.expires_at) < new Date()) {
        toast.error('This invite link has expired');
        return false;
      }

      // Check if max uses reached
      if (invite.uses_count >= invite.max_uses) {
        toast.error('This invite link has reached its maximum uses');
        return false;
      }

      // Check if already a member
      const { data: existingMember } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', invite.team_id)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (existingMember) {
        toast.error('You are already a member of this team');
        return false;
      }

      // Add user to team
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: invite.team_id,
          user_id: user.id,
          role: 'player',
        });

      if (memberError) throw memberError;

      // Update invite uses count
      await supabase
        .from('team_invites')
        .update({ uses_count: invite.uses_count + 1 })
        .eq('id', invite.id);

      toast.success('Successfully joined the team!');
      fetchMyTeams();
      return true;
    } catch (error: any) {
      console.error('Error joining team:', error);
      toast.error('Failed to join team');
      return false;
    }
  };

  const leaveTeam = async (teamId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('team_members')
        .update({ is_active: false })
        .eq('team_id', teamId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Left team successfully');
      fetchMyTeams();
      return true;
    } catch (error: any) {
      console.error('Error leaving team:', error);
      toast.error('Failed to leave team');
      return false;
    }
  };

  return {
    myTeams,
    loading,
    createTeam,
    generateInviteLink,
    joinTeamByInvite,
    leaveTeam,
    refetch: fetchMyTeams,
  };
};
