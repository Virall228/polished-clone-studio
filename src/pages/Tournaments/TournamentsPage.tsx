import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { eslTheme } from '../../styles/esl-theme';
import { useApp } from '../../contexts/AppContext';
import { useToast } from '../../contexts/NotificationContext';
import { Tournament, Game } from '../../types';
import { Award, Plus, Calendar, Users, DollarSign, Clock } from 'react-feather';

const TournamentsContainer = styled.div`
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

const TournamentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
`;

const TournamentCard = styled.div<{ polished?: boolean }>`
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

const TournamentHeader = styled.div`
  margin-bottom: 1rem;
`;

const TournamentName = styled.h3`
  font-family: ${eslTheme.fonts.accent};
  font-size: 1.5rem;
  font-weight: ${eslTheme.fontWeights.bold};
  color: ${eslTheme.colors.white};
  margin: 0 0 0.5rem 0;
`;

const TournamentGame = styled.div`
  color: ${eslTheme.colors.text.secondary};
  font-weight: ${eslTheme.fontWeights.medium};
`;

const TournamentInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 1rem 0;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${eslTheme.colors.text.secondary};
  font-size: 0.875rem;
`;

const StatusBadge = styled.div<{ status: string }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: ${eslTheme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: ${eslTheme.fontWeights.medium};
  text-transform: uppercase;
  letter-spacing: 1px;
  
  ${props => {
    switch (props.status) {
      case 'upcoming':
        return `
          background: ${eslTheme.colors.info}20;
          color: ${eslTheme.colors.info};
          border: 1px solid ${eslTheme.colors.info}40;
        `;
      case 'registration_open':
        return `
          background: ${eslTheme.colors.success}20;
          color: ${eslTheme.colors.success};
          border: 1px solid ${eslTheme.colors.success}40;
        `;
      case 'ongoing':
        return `
          background: ${eslTheme.colors.warning}20;
          color: ${eslTheme.colors.warning};
          border: 1px solid ${eslTheme.colors.warning}40;
        `;
      case 'completed':
        return `
          background: ${eslTheme.colors.text.tertiary}20;
          color: ${eslTheme.colors.text.tertiary};
          border: 1px solid ${eslTheme.colors.text.tertiary}40;
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

const TournamentDescription = styled.p`
  color: ${eslTheme.colors.text.tertiary};
  font-size: 0.875rem;
  line-height: 1.4;
  margin: 1rem 0;
`;

const TournamentActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${eslTheme.colors.border.light};
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 0.5rem 1rem;
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
  font-weight: ${eslTheme.fontWeights.medium};
  cursor: pointer;
  transition: all ${eslTheme.transitions.fast};
  
  &:hover {
    background: ${props => 
      props.variant === 'primary' ? eslTheme.colors.text.secondary : eslTheme.colors.bg.elevated
    };
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${eslTheme.colors.text.tertiary};
`;

const TournamentsPage: React.FC = () => {
  const { state } = useApp();
  const toast = useToast();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  const isPolished = state.uiMode === 'polished';

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      setLoading(true);
      
      // Mock tournaments data
      const mockTournaments: Tournament[] = [
        {
          id: '1',
          name: 'WAY Championship 2024',
          description: 'The ultimate esports championship featuring the best teams from around the world.',
          game: { id: '1', name: 'Counter-Strike 2', shortName: 'CS2', icon: '🔫', isActive: true, modes: [] },
          format: 'single_elimination',
          status: 'registration_open',
          prizePool: 50000,
          maxParticipants: 16,
          participants: [],
          startDate: new Date('2024-12-01'),
          registrationDeadline: new Date('2024-11-15'),
          rules: 'Standard tournament rules apply.',
          organizer: { id: '1', username: 'admin', role: 'admin', isOnline: true, joinedAt: new Date() } as any,
          createdAt: new Date('2024-10-01')
        },
        {
          id: '2',
          name: 'Rising Stars Cup',
          description: 'A tournament for upcoming players to showcase their skills.',
          game: { id: '2', name: 'Valorant', shortName: 'VAL', icon: '🎯', isActive: true, modes: [] },
          format: 'double_elimination',
          status: 'upcoming',
          prizePool: 15000,
          maxParticipants: 32,
          participants: [],
          startDate: new Date('2024-11-20'),
          registrationDeadline: new Date('2024-11-10'),
          rules: 'Open to all skill levels.',
          organizer: { id: '1', username: 'admin', role: 'admin', isOnline: true, joinedAt: new Date() } as any,
          createdAt: new Date('2024-10-15')
        }
      ];

      await new Promise(resolve => setTimeout(resolve, 800));
      setTournaments(mockTournaments);
      toast.success('Tournaments loaded successfully');
    } catch (error) {
      console.error('Failed to load tournaments:', error);
      toast.error('Failed to load tournaments');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTournament = () => {
    toast.info('Tournament creation feature coming soon!');
  };

  const handleJoinTournament = (tournamentId: string) => {
    toast.info(`Joining tournament ${tournamentId}...`);
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
      <TournamentsContainer>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <div>Loading tournaments...</div>
        </div>
      </TournamentsContainer>
    );
  }

  return (
    <TournamentsContainer>
      <PageHeader>
        <PageTitle>
          <Award size={32} style={{ marginRight: '1rem', display: 'inline' }} />
          Tournaments
        </PageTitle>
        <CreateButton onClick={handleCreateTournament}>
          <Plus size={18} />
          Create Tournament
        </CreateButton>
      </PageHeader>

      {tournaments.length > 0 ? (
        <TournamentGrid>
          {tournaments.map((tournament) => (
            <TournamentCard key={tournament.id} polished={isPolished}>
              <TournamentHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <TournamentName>{tournament.name}</TournamentName>
                  <StatusBadge status={tournament.status}>
                    {tournament.status.replace('_', ' ')}
                  </StatusBadge>
                </div>
                <TournamentGame>{tournament.game.name}</TournamentGame>
              </TournamentHeader>

              <TournamentInfo>
                <InfoItem>
                  <DollarSign size={16} />
                  ${tournament.prizePool.toLocaleString()}
                </InfoItem>
                <InfoItem>
                  <Users size={16} />
                  {tournament.participants.length}/{tournament.maxParticipants}
                </InfoItem>
                <InfoItem>
                  <Calendar size={16} />
                  {formatDate(tournament.startDate)}
                </InfoItem>
                <InfoItem>
                  <Clock size={16} />
                  {tournament.format.replace('_', ' ')}
                </InfoItem>
              </TournamentInfo>

              <TournamentDescription>
                {tournament.description}
              </TournamentDescription>

              <TournamentActions>
                <ActionButton 
                  variant="primary" 
                  onClick={() => handleJoinTournament(tournament.id)}
                  disabled={tournament.status !== 'registration_open'}
                >
                  {tournament.status === 'registration_open' ? 'Register' : 'View Details'}
                </ActionButton>
                <ActionButton variant="secondary">
                  Share
                </ActionButton>
              </TournamentActions>
            </TournamentCard>
          ))}
        </TournamentGrid>
      ) : (
        <EmptyState>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏆</div>
          <h3>No tournaments available</h3>
          <p>Create the first tournament and start competing!</p>
        </EmptyState>
      )}
    </TournamentsContainer>
  );
};

export default TournamentsPage;