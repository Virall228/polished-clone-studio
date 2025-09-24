import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { eslTheme } from '../../styles/esl-theme';
import { useApp } from '../../contexts/AppContext';
import { useToast } from '../../contexts/NotificationContext';
import { News } from '../../types';
import { FileText, Plus, Search, Filter, Calendar, User, Eye } from 'react-feather';

const NewsContainer = styled.div`
  min-height: 100vh;
  background: ${eslTheme.colors.bg.primary};
  color: ${eslTheme.colors.text.primary};
  padding: 2rem;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: ${eslTheme.breakpoints.tablet}) {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
`;

const PageTitle = styled.h1`
  font-family: ${eslTheme.fonts.accent};
  font-size: 2.5rem;
  font-weight: ${eslTheme.fontWeights.bold};
  color: ${eslTheme.colors.white};
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0;
`;

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid ${eslTheme.colors.white};
  background: ${eslTheme.colors.white};
  color: ${eslTheme.colors.black};
  border-radius: ${eslTheme.borderRadius.md};
  font-family: ${eslTheme.fonts.accent};
  font-weight: ${eslTheme.fontWeights.medium};
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all ${eslTheme.transitions.fast};
  
  &:hover {
    transform: translateY(-1px);
    background: ${eslTheme.colors.text.secondary};
  }
`;

const FiltersBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: ${eslTheme.colors.bg.secondary};
  border: 1px solid ${eslTheme.colors.border.light};
  border-radius: ${eslTheme.borderRadius.lg};
  
  @media (max-width: ${eslTheme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  background: ${eslTheme.colors.bg.tertiary};
  border: 1px solid ${eslTheme.colors.border.light};
  border-radius: ${eslTheme.borderRadius.md};
  color: ${eslTheme.colors.text.primary};
  font-family: ${eslTheme.fonts.primary};
  
  &::placeholder {
    color: ${eslTheme.colors.text.tertiary};
  }
  
  &:focus {
    outline: none;
    border-color: ${eslTheme.colors.white};
  }
`;

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  background: ${eslTheme.colors.bg.tertiary};
  border: 1px solid ${eslTheme.colors.border.light};
  border-radius: ${eslTheme.borderRadius.md};
  color: ${eslTheme.colors.text.primary};
  font-family: ${eslTheme.fonts.primary};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${eslTheme.colors.white};
  }
`;

const NewsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const NewsCard = styled.article<{ polished?: boolean }>`
  background: ${props => props.polished ? 
    `linear-gradient(135deg, ${eslTheme.colors.bg.secondary} 0%, ${eslTheme.colors.bg.tertiary} 100%)` :
    eslTheme.colors.bg.secondary
  };
  border: 1px solid ${eslTheme.colors.border.light};
  border-radius: ${eslTheme.borderRadius.lg};
  overflow: hidden;
  transition: all ${eslTheme.transitions.medium};
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    border-color: ${eslTheme.colors.border.medium};
    background: ${props => props.polished ? 
      `linear-gradient(135deg, ${eslTheme.colors.bg.tertiary} 0%, ${eslTheme.colors.bg.elevated} 100%)` :
      eslTheme.colors.bg.elevated
    };
    box-shadow: ${eslTheme.shadows.lg};
  }
`;

const NewsImage = styled.div<{ image?: string }>`
  height: 200px;
  background: ${props => props.image ? 
    `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${props.image})` :
    `linear-gradient(135deg, ${eslTheme.colors.bg.tertiary} 0%, ${eslTheme.colors.bg.elevated} 100%)`
  };
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: ${eslTheme.colors.text.secondary};
`;

const NewsContent = styled.div`
  padding: 1.5rem;
`;

const NewsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const NewsTitle = styled.h2`
  font-family: ${eslTheme.fonts.accent};
  font-size: 1.5rem;
  font-weight: ${eslTheme.fontWeights.bold};
  color: ${eslTheme.colors.white};
  margin: 0;
  line-height: 1.3;
  flex: 1;
  margin-right: 1rem;
`;

const CategoryBadge = styled.div<{ category: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: ${eslTheme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: ${eslTheme.fontWeights.medium};
  text-transform: uppercase;
  letter-spacing: 1px;
  
  ${props => {
    switch (props.category) {
      case 'tournament':
        return `
          background: ${eslTheme.colors.warning}20;
          color: ${eslTheme.colors.warning};
          border: 1px solid ${eslTheme.colors.warning}40;
        `;
      case 'team':
        return `
          background: ${eslTheme.colors.info}20;
          color: ${eslTheme.colors.info};
          border: 1px solid ${eslTheme.colors.info}40;
        `;
      case 'player':
        return `
          background: ${eslTheme.colors.success}20;
          color: ${eslTheme.colors.success};
          border: 1px solid ${eslTheme.colors.success}40;
        `;
      default:
        return `
          background: ${eslTheme.colors.bg.elevated};
          color: ${eslTheme.colors.text.secondary};
          border: 1px solid ${eslTheme.colors.border.light};
        `;
    }
  }}
`;

