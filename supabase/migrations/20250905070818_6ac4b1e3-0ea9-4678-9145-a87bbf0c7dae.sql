-- Fix notice_board table schema to match the expected interface
-- Drop the incorrectly named columns and add the correct ones
ALTER TABLE public.notice_board 
DROP COLUMN IF EXISTS "Engineer's Day Celebration",
DROP COLUMN IF EXISTS "engneers_day";

-- Add the correct columns
ALTER TABLE public.notice_board 
ADD COLUMN IF NOT EXISTS title TEXT NOT NULL DEFAULT 'Notice',
ADD COLUMN IF NOT EXISTS body TEXT NOT NULL DEFAULT 'Notice content';