import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Users, Newspaper, Calendar } from 'lucide-react';

const AdminPage: React.FC = () => {
  const { profile, isAdmin, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const { data: games } = useSupabaseData('games');

  // Redirect if not admin
  if (!authLoading && !isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <h1 className="text-2xl font-bold mb-4">403 Forbidden</h1>
            <p className="text-muted-foreground">You do not have permission to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }
  
  const [teamForm, setTeamForm] = useState({
    name: '',
    tag: '',
    game_id: '',
    description: '',
  });

  const [tournamentForm, setTournamentForm] = useState<{
    name: string;
    description: string;
    game_id: string;
    format: 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss';
    prize_pool: number;
    max_participants: number;
    start_date: string;
    registration_deadline: string;
    rules: string;
  }>({
    name: '',
    description: '',
    game_id: '',
    format: 'single_elimination',
    prize_pool: 0,
    max_participants: 16,
    start_date: '',
    registration_deadline: '',
    rules: '',
  });

  const [newsForm, setNewsForm] = useState<{
    title: string;
    content: string;
    excerpt: string;
    category: 'general' | 'tournament' | 'team' | 'player' | 'game_update' | 'announcement';
  }>({
    title: '',
    content: '',
    excerpt: '',
    category: 'general',
  });

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('teams').insert([{
        ...teamForm,
        captain_id: profile?.user_id,
      }]);

      if (error) throw error;

      toast({ title: 'Команда создана!' });
      setTeamForm({ name: '', tag: '', game_id: '', description: '' });
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    }
  };

  const handleCreateTournament = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('tournaments').insert([{
        ...tournamentForm,
        organizer_id: profile?.user_id,
        status: 'registration_open',
      }]);

      if (error) throw error;

      toast({ title: 'Турнир создан!' });
      setTournamentForm({
        name: '',
        description: '',
        game_id: '',
        format: 'single_elimination',
        prize_pool: 0,
        max_participants: 16,
        start_date: '',
        registration_deadline: '',
        rules: '',
      });
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    }
  };

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('news').insert([{
        ...newsForm,
        author_id: profile?.user_id,
        status: 'published',
        published_at: new Date().toISOString(),
      }]);

      if (error) throw error;

      toast({ title: 'Новость опубликована!' });
      setNewsForm({ title: '', content: '', excerpt: '', category: 'general' });
    } catch (error: any) {
      toast({ title: 'Ошибка', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Админ-панель</h1>

      <Tabs defaultValue="teams" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="teams" className="gap-2">
            <Users className="h-4 w-4" />
            Команды
          </TabsTrigger>
          <TabsTrigger value="tournaments" className="gap-2">
            <Trophy className="h-4 w-4" />
            Турниры
          </TabsTrigger>
          <TabsTrigger value="news" className="gap-2">
            <Newspaper className="h-4 w-4" />
            Новости
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teams">
          <Card>
            <CardHeader>
              <CardTitle>Создать команду</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTeam} className="space-y-4">
                <div>
                  <Label htmlFor="team-name">Название</Label>
                  <Input
                    id="team-name"
                    value={teamForm.name}
                    onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="team-tag">Тег</Label>
                  <Input
                    id="team-tag"
                    value={teamForm.tag}
                    onChange={(e) => setTeamForm({ ...teamForm, tag: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="team-game">Игра</Label>
                  <Select value={teamForm.game_id} onValueChange={(value) => setTeamForm({ ...teamForm, game_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите игру" />
                    </SelectTrigger>
                    <SelectContent>
                      {games.map((game: any) => (
                        <SelectItem key={game.id} value={game.id}>{game.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="team-desc">Описание</Label>
                  <Textarea
                    id="team-desc"
                    value={teamForm.description}
                    onChange={(e) => setTeamForm({ ...teamForm, description: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full">Создать команду</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tournaments">
          <Card>
            <CardHeader>
              <CardTitle>Создать турнир</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTournament} className="space-y-4">
                <div>
                  <Label htmlFor="tournament-name">Название</Label>
                  <Input
                    id="tournament-name"
                    value={tournamentForm.name}
                    onChange={(e) => setTournamentForm({ ...tournamentForm, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tournament-game">Игра</Label>
                  <Select value={tournamentForm.game_id} onValueChange={(value) => setTournamentForm({ ...tournamentForm, game_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите игру" />
                    </SelectTrigger>
                    <SelectContent>
                      {games.map((game: any) => (
                        <SelectItem key={game.id} value={game.id}>{game.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tournament-prize">Призовой фонд</Label>
                    <Input
                      id="tournament-prize"
                      type="number"
                      value={tournamentForm.prize_pool}
                      onChange={(e) => setTournamentForm({ ...tournamentForm, prize_pool: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tournament-max">Макс. участников</Label>
                    <Input
                      id="tournament-max"
                      type="number"
                      value={tournamentForm.max_participants}
                      onChange={(e) => setTournamentForm({ ...tournamentForm, max_participants: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tournament-start">Дата начала</Label>
                    <Input
                      id="tournament-start"
                      type="datetime-local"
                      value={tournamentForm.start_date}
                      onChange={(e) => setTournamentForm({ ...tournamentForm, start_date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="tournament-deadline">Дедлайн регистрации</Label>
                    <Input
                      id="tournament-deadline"
                      type="datetime-local"
                      value={tournamentForm.registration_deadline}
                      onChange={(e) => setTournamentForm({ ...tournamentForm, registration_deadline: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="tournament-desc">Описание</Label>
                  <Textarea
                    id="tournament-desc"
                    value={tournamentForm.description}
                    onChange={(e) => setTournamentForm({ ...tournamentForm, description: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tournament-rules">Правила</Label>
                  <Textarea
                    id="tournament-rules"
                    value={tournamentForm.rules}
                    onChange={(e) => setTournamentForm({ ...tournamentForm, rules: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Создать турнир</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news">
          <Card>
            <CardHeader>
              <CardTitle>Создать новость</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateNews} className="space-y-4">
                <div>
                  <Label htmlFor="news-title">Заголовок</Label>
                  <Input
                    id="news-title"
                    value={newsForm.title}
                    onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="news-category">Категория</Label>
                  <Select value={newsForm.category} onValueChange={(value) => setNewsForm({ ...newsForm, category: value as typeof newsForm.category })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">Общее</SelectItem>
                      <SelectItem value="tournament">Турниры</SelectItem>
                      <SelectItem value="team">Команды</SelectItem>
                      <SelectItem value="announcement">Объявления</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="news-excerpt">Краткое описание</Label>
                  <Input
                    id="news-excerpt"
                    value={newsForm.excerpt}
                    onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="news-content">Содержание</Label>
                  <Textarea
                    id="news-content"
                    value={newsForm.content}
                    onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                    rows={10}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Опубликовать новость</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
