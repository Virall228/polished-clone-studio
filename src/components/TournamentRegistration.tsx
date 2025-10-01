import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const TERMS_VERSION = '1.0.0';

interface TournamentRegistrationProps {
  tournamentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TournamentRegistration = ({ tournamentId, open, onOpenChange }: TournamentRegistrationProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { data: myTeams, loading: teamsLoading } = useSupabaseData('team_members', {
    user_id: user?.id,
    is_active: true,
  });

  const handleRegister = async () => {
    if (!user) {
      toast.error('Please sign in to register');
      return;
    }

    if (!selectedTeamId) {
      toast.error(t('tournaments.selectTeam'));
      return;
    }

    if (!agreedToTerms) {
      toast.error(t('tournaments.mustAgreeToTerms'));
      return;
    }

    setSubmitting(true);
    try {
      // Record terms agreement
      const { error: termsError } = await supabase.from('terms_agreements').insert({
        user_id: user.id,
        terms_version: TERMS_VERSION,
        ip_address: null,
        user_agent: navigator.userAgent,
      });

      if (termsError && termsError.code !== '23505') { // Ignore duplicate key error
        throw termsError;
      }

      // Register for tournament
      const { error: registrationError } = await supabase.from('tournament_participants').insert({
        tournament_id: tournamentId,
        team_id: selectedTeamId,
        user_id: user.id,
        terms_agreed: true,
        terms_version: TERMS_VERSION,
        terms_agreed_at: new Date().toISOString(),
      });

      if (registrationError) throw registrationError;

      toast.success(t('tournaments.registrationSuccess'));
      onOpenChange(false);
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(t('tournaments.registrationError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('tournaments.register')}</DialogTitle>
          <DialogDescription>
            Select your team and accept the terms to register for this tournament.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="team">{t('tournaments.selectTeam')}</Label>
            <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
              <SelectTrigger id="team">
                <SelectValue placeholder={t('tournaments.selectTeam')} />
              </SelectTrigger>
              <SelectContent>
                {teamsLoading && <SelectItem value="loading" disabled>{t('common.loading')}</SelectItem>}
                {!teamsLoading && myTeams?.length === 0 && (
                  <SelectItem value="none" disabled>{t('tournaments.noTeam')}</SelectItem>
                )}
                {myTeams?.map((membership: any) => (
                  <SelectItem key={membership.team_id} value={membership.team_id}>
                    Team {membership.team_id.slice(0, 8)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
            />
            <Label htmlFor="terms" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {t('tournaments.agreeToTerms')} (v{TERMS_VERSION})
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleRegister} disabled={submitting || !selectedTeamId || !agreedToTerms}>
            {submitting ? t('common.loading') : t('tournaments.register')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
