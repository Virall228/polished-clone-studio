import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profile: any | null;
  roles: string[];
  isAdmin: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    profile: null,
    roles: [],
    isAdmin: false,
  });

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
        }));

        // Fetch user profile and roles when logged in
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfileAndRoles(session.user.id);
          }, 0);
        } else {
          setState(prev => ({
            ...prev,
            profile: null,
            roles: [],
            isAdmin: false,
            loading: false,
          }));
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
      }));

      if (session?.user) {
        fetchUserProfileAndRoles(session.user.id);
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
        }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfileAndRoles = async (userId: string) => {
    try {
      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Fetch roles
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      const roles = userRoles?.map(r => r.role) || [];
      const isAdmin = roles.includes('admin');

      setState(prev => ({
        ...prev,
        profile,
        roles,
        isAdmin,
        loading: false,
      }));
    } catch (error) {
      console.error('Error fetching profile and roles:', error);
      setState(prev => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      toast.success('Successfully signed in!');
    } catch (error: any) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, username?: string, firstName?: string, lastName?: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username,
            first_name: firstName,
            last_name: lastName
          }
        }
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      // Set session to persist for 30 days
      if (data.session) {
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
      }

      toast.success('Successfully signed up! Please check your email to confirm your account.');
    } catch (error: any) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error(error.message);
        throw error;
      }

      toast.success('Successfully signed out!');
    } catch (error: any) {
      throw error;
    }
  };

  const hasRole = (role: string) => {
    return state.roles.includes(role);
  };

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    hasRole,
  };
}
