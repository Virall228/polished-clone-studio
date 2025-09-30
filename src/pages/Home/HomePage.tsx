import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { Trophy, Users, Calendar, TrendingUp, Play, Newspaper } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const HomePage: React.FC = () => {
  const { data: matches, loading: matchesLoading } = useSupabaseData('matches', (query) => 
    query.select(`
      *,
      teams!matches_team1_id_fkey(id, name, tag, logo_url),
      teams_team2:teams!matches_team2_id_fkey(id, name, tag, logo_url)
    `).eq('status', 'live').limit(5)
  );

  const { data: tournaments, loading: tournamentsLoading } = useSupabaseData('tournaments', (query) => 
    query.select(`
      *,
      game:games(name)
    `).eq('status', 'registration_open').limit(3)
  );

  const { data: news, loading: newsLoading } = useSupabaseData('news', (query) => 
    query.select('*').eq('status', 'published').order('published_at', { ascending: false }).limit(3)
  );

  const stats = [
    { icon: Users, label: 'Активных игроков', value: '1,247' },
    { icon: Trophy, label: 'Турниров', value: '89' },
    { icon: Calendar, label: 'Матчей сыграно', value: '156' },
    { icon: TrendingUp, label: 'Призовой фонд', value: '$50K' },
  ];

  if (matchesLoading || tournamentsLoading || newsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-background via-secondary to-muted py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05)_0%,transparent_50%)] pointer-events-none" />
        
        <div className="relative z-10 container mx-auto">
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-wider mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            WAY Esports
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Профессиональный киберспорт. Соревнуйся. Доминируй. Побеждай.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
                  <Icon className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">
                    {stat.label}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Matches */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Play className="h-6 w-6" />
                Живые матчи
              </h2>
              {matches.length > 0 ? (
                <div className="space-y-3">
                  {matches.map((match: any) => (
                    <Card key={match.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{match.teams?.name || 'Team 1'}</span>
                        <span className="font-bold text-2xl px-4">
                          {match.score1} - {match.score2}
                        </span>
                        <span className="font-medium">{match.teams_team2?.name || 'Team 2'}</span>
                      </div>
                      <div className="text-center text-sm text-muted-foreground">
                        <Badge variant="destructive" className="gap-1">
                          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          LIVE
                        </Badge>
                        {match.map && <span className="ml-2">• {match.map}</span>}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Play className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Нет активных матчей</p>
                </div>
              )}
            </Card>

            {/* Recent News */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Newspaper className="h-6 w-6" />
                Последние новости
              </h2>
              {news.length > 0 ? (
                <div className="space-y-3">
                  {news.map((article: any) => (
                    <Card key={article.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <h3 className="font-semibold mb-1">{article.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {article.published_at && format(new Date(article.published_at), 'dd MMM yyyy')}
                        <Badge variant="outline">{article.category}</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Newspaper className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Новости скоро появятся</p>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Tournaments */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Предстоящие турниры</h2>
              {tournaments.length > 0 ? (
                <div className="space-y-3">
                  {tournaments.map((tournament: any) => (
                    <Card key={tournament.id} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                      <h3 className="font-semibold text-sm mb-1">{tournament.name}</h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        {tournament.game?.name}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="default" className="text-xs">
                          Регистрация открыта
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          ${tournament.prize_pool?.toLocaleString()}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Trophy className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Нет предстоящих турниров</p>
                </div>
              )}
            </Card>

            {/* Top Players */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Топ игроки</h2>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Таблица лидеров скоро</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
