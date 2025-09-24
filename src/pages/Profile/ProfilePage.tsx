import React from 'react';
import styled from 'styled-components';
import { eslTheme } from '../../styles/esl-theme';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { User } from 'react-feather';

const ProfileContainer = styled.div`
  min-height: 100vh;
  background: ${eslTheme.colors.bg.primary};
  color: ${eslTheme.colors.text.primary};
  padding: 2rem;
`;

const ProfileCard = styled.div<{ polished?: boolean }>`
  background: ${props => props.polished ? 
    `linear-gradient(135deg, ${eslTheme.colors.bg.secondary} 0%, ${eslTheme.colors.bg.tertiary} 100%)` :
    eslTheme.colors.bg.secondary
  };
  border: 1px solid ${eslTheme.colors.border.light};
  border-radius: ${eslTheme.borderRadius.lg};
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
`;

const ProfilePage: React.FC = () => {
  const { state } = useApp();
  const { user } = useAuth();
  const isPolished = state.uiMode === 'polished';

  return (
    <ProfileContainer>
      <ProfileCard polished={isPolished}>
        <div style={{ textAlign: 'center' }}>
          <User size={64} style={{ marginBottom: '1rem' }} />
          <h1>Profile</h1>
          {user ? (
            <div>
              <p>Username: {user.username}</p>
              <p>Role: {user.role}</p>
            </div>
          ) : (
            <p>Not logged in</p>
          )}
        </div>
      </ProfileCard>
    </ProfileContainer>
  );
};

export default ProfilePage;