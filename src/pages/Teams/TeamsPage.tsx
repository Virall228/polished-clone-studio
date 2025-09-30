import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useAuth } from '@/hooks/useAuth';
import { Users, Plus, Search } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const TeamsPage: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [gameFilter, setGameFilter] = useState('all');

  const { data: teams, loading } = useSupabaseData('teams', (query) => 
    query.select(`
      *,
      game:games(*),
      team_stats(*),
      team_members(
        *,
        profiles(*)
      )
    `).eq('is_active', true)
  );

  const { data: games } = useSupabaseData('games', (query) => 
    query.select('*').eq('is_active', true)
  );

  const filteredTeams = teams.filter((team: any) => {
    const matchesSearch = team.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.tag?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGame = gameFilter === 'all' || team.game?.id === gameFilter;
    return matchesSearch && matchesGame;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Команды</h1>
        </div>
        {user && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Создать команду
          </Button>
        )}
      </div>

      <Card className="p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск команд..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={gameFilter} onValueChange={setGameFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Все игры" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все игры</SelectItem>
              {games.map((game: any) => (
                <SelectItem key={game.id} value={game.id}>
                  {game.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {filteredTeams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team: any) => (
            <Card key={team.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={team.logo_url} />
                  <AvatarFallback>{team.tag}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{team.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {team.game?.name} • #{team.team_stats?.ranking || 0}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{team.team_stats?.wins || 0}</div>
                  <div className="text-xs text-muted-foreground">Победы</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {team.team_stats?.win_rate ? Number(team.team_stats.win_rate).toFixed(0) : 0}%
                  </div>
                  <div className="text-xs text-muted-foreground">Винрейт</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{team.team_stats?.points || 0}</div>
                  <div className="text-xs text-muted-foreground">Очки</div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  {team.team_members?.length || 0} участников
                </p>
                <div className="flex gap-2 flex-wrap">
                  {team.team_members?.slice(0, 5).map((member: any) => (
                    <Badge key={member.id} variant="secondary">
                      {member.profiles?.username || 'Unknown'}
                      {member.role === 'captain' && ' (C)'}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Команды не найдены</h3>
          <p className="text-muted-foreground">Создайте первую команду!</p>
        </div>
      )}
    </div>
  );
};

export default TeamsPage;
