import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTeams } from '@/hooks/useTeams';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function JoinTeamPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { joinTeamByInvite } = useTeams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      handleJoinTeam();
    }
  }, [token]);

  const handleJoinTeam = async () => {
    if (!token) return;

    setLoading(true);
    const success = await joinTeamByInvite(token);
    setLoading(false);

    if (success) {
      setTimeout(() => {
        navigate('/teams/my');
      }, 2000);
    }
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
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Join Team</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">Redirecting to your teams...</p>
          <Button onClick={() => navigate('/teams/my')}>
            Go to My Teams
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