const NewsExcerpt = styled.p`
  color: ${eslTheme.colors.text.secondary};
  line-height: 1.6;
  margin: 1rem 0;
`;

const NewsFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid ${eslTheme.colors.border.light};
  font-size: 0.875rem;
  color: ${eslTheme.colors.text.tertiary};
`;

const NewsAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NewsStats = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${eslTheme.colors.text.tertiary};
`;

const NewsPage: React.FC = () => {
  const { state } = useApp();
  const toast = useToast();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const isPolished = state.uiMode === 'polished';

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      
      // Mock news data
      const mockNews: News[] = [
        {
          id: '1',
          title: 'WAY Esports Wins Championship 2024',
          content: 'In an epic finale, WAY Esports secured their victory in the Championship 2024...',
          excerpt: 'WAY Esports dominated the final match with exceptional teamwork and strategy.',
          author: { id: '1', username: 'NewsTeam', role: 'admin', isOnline: true, joinedAt: new Date() } as any,
          publishedAt: new Date('2024-10-20'),
          createdAt: new Date('2024-10-20'),
          updatedAt: new Date('2024-10-20'),
          status: 'published',
          tags: ['championship', 'victory', 'esports'],
          category: 'tournament',
          views: 1247
        },
        {
          id: '2',
          title: 'New Player Joins WAY Esports Roster',
          content: 'We are excited to announce the addition of a new talented player to our roster...',
          excerpt: 'Professional player "ProGamer" brings years of experience to strengthen our team.',
          author: { id: '1', username: 'NewsTeam', role: 'admin', isOnline: true, joinedAt: new Date() } as any,
          publishedAt: new Date('2024-10-18'),
          createdAt: new Date('2024-10-18'),
          updatedAt: new Date('2024-10-18'),
          status: 'published',
          tags: ['roster', 'player', 'announcement'],
          category: 'team',
          views: 856
        },
        {
          id: '3',
          title: 'Upcoming Tournament Schedule Released',
          content: 'The schedule for the upcoming season has been announced...',
          excerpt: 'Mark your calendars for the most exciting esports tournaments of the year.',
          author: { id: '1', username: 'NewsTeam', role: 'admin', isOnline: true, joinedAt: new Date() } as any,
          publishedAt: new Date('2024-10-15'),
          createdAt: new Date('2024-10-15'),
          updatedAt: new Date('2024-10-15'),
          status: 'published',
          tags: ['tournament', 'schedule', 'announcement'],
          category: 'tournament',
          views: 623
        }
      ];

      await new Promise(resolve => setTimeout(resolve, 800));
      setNews(mockNews);
      toast.success('News loaded successfully');
    } catch (error) {
      console.error('Failed to load news:', error);
      toast.error('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = news.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCreateNews = () => {
    toast.info('News creation feature coming soon!');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <NewsContainer>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <div>Loading news...</div>
        </div>
      </NewsContainer>
    );
  }

  return (
    <NewsContainer>
      <PageHeader>
        <PageTitle>
          <FileText size={32} style={{ marginRight: '1rem', display: 'inline' }} />
          News
        </PageTitle>
        <CreateButton onClick={handleCreateNews}>
          <Plus size={18} />
          Create News
        </CreateButton>
      </PageHeader>

      <FiltersBar>
        <SearchInput
          type="text"
          placeholder="Search news..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FilterSelect value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="tournament">Tournaments</option>
          <option value="team">Teams</option>
          <option value="player">Players</option>
          <option value="announcement">Announcements</option>
          <option value="general">General</option>
        </FilterSelect>
      </FiltersBar>

      {filteredNews.length > 0 ? (
        <NewsGrid>
          {filteredNews.map((article) => (
            <NewsCard key={article.id} polished={isPolished}>
              <NewsImage>
                📰
              </NewsImage>
              <NewsContent>
                <NewsHeader>
                  <NewsTitle>{article.title}</NewsTitle>
                  <CategoryBadge category={article.category}>
                    {article.category}
                  </CategoryBadge>
                </NewsHeader>
                
                <NewsExcerpt>{article.excerpt}</NewsExcerpt>
                
                <NewsFooter>
                  <NewsAuthor>
                    <User size={16} />
                    {article.author.username}
                    <span>•</span>
                    <Calendar size={16} />
                    {formatDate(article.publishedAt!)}
                  </NewsAuthor>
                  <NewsStats>
                    <StatItem>
                      <Eye size={16} />
                      {article.views.toLocaleString()}
                    </StatItem>
                  </NewsStats>
                </NewsFooter>
              </NewsContent>
            </NewsCard>
          ))}
        </NewsGrid>
      ) : (
        <EmptyState>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📰</div>
          <h3>No news found</h3>
          <p>Be the first to create and share esports news!</p>
        </EmptyState>
      )}
    </NewsContainer>
  );
};

export default NewsPage;