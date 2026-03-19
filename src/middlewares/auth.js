const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_ANON_KEY
);

/**
 * Middleware to protect routes and inject the user ID from Supabase JWT
 */
const protectRoute = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }

    // Crucial: We attach the user to the request object
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ error: 'Authentication service error.' });
  }
};

module.exports = { protectRoute };