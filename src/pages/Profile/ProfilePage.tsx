import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Trophy, Target, Award, Loader2 } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
      });
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      const { data } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user!.id)
        .single();
      
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          first_name: formData.first_name,
          last_name: formData.last_name,
        })
        .eq('user_id', user!.id);

      if (error) throw error;

      toast({
        title: 'Профиль обновлён',
        description: 'Ваши данные успешно сохранены',
      });
      setEditing(false);
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <User className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Профиль</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 md:col-span-1">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback>
                {profile.username?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold mb-1">{profile.username}</h2>
            <p className="text-sm text-muted-foreground mb-3">{user.email}</p>
            <Badge variant="outline">{profile.role}</Badge>
          </div>

          <Separator className="my-4" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Статус:</span>
              <Badge variant={profile.is_online ? 'default' : 'secondary'}>
                {profile.is_online ? 'Онлайн' : 'Оффлайн'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Регистрация:</span>
              <span>{new Date(profile.joined_at).toLocaleDateString()}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 md:col-span-2">
          {editing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <Label htmlFor="username">Никнейм</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="first_name">Имя</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="last_name">Фамилия</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Сохранить
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setEditing(false)}
                  disabled={loading}
                >
                  Отмена
                </Button>
              </div>
            </form>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Информация</h3>
                <Button variant="outline" onClick={() => setEditing(true)}>
                  Редактировать
                </Button>
              </div>
              <div className="space-y-3">
                <div>
                  <Label>Никнейм</Label>
                  <p className="text-lg">{profile.username}</p>
                </div>
                <div>
                  <Label>Имя</Label>
                  <p className="text-lg">{profile.first_name || '—'}</p>
                </div>
                <div>
                  <Label>Фамилия</Label>
                  <p className="text-lg">{profile.last_name || '—'}</p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {stats && (
        <Card className="p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Статистика
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Target className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <div className="text-2xl font-bold">{stats.games_played || 0}</div>
              <div className="text-sm text-muted-foreground">Игр сыграно</div>
            </div>
            <div className="text-center">
              <Award className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{stats.wins || 0}</div>
              <div className="text-sm text-muted-foreground">Побед</div>
            </div>
            <div className="text-center">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <div className="text-2xl font-bold">
                {stats.win_rate ? Number(stats.win_rate).toFixed(0) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Винрейт</div>
            </div>
            <div className="text-center">
              <Target className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{stats.points || 0}</div>
              <div className="text-sm text-muted-foreground">Очков</div>
            </div>
          </div>
          {stats.rank && (
            <div className="mt-4 text-center">
              <Badge variant="outline" className="text-lg py-2 px-4">
                Ранг: {stats.rank}
              </Badge>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;
