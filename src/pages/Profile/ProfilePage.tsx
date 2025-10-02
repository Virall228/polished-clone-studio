import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AvatarUpload } from '@/components/AvatarUpload';
import { Loader2, Trophy, Users, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { userId } = useParams();
  const { user: currentUser, profile: currentProfile } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = !userId || userId === currentUser?.id;
  const profileUserId = userId || currentUser?.id;

  useEffect(() => {
    if (profileUserId) {
      fetchProfileData();
    }
  }, [profileUserId]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', profileUserId)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch stats
      const { data: statsData } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', profileUserId)
        .single();
      setStats(statsData);

      // Fetch teams
      const { data: teamsData } = await supabase
        .from('team_members')
        .select(`
          *,
          teams:team_id (*)
        `)
        .eq('user_id', profileUserId)
        .eq('is_active', true);
      setTeams(teamsData?.map(t => t.teams).filter(Boolean) || []);

      // Fetch achievements
      const { data: achievementsData } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievements:achievement_id (*)
        `)
        .eq('user_id', profileUserId);
      setAchievements(achievementsData?.map(a => a.achievements).filter(Boolean) || []);

      // Fetch subscription (only for own profile)
      if (isOwnProfile) {
        const { data: subData } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', profileUserId)
          .maybeSingle();
        setSubscription(subData);
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{t('common.error')}</h1>
          <p>Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>{t('profile.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isOwnProfile ? (
              <AvatarUpload
                currentAvatarUrl={profile.avatar_url}
                onUploadComplete={(url) => setProfile({ ...profile, avatar_url: url })}
              />
            ) : (
              <div className="flex flex-col items-center">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback>
                    {profile.username?.substring(0, 2).toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}

            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold">{profile.username}</h2>
              {profile.first_name && profile.last_name && (
                <p className="text-muted-foreground">
                  {profile.first_name} {profile.last_name}
                </p>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Joined: {new Date(profile.joined_at).toLocaleDateString()}
            </div>

            {isOwnProfile && subscription && (
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t('subscription.title')}:</span>
                  <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                    {t(`subscription.${subscription.plan_type}`)}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('subscription.status')}: {t(`subscription.${subscription.status}`)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats and Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.stats')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats?.games_played || 0}</p>
                  <p className="text-sm text-muted-foreground">{t('profile.gamesPlayed')}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats?.wins || 0}</p>
                  <p className="text-sm text-muted-foreground">{t('teams.wins')}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats?.losses || 0}</p>
                  <p className="text-sm text-muted-foreground">{t('teams.losses')}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{stats?.points || 0}</p>
                  <p className="text-sm text-muted-foreground">{t('profile.points')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Teams Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {t('teams.myTeams')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {teams.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No teams yet</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {teams.map((team: any) => (
                    <div key={team.id} className="border rounded-lg p-4">
                      <h3 className="font-semibold">{team.name}</h3>
                      <p className="text-sm text-muted-foreground">[{team.tag}]</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Achievements Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {achievements.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No achievements yet</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-3">
                  {achievements.map((achievement: any) => (
                    <div key={achievement.id} className="border rounded-lg p-4 text-center">
                      <div className="text-4xl mb-2">{achievement.icon}</div>
                      <h4 className="font-semibold text-sm">{achievement.name}</h4>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      <Badge variant="secondary" className="mt-2">
                        {achievement.rarity}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
