import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  "https://jwlrfgqophcngygphmtm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3bHJmZ3FvcGhjbmd5Z3BobXRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxNjEyNDYsImV4cCI6MjA0ODczNzI0Nn0.ikBQPyTOIxGIB1TdDXt8nTXgiW_0OiNdOiY_-58mFok"
);
