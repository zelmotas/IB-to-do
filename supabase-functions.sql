-- Function to get distinct subjects
CREATE OR REPLACE FUNCTION get_distinct_subjects()
RETURNS TABLE (subject TEXT) 
LANGUAGE SQL
AS $$
  SELECT DISTINCT subject FROM past_papers ORDER BY subject;
$$;

-- Function to get distinct years
CREATE OR REPLACE FUNCTION get_distinct_years()
RETURNS TABLE (year INTEGER) 
LANGUAGE SQL
AS $$
  SELECT DISTINCT year FROM past_papers ORDER BY year DESC;
$$;
