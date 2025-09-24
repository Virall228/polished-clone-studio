import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { eslTheme } from '../../styles/esl-theme';
import { useApp } from '../../contexts/AppContext';
import { useToast } from '../../contexts/NotificationContext';
import { Team, Game, User } from '../../types';
import { Users, Plus, Search, Filter, Award, TrendingUp, Star, Calendar } from 'react-feather';

const TeamsContainer = styled.div`
  min-height: 100vh;
  background: ${eslTheme.colors.bg.primary};
  color: ${eslTheme.colors.text.primary};
  padding: 2rem;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: between;
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

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid ${props => 
    props.variant === 'primary' ? eslTheme.colors.white : eslTheme.colors.border.medium
  };
  background: ${props => 
    props.variant === 'primary' ? eslTheme.colors.white : 'transparent'
  };
  color: ${props => 
    props.variant === 'primary' ? eslTheme.colors.black : eslTheme.colors.white
  };
  border-radius: ${eslTheme.borderRadius.md};
  font-family: ${eslTheme.fonts.accent};
  font-weight: ${eslTheme.fontWeights.medium};
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all ${eslTheme.transitions.fast};
  
  &:hover {
    transform: translateY(-1px);
    background: ${props => 
      props.variant === 'primary' ? eslTheme.colors.text.secondary : eslTheme.colors.bg.elevated
    };
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

const TeamsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const TeamCard = styled.div<{ polished?: boolean }>`
  background: ${props => props.polished ? 
    `linear-gradient(135deg, ${eslTheme.colors.bg.secondary} 0%, ${eslTheme.colors.bg.tertiary} 100%)` :
    eslTheme.colors.bg.secondary
  };
  border: 1px solid ${eslTheme.colors.border.light};
  border-radius: ${eslTheme.borderRadius.lg};
  padding: 1.5rem;
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

const TeamHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const TeamLogo = styled.div`
  width: 60px;
  height: 60px;
  background: ${eslTheme.colors.bg.elevated};
  border: 2px solid ${eslTheme.colors.border.medium};
  border-radius: ${eslTheme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${eslTheme.fonts.accent};
  font-weight: ${eslTheme.fontWeights.bold};
  font-size: 1.25rem;
  color: ${eslTheme.colors.white};
`;

const TeamInfo = styled.div`
  flex: 1;
`;

const TeamName = styled.h3`
  font-family: ${eslTheme.fonts.accent};
  font-size: 1.25rem;
  font-weight: ${eslTheme.fontWeights.bold};
  color: ${eslTheme.colors.white};
  margin: 0 0 0.25rem 0;
`;

const TeamTag = styled.div`
  font-size: 0.875rem;
  color: ${eslTheme.colors.text.secondary};
  font-family: ${eslTheme.fonts.secondary};
`;

const TeamStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-family: ${eslTheme.fonts.accent};
  font-size: 1.5rem;
  font-weight: ${eslTheme.fontWeights.bold};
  color: ${eslTheme.colors.white};
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: ${eslTheme.colors.text.tertiary};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const TeamMembers = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${eslTheme.colors.border.light};
`;

const MembersLabel = styled.div`
  font-size: 0.875rem;
  color: ${eslTheme.colors.text.secondary};
  margin-bottom: 0.5rem;
