-- Clear the notice board as requested
DELETE FROM public.notice_board;

-- Clean up any null or incomplete newsletters
DELETE FROM public.newsletters 
WHERE title IS NULL 
   OR title = '' 
   OR description IS NULL 
   OR description = '';