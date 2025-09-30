import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useAuth } from '@/hooks/useAuth';
import { Newspaper, Plus, Search, Calendar, Eye, User } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const NewsPage: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const { data: news, loading } = useSupabaseData('news', (query) => 
    query.select(`
      *,
      profiles:author_id(username, avatar_url)
    `).eq('status', 'published').order('published_at', { ascending: false })
  );

  const filteredNews = news.filter((article: any) => {
    const matchesSearch = article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryVariant = (category: string) => {
    const variants: Record<string, any> = {
      tournament: 'default',
      team: 'secondary',
      player: 'outline',
      announcement: 'destructive',
      general: 'secondary',
    };
    return variants[category] || 'secondary';
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
          <Newspaper className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Новости</h1>
        </div>
        {user && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Создать новость
          </Button>
        )}
      </div>

      <Card className="p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск новостей..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Все категории" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все категории</SelectItem>
              <SelectItem value="tournament">Турниры</SelectItem>
              <SelectItem value="team">Команды</SelectItem>
              <SelectItem value="player">Игроки</SelectItem>
              <SelectItem value="announcement">Объявления</SelectItem>
              <SelectItem value="general">Общее</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {filteredNews.length > 0 ? (
        <div className="grid gap-6">
          {filteredNews.map((article: any) => (
            <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex flex-col md:flex-row">
                {article.cover_image_url && (
                  <div 
                    className="w-full md:w-64 h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url(${article.cover_image_url})` }}
                  />
                )}
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-2xl font-bold flex-1">{article.title}</h2>
                    <Badge variant={getCategoryVariant(article.category)}>
                      {article.category}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>
                            <User className="h-3 w-3" />
                          </AvatarFallback>
                        </Avatar>
                        <span>{article.profiles?.username || 'Аноним'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {article.published_at 
                            ? format(new Date(article.published_at), 'dd MMM yyyy')
                            : 'TBA'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{article.views?.toLocaleString() || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Newspaper className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Новости не найдены</h3>
          <p className="text-muted-foreground">Создайте первую новость!</p>
        </div>
      )}
    </div>
  );
};

export default NewsPage;