`;

const MembersList = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const MemberBadge = styled.span`
  padding: 0.25rem 0.5rem;
  background: ${eslTheme.colors.bg.elevated};
  border: 1px solid ${eslTheme.colors.border.light};
  border-radius: ${eslTheme.borderRadius.sm};
  font-size: 0.75rem;
  color: ${eslTheme.colors.text.secondary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${eslTheme.colors.text.tertiary};
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const TeamsPage: React.FC = () => {
  const { state } = useApp();
  const toast = useToast();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [gameFilter, setGameFilter] = useState('all');
  const [sortBy, setSortBy] = useState('ranking');

  const isPolished = state.uiMode === 'polished';

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      
      // Mock teams data
      const mockTeams: Team[] = [
        {
          id: '1',
          name: 'WAY Esports Alpha',
          tag: 'WAY.A',
          description: 'Professional CS2 team competing at the highest level',
          members: [
            { userId: '1', user: { id: '1', username: 'player1', role: 'player', isOnline: true, joinedAt: new Date() } as User, role: 'captain', joinedAt: new Date(), isActive: true },
            { userId: '2', user: { id: '2', username: 'player2', role: 'player', isOnline: true, joinedAt: new Date() } as User, role: 'player', joinedAt: new Date(), isActive: true },
            { userId: '3', user: { id: '3', username: 'player3', role: 'player', isOnline: true, joinedAt: new Date() } as User, role: 'player', joinedAt: new Date(), isActive: true },
            { userId: '4', user: { id: '4', username: 'player4', role: 'player', isOnline: true, joinedAt: new Date() } as User, role: 'player', joinedAt: new Date(), isActive: true },
            { userId: '5', user: { id: '5', username: 'player5', role: 'player', isOnline: true, joinedAt: new Date() } as User, role: 'player', joinedAt: new Date(), isActive: true },
          ],
          captain: '1',
          game: { id: '1', name: 'Counter-Strike 2', shortName: 'CS2', icon: '🔫', isActive: true, modes: [] },
          stats: {
            matchesPlayed: 25,
            wins: 20,
            losses: 5,
            draws: 0,
            winRate: 80,
            points: 1520,
            ranking: 1,
            lastMatch: new Date()
          },
          createdAt: new Date('2024-01-15'),
          isActive: true
        },
        {
          id: '2',
          name: 'WAY Esports Beta',
          tag: 'WAY.B',
          description: 'Rising stars in competitive gaming',
          members: [
            { userId: '6', user: { id: '6', username: 'rising1', role: 'player', isOnline: true, joinedAt: new Date() } as User, role: 'captain', joinedAt: new Date(), isActive: true },
            { userId: '7', user: { id: '7', username: 'rising2', role: 'player', isOnline: true, joinedAt: new Date() } as User, role: 'player', joinedAt: new Date(), isActive: true },
            { userId: '8', user: { id: '8', username: 'rising3', role: 'player', isOnline: true, joinedAt: new Date() } as User, role: 'player', joinedAt: new Date(), isActive: true },
          ],
          captain: '6',
          game: { id: '2', name: 'Valorant', shortName: 'VAL', icon: '🎯', isActive: true, modes: [] },
          stats: {
            matchesPlayed: 18,
            wins: 12,
            losses: 6,
            draws: 0,
            winRate: 66.7,
            points: 1200,
            ranking: 3,
            lastMatch: new Date()
          },
          createdAt: new Date('2024-02-20'),
          isActive: true
        }
      ];

      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      setTeams(mockTeams);
      toast.success('Teams loaded successfully');
    } catch (error) {
      console.error('Failed to load teams:', error);
      toast.error('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.tag.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGame = gameFilter === 'all' || team.game.shortName === gameFilter;
    return matchesSearch && matchesGame;
  });

  const handleCreateTeam = () => {
    toast.info('Team creation feature coming soon!');
  };

  if (loading) {
    return (
      <TeamsContainer>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <div>Loading teams...</div>
        </div>
      </TeamsContainer>
    );
  }

  return (
    <TeamsContainer>
      <PageHeader>
        <PageTitle>
          <Users size={32} style={{ marginRight: '1rem', display: 'inline' }} />
          Teams
        </PageTitle>
        <HeaderActions>
          <ActionButton variant="primary" onClick={handleCreateTeam}>
            <Plus size={18} />
            Create Team
          </ActionButton>
        </HeaderActions>
      </PageHeader>

      <FiltersBar>
        <SearchInput
          type="text"
          placeholder="Search teams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FilterSelect value={gameFilter} onChange={(e) => setGameFilter(e.target.value)}>
          <option value="all">All Games</option>
          <option value="CS2">CS2</option>
          <option value="VAL">Valorant</option>
          <option value="LOL">League of Legends</option>
        </FilterSelect>
        <FilterSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="ranking">By Ranking</option>
          <option value="wins">By Wins</option>
          <option value="created">By Creation Date</option>
        </FilterSelect>
      </FiltersBar>

      {filteredTeams.length > 0 ? (
        <TeamsGrid>
          {filteredTeams.map((team) => (
            <TeamCard key={team.id} polished={isPolished}>
              <TeamHeader>
                <TeamLogo>
                  {team.tag}
                </TeamLogo>
                <TeamInfo>
                  <TeamName>{team.name}</TeamName>
                  <TeamTag>{team.game.name} • #{team.stats.ranking}</TeamTag>
                </TeamInfo>
              </TeamHeader>

              <TeamStats>
                <StatItem>
                  <StatValue>{team.stats.wins}</StatValue>
                  <StatLabel>Wins</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>{team.stats.winRate.toFixed(0)}%</StatValue>
                  <StatLabel>Win Rate</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue>{team.stats.points}</StatValue>
                  <StatLabel>Points</StatLabel>
                </StatItem>
              </TeamStats>

              <TeamMembers>
                <MembersLabel>{team.members.length} Members:</MembersLabel>
                <MembersList>
                  {team.members.map((member) => (
                    <MemberBadge key={member.userId}>
                      {member.user.username}
                      {member.role === 'captain' && ' (C)'}
                    </MemberBadge>
                  ))}
                </MembersList>
              </TeamMembers>
            </TeamCard>
          ))}
        </TeamsGrid>
      ) : (
        <EmptyState>
          <EmptyIcon>🏆</EmptyIcon>
          <h3>No teams found</h3>
          <p>Be the first to create a team and start competing!</p>
        </EmptyState>
      )}
    </TeamsContainer>
  );
};

export default TeamsPage;