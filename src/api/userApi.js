import { supabase } from '../supabaseClient';

// Signup using Supabase Auth, with optional username stored as user metadata
export const signUp = async (email, password, username) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username }, // store username in user metadata
    },
  });

  if (error) {
    console.error('SignUp error:', error);
    return { data, error };
  }
  return { data, error };
};

// Sign in and insert session record in Session table
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (!error && data.user) {
    await supabase.from('Session').insert([
      {
        sessionid: crypto.randomUUID(),
        userid: data.user.id,
        logintimestamp: new Date(),
        isactive: true,
      },
    ]);
  }

  return { data, error };
};

// Get current session info
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { data, error };
};

// Log out current user
export const logout = async () => {
  await supabase.auth.signOut();
};

// Update user metadata (e.g. username)
export const updateUserMetadata = async (updates) => {
  // updates = { username: 'newname', ... }
  const { data, error } = await supabase.auth.updateUser({
    data: updates,
  });
  if (error) {
    console.error('Update user metadata error:', error);
  }
  return { data, error };
};
