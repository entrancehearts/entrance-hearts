// ========================================
// SUPABASE CONFIGURATION - ENTRANCEHEARTS
// ========================================
// This file is kept for compatibility but NOT used.
// All HTML files now use inline Supabase configuration.
// 
// The inline config in each HTML file:
// const SUPABASE_URL = 'https://dzfrwjuugeqzsxrykgjc.supabase.co';
// const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
// const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
//
// This approach ensures no external dependencies and faster loading.
// ========================================

// Backup - In case any file still references this
if (typeof supabaseClient === 'undefined' && typeof supabase !== 'undefined') {
  const SUPABASE_URL = 'https://dzfrwjuugeqzsxrykgjc.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6ZnJ3anV1Z2VxenN4cnlrZ2pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMzc3MzQsImV4cCI6MjA5MzcxMzczNH0.ahwhlTxsd9v69hVskZv6j34jZDRktEcv6by4kwLkuNQ';
  var supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
