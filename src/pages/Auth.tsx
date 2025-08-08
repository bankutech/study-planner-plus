
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [isPasswordUpdate, setIsPasswordUpdate] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Detect recovery redirect and enable password update mode
  useEffect(() => {
    if (searchParams.get('reset') === 'true') {
      setIsPasswordUpdate(true);
    }
  }, [searchParams]);

  // Also listen for Supabase PASSWORD_RECOVERY event (robust handling)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordUpdate(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isPasswordUpdate) {
        if (newPassword !== confirmPassword) {
          toast({
            title: 'Passwords do not match',
            description: 'Please make sure both passwords are identical.',
            variant: 'destructive',
          });
          return;
        }
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;

        toast({
          title: 'Password updated!',
          description: 'You can now sign in with your new password.',
        });
        setIsPasswordUpdate(false);
        setIsLogin(true);
        navigate('/');
      } else if (isResetPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth?reset=true`,
        });
        if (error) throw error;

        toast({
          title: 'Password reset email sent!',
          description: 'Please check your email for password reset instructions.',
        });
        setIsResetPassword(false);
      } else if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        toast({
          title: 'Signed in successfully!',
          description: 'Welcome back to your study planner.',
        });
        navigate('/');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        if (error) throw error;

        toast({
          title: 'Account created!',
          description: 'Please check your email to verify your account.',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Authentication error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-indigo-800">📚 Study Planner</CardTitle>
          <CardDescription>
            {isPasswordUpdate
              ? 'Set a new password'
              : (isResetPassword
                ? 'Reset your password'
                : (isLogin ? 'Sign in to your account' : 'Create a new account')
              )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {!isPasswordUpdate && (
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            )}

            {isPasswordUpdate ? (
              <>
                <div>
                  <Input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </>
            ) : (
              !isResetPassword && (
                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              )
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Loading...' : (
                isPasswordUpdate
                  ? 'Update Password'
                  : (isResetPassword ? 'Send Reset Email' : (isLogin ? 'Sign In' : 'Sign Up'))
              )}
            </Button>
          </form>

          <div className="mt-4 text-center space-y-2">
            {isPasswordUpdate ? (
              <button
                type="button"
                onClick={() => {
                  setIsPasswordUpdate(false);
                  setIsLogin(true);
                }}
                className="text-indigo-600 hover:text-indigo-800 underline block w-full"
              >
                Back to sign in
              </button>
            ) : !isResetPassword ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-indigo-600 hover:text-indigo-800 underline block w-full"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => setIsResetPassword(true)}
                    className="text-indigo-600 hover:text-indigo-800 underline block w-full"
                  >
                    Forgot your password?
                  </button>
                )}
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsResetPassword(false)}
                className="text-indigo-600 hover:text-indigo-800 underline block w-full"
              >
                Back to sign in
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
