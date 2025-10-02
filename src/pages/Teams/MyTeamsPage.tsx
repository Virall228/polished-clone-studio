import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTeams } from '@/hooks/useTeams';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Users, Share2, LogOut } from 'lucide-react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { toast } from 'sonner';

export default function MyTeamsPage() {
  const { t } = useTranslation();
  const { myTeams, loading, createTeam, generateInviteLink, leaveTeam } = useTeams();
  const { data: games } = useSupabaseData('games', { is_active: true });
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    tag: '',
    game_id: '',
    description: '',
  });

  const handleCreateTeam = async () => {
    if (!formData.name || !formData.tag || !formData.game_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    const team = await createTeam(formData);
    if (team) {
      setCreateDialogOpen(false);
      setFormData({ name: '', tag: '', game_id: '', description: '' });
    }
  };

  const handleGenerateInvite = async (teamId: string) => {
    const inviteUrl = await generateInviteLink(teamId);
    if (inviteUrl) {
      navigator.clipboard.writeText(inviteUrl);
      toast.success('Invite link copied to clipboard!');
    }
  };

  const handleLeaveTeam = async (teamId: string, teamName: string) => {
    if (window.confirm(`Are you sure you want to leave ${teamName}?`)) {
      await leaveTeam(teamId);
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">{t('teams.myTeams')}</h1>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('teams.createTeam')}
        </Button>
      </div>

      {myTeams.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">You haven't joined any teams yet</p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              {t('teams.createTeam')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {myTeams.map((team: any) => (
            <Card key={team.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{team.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">[{team.tag}]</p>
                  </div>
                  {team.logo_url && (
                    <img src={team.logo_url} alt={team.name} className="h-12 w-12 rounded" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {team.description && (
                  <p className="text-sm text-muted-foreground">{team.description}</p>
                )}
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleGenerateInvite(team.id)}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Invite
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLeaveTeam(team.id, team.name)}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Team Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('teams.createTeam')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">{t('teams.teamName')} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter team name"
              />
            </div>
            <div>
              <Label htmlFor="tag">{t('teams.teamTag')} *</Label>
              <Input
                id="tag"
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                placeholder="Enter team tag"
                maxLength={5}
              />
            </div>
            <div>
              <Label htmlFor="game">Game *</Label>
              <Select
                value={formData.game_id}
                onValueChange={(value) => setFormData({ ...formData, game_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select game" />
                </SelectTrigger>
                <SelectContent>
                  {games?.map((game: any) => (
                    <SelectItem key={game.id} value={game.id}>
                      {game.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">{t('teams.description')}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter team description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleCreateTeam}>
              {t('common.create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
