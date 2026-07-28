-- =========================================================================
-- SPACE A: FAKE PROBLEM REVIEWS SEEDING SCRIPT
-- =========================================================================
-- Use this script in Supabase SQL Editor to seed test data for any user.
--
-- Instructions:
-- 1. Open Supabase Dashboard -> Authentication -> Users and copy your User UUID.
-- 2. Open Supabase Dashboard -> SQL Editor -> New Query.
-- 3. Replace 'YOUR_USER_ID_HERE' below with your actual User UUID.
-- 4. Click RUN.

DO $$
DECLARE
    -- REPLACE THIS WITH YOUR USER UUID FROM SUPABASE AUTH USERS:
    target_user_id UUID := '99a340e1-df92-422a-a06d-18cc2403c972'::UUID; 
    
    p_rec RECORD;
    i INT := 0;
BEGIN
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'Please set target_user_id to your actual user UUID!';
    END IF;

    -- 1. Update Profile: Enable all sheets & set streak stats
    UPDATE public.profiles
    SET 
        enabled_sheets = ARRAY['striver_sde', 'striver_a2z', 'tle_31', 'neetcode_all']::TEXT[],
        streak = 7,
        max_streak = 14,
        last_active_date = CURRENT_DATE,
        algorithm = 'fsrs',
        target_retention = 0.90
    WHERE id = target_user_id;

    -- 2. Clear existing user_problems and review_history for clean test state
    DELETE FROM public.review_history WHERE user_id = target_user_id;
    DELETE FROM public.user_problems WHERE user_id = target_user_id;

    -- 3. Seed 20 problems with full lifecycle mix (Due Today, Future, Mastered, Cooling)
    FOR p_rec IN (
        SELECT id, sheet, title, difficulty 
        FROM public.problems 
        ORDER BY random() 
        LIMIT 20
    ) LOOP
        i := i + 1;

        IF i <= 6 THEN
            -- CATEGORY A: DUE TODAY / OVERDUE (Ready for immediate review testing in /review)
            INSERT INTO public.user_problems (
                user_id, problem_id, interval_days, ease_factor, repetitions, stability, difficulty, next_review_date, last_reviewed_at, status
            ) VALUES (
                target_user_id, p_rec.id, 1, 2.5, 1, 1.2, 5.0, NOW() - (i || ' hours')::INTERVAL, NOW() - (1 || ' days')::INTERVAL, 'reviewing'
            );

            -- Audit log entry
            INSERT INTO public.review_history (user_id, problem_id, rating, ease_factor, interval_days, reviewed_at)
            VALUES (target_user_id, p_rec.id, 2, 2.5, 1, NOW() - (1 || ' days')::INTERVAL);

        ELSIF i <= 12 THEN
            -- CATEGORY B: FUTURE SCHEDULED (Reviewing in future days)
            INSERT INTO public.user_problems (
                user_id, problem_id, interval_days, ease_factor, repetitions, stability, difficulty, next_review_date, last_reviewed_at, status
            ) VALUES (
                target_user_id, p_rec.id, 7, 2.6, 3, 7.5, 4.2, NOW() + (i || ' days')::INTERVAL, NOW() - (2 || ' days')::INTERVAL, 'reviewing'
            );

            INSERT INTO public.review_history (user_id, problem_id, rating, ease_factor, interval_days, reviewed_at)
            VALUES (target_user_id, p_rec.id, 3, 2.6, 7, NOW() - (2 || ' days')::INTERVAL);

        ELSIF i <= 16 THEN
            -- CATEGORY C: MASTERED PROBLEMS (High interval >120 days)
            INSERT INTO public.user_problems (
                user_id, problem_id, interval_days, ease_factor, repetitions, stability, difficulty, next_review_date, last_reviewed_at, status
            ) VALUES (
                target_user_id, p_rec.id, 150, 4.2, 8, 195.0, 2.1, NOW() + (120 || ' days')::INTERVAL, NOW() - (30 || ' days')::INTERVAL, 'mastered'
            );

            INSERT INTO public.review_history (user_id, problem_id, rating, ease_factor, interval_days, reviewed_at)
            VALUES (target_user_id, p_rec.id, 3, 4.2, 150, NOW() - (30 || ' days')::INTERVAL);

        ELSE
            -- CATEGORY D: CP COOLING QUEUE (Snoozed/Cooling until 3 days in future)
            INSERT INTO public.user_problems (
                user_id, problem_id, interval_days, ease_factor, repetitions, stability, difficulty, next_review_date, last_reviewed_at, status, cooling_queue_tier, cooling_until
            ) VALUES (
                target_user_id, p_rec.id, 2, 2.2, 2, 2.0, 6.5, NOW() + (3 || ' days')::INTERVAL, NOW() - (1 || ' hours')::INTERVAL, 'cooling', 'primary', NOW() + (3 || ' days')::INTERVAL
            );

            INSERT INTO public.review_history (user_id, problem_id, rating, ease_factor, interval_days, reviewed_at)
            VALUES (target_user_id, p_rec.id, 1, 2.2, 2, NOW() - (1 || ' hours')::INTERVAL);

        END IF;
    END LOOP;

    RAISE NOTICE 'Successfully seeded 20 test problems for user %!', target_user_id;
END $$;
