var SUPABASE_URL = "https://mvgzcazaklyvvhfufuct.supabase.co";
var SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12Z3pjYXpha2x5dnZoZnVmdWN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5OTI3MDUsImV4cCI6MjA5NzU2ODcwNX0.AqdTVy9fdwiSHpSY10B5ycOOlDDigR-cuX6zfucLGfo";

if (typeof window.supabase === "undefined") {
  console.error("Supabase SDK no cargado. Verifica que el CDN se cargue antes que config.js");
}

var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

var PAGE_SIZE = 20;
var visibleCount = 0;