import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { eslTheme } from '../../styles/esl-theme';
import { useApp } from '../../contexts/AppContext';
import { useToast } from '../../contexts/NotificationContext';
import { Match, Tournament, News, User } from '../../types';
import { TrendingUp, Users, Calendar, Award, Play, Star } from 'react-feather';

const HomeContainer = styled.div`
  min-height: 100vh;
  background: ${eslTheme.colors.bg.primary};
  color: ${eslTheme.colors.text.primary};
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, 
    ${eslTheme.colors.bg.primary} 0%, 
    ${eslTheme.colors.bg.secondary} 50%, 
    ${eslTheme.colors.bg.tertiary} 100%
  );
  padding: 4rem 2rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const HeroTitle = styled.h1`
  font-family: ${eslTheme.fonts.accent};
  font-size: 3.5rem;
  font-weight: ${eslTheme.fontWeights.black};
  text-transform: uppercase;
  letter-spacing: 4px;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
  
  background: linear-gradient(135deg, 
    ${eslTheme.colors.white} 0%, 
    ${eslTheme.colors.text.secondary} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: ${eslTheme.breakpoints.tablet}) {
    font-size: 2.5rem;
    letter-spacing: 2px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: ${eslTheme.colors.text.secondary};
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  z-index: 1;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  max-width: 800px;
  margin: 2rem auto;
  position: relative;
  z-index: 1;
`;

const StatCard = styled.div`
  background: ${eslTheme.colors.bg.elevated};
  border: 1px solid ${eslTheme.colors.border.light};
  border-radius: ${eslTheme.borderRadius.lg};
  padding: 1.5rem;
  text-align: center;
  transition: all ${eslTheme.transitions.medium};
  
  &:hover {
    transform: translateY(-2px);
    background: ${eslTheme.colors.bg.secondary};
    border-color: ${eslTheme.colors.border.medium};
    box-shadow: ${eslTheme.shadows.lg};
  }
`;

const StatIcon = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 0.5rem;
  color: ${eslTheme.colors.text.secondary};
`;

const StatNumber = styled.div`
  font-family: ${eslTheme.fonts.accent};
  font-size: 2rem;
  font-weight: ${eslTheme.fontWeights.bold};
  color: ${eslTheme.colors.white};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${eslTheme.colors.text.tertiary};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: ${eslTheme.breakpoints.desktop}) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionCard = styled.div<{ polished?: boolean }>`
  background: ${props => props.polished ? 
    `linear-gradient(135deg, ${eslTheme.colors.bg.secondary} 0%, ${eslTheme.colors.bg.tertiary} 100%)` :
    eslTheme.colors.bg.secondary
  };
  border: 1px solid ${eslTheme.colors.border.light};
  border-radius: ${eslTheme.borderRadius.lg};
  padding: 1.5rem;
  transition: all ${eslTheme.transitions.medium};
  
  &:hover {
    border-color: ${eslTheme.colors.border.medium};
    ${props => props.polished ? `
      transform: translateY(-1px);
      box-shadow: ${eslTheme.shadows.lg};
    ` : ''}
  }
`;

const SectionTitle = styled.h2`
  font-family: ${eslTheme.fonts.accent};
  font-size: 1.5rem;
  font-weight: ${eslTheme.fontWeights.bold};
  color: ${eslTheme.colors.white};
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const MatchCard = styled.div<{ polished?: boolean }>`
  background: ${props => props.polished ? 
    eslTheme.colors.bg.elevated : 
    eslTheme.colors.bg.tertiary
  };
  border: 1px solid ${eslTheme.colors.border.light};
  border-radius: ${eslTheme.borderRadius.md};
  padding: 1rem;
  margin-bottom: 1rem;
  transition: all ${eslTheme.transitions.fast};
  
  &:hover {
    background: ${eslTheme.colors.bg.elevated};
    border-color: ${eslTheme.colors.border.medium};
    ${props => props.polished ? `
      transform: scale(1.02);
    ` : ''}
  }
`;

const MatchTeams = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const TeamName = styled.span`
  font-weight: ${eslTheme.fontWeights.medium};
  color: ${eslTheme.colors.white};
`;

const MatchScore = styled.span`
  font-family: ${eslTheme.fonts.accent};
  font-weight: ${eslTheme.fontWeights.bold};
  color: ${eslTheme.colors.text.secondary};
`;

const MatchTime = styled.div`
  font-size: 0.875rem;
  color: ${eslTheme.colors.text.tertiary};
  text-align: center;
`;

const HomePage: React.FC = () => {
  const { state } = useApp();
  const toast = useToast();
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [upcomingTournaments, setUpcomingTournaments] = useState<Tournament[]>([]);
  const [latestNews, setLatestNews] = useState<News[]>([]);

  const isPolished = state.uiMode === 'polished';

  useEffect(() => {
    // Load data on component mount
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Mock data - in real app this would fetch from API
      setLiveMatches([
        {
          id: '1',
          team1: { 
            id: '1', name: 'Team Alpha', tag: 'ALPHA', 
            members: [], captain: '1', game: { id: '1', name: 'CS2', shortName: 'CS2', icon: '', isActive: true, modes: [] }, 
            stats: { matchesPlayed: 15, wins: 12, losses: 3, draws: 0, winRate: 80, points: 1250, ranking: 1 },
            createdAt: new Date(), isActive: true 
          },
          team2: { 
            id: '2', name: 'Team Beta', tag: 'BETA', 
            members: [], captain: '2', game: { id: '1', name: 'CS2', shortName: 'CS2', icon: '', isActive: true, modes: [] },
            stats: { matchesPlayed: 18, wins: 10, losses: 8, draws: 0, winRate: 55.6, points: 1100, ranking: 3 },
            createdAt: new Date(), isActive: true 
          },
          score1: 13,
          score2: 8,
          status: 'live',
          startedAt: new Date(),
          map: 'de_dust2'
        }
      ]);

      toast.success('Dashboard data loaded successfully');
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    }
  };

  return (
    <HomeContainer>
      <HeroSection>
        <HeroTitle>WAY Esports</HeroTitle>
        <HeroSubtitle>
          Professional Gaming Excellence. Compete. Dominate. Win.
        </HeroSubtitle>
        
        <StatsGrid>
          <StatCard>
            <StatIcon><Users size={24} /></StatIcon>
            <StatNumber>1,247</StatNumber>
            <StatLabel>Active Players</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon><Award size={24} /></StatIcon>
            <StatNumber>89</StatNumber>
            <StatLabel>Tournaments</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon><Calendar size={24} /></StatIcon>
            <StatNumber>156</StatNumber>
            <StatLabel>Matches Played</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon><TrendingUp size={24} /></StatIcon>
            <StatNumber>$50K</StatNumber>
            <StatLabel>Prize Pool</StatLabel>
          </StatCard>
        </StatsGrid>
      </HeroSection>

      <ContentGrid>
        <MainContent>
          <SectionCard polished={isPolished}>
            <SectionTitle>
              <Play size={20} style={{ marginRight: '0.5rem', display: 'inline' }} />
              Live Matches
            </SectionTitle>
            {liveMatches.length > 0 ? (
              liveMatches.map((match) => (
                <MatchCard key={match.id} polished={isPolished}>
                  <MatchTeams>
                    <TeamName>{match.team1.name}</TeamName>
                    <MatchScore>{match.score1} - {match.score2}</MatchScore>
                    <TeamName>{match.team2.name}</TeamName>
                  </MatchTeams>
                  <MatchTime>
                    🔴 LIVE • {match.map}
                  </MatchTime>
                </MatchCard>
              ))
            ) : (
              <div style={{ 
                textAlign: 'center', 
                color: eslTheme.colors.text.tertiary, 
                padding: '2rem' 
              }}>
                No live matches at the moment
              </div>
            )}
          </SectionCard>

          <SectionCard polished={isPolished}>
            <SectionTitle>
              <Star size={20} style={{ marginRight: '0.5rem', display: 'inline' }} />
              Recent News
            </SectionTitle>
            <div style={{ 
              textAlign: 'center', 
              color: eslTheme.colors.text.tertiary, 
              padding: '2rem' 
            }}>
              Latest esports news coming soon...
            </div>
          </SectionCard>
        </MainContent>

        <Sidebar>
          <SectionCard polished={isPolished}>
            <SectionTitle>Upcoming Tournaments</SectionTitle>
            <div style={{ 
              textAlign: 'center', 
              color: eslTheme.colors.text.tertiary, 
              padding: '1rem' 
            }}>
              No upcoming tournaments
            </div>
          </SectionCard>

          <SectionCard polished={isPolished}>
            <SectionTitle>Top Players</SectionTitle>
            <div style={{ 
              textAlign: 'center', 
              color: eslTheme.colors.text.tertiary, 
              padding: '1rem' 
            }}>
              Leaderboard coming soon...
            </div>
          </SectionCard>
        </Sidebar>
      </ContentGrid>
    </HomeContainer>
  );
};

export default HomePage;