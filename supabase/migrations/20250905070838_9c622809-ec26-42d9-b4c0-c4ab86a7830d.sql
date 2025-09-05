-- Insert some sample notice data since the previous columns were dropped
INSERT INTO public.notice_board (title, body, published_at, pinned, link_url) VALUES
('Welcome to the new semester!', 'New academic session has started. All students are requested to attend the orientation program.', now(), true, null),
('Engineers Day Celebration', 'Join us for the Engineers Day celebration on September 15th. Various competitions and events are planned.', now(), false, 'https://example.com/engineers-day')
ON CONFLICT DO NOTHING;