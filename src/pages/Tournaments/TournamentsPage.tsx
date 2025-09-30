import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useAuth } from '@/hooks/useAuth';
import { Trophy, Plus, Calendar, Users, DollarSign } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const TournamentsPage: React.FC = () => {
  const { user } = useAuth();

  const { data: tournaments, loading } = useSupabaseData('tournaments', (query) => 
    query.select(`
      *,
      game:games(*),
      tournament_participants(count)
    `).eq('status', 'registration_open').order('start_date', { ascending: true })
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'registration_open':
        return 'default';
      case 'upcoming':
        return 'secondary';
      case 'ongoing':
        return 'destructive';
      case 'completed':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      registration_open: 'Регистрация открыта',
      upcoming: 'Предстоящий',
      ongoing: 'Идёт',
      completed: 'Завершён',
    };
    return labels[status] || status;
  };

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
          <Trophy className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Турниры</h1>
        </div>
        {user && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Создать турнир
          </Button>
        )}
      </div>

      {tournaments.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tournaments.map((tournament: any) => (
            <Card key={tournament.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-xl mb-2">{tournament.name}</h3>
                  <p className="text-sm text-muted-foreground">{tournament.game?.name}</p>
                </div>
                <Badge variant={getStatusVariant(tournament.status)}>
                  {getStatusLabel(tournament.status)}
                </Badge>
              </div>

              <p className="text-muted-foreground mb-4 line-clamp-2">
                {tournament.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4" />
                  <span>${tournament.prize_pool?.toLocaleString() || 0}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4" />
                  <span>
                    {tournament.tournament_participants?.[0]?.count || 0}/
                    {tournament.max_participants}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {tournament.start_date 
                      ? format(new Date(tournament.start_date), 'dd MMM yyyy')
                      : 'TBA'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">
                    {tournament.format === 'single_elimination' ? 'Олимпийская' : 'Двойная'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button 
                  className="flex-1"
                  disabled={tournament.status !== 'registration_open'}
                >
                  {tournament.status === 'registration_open' ? 'Зарегистрироваться' : 'Просмотр'}
                </Button>
                <Button variant="outline">
                  Поделиться
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Турниры не найдены</h3>
          <p className="text-muted-foreground">Создайте первый турнир!</p>
        </div>
      )}
    </div>
  );
};

export default TournamentsPage;
