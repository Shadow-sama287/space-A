-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES TABLE (linked to Auth.Users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    streak INTEGER DEFAULT 0,
    last_active_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROBLEMS TABLE
CREATE TABLE IF NOT EXISTS public.problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sheet VARCHAR NOT NULL, -- e.g., 'striver_sde', 'neetcode_150'
    title VARCHAR NOT NULL,
    category VARCHAR NOT NULL, -- e.g., 'Arrays', 'Linked List'
    difficulty VARCHAR NOT NULL, -- 'Easy', 'Medium', 'Hard'
    leetcode_url TEXT,
    ninja_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(sheet, title)
);

-- USER_PROBLEMS TABLE (User progress on a problem)
CREATE TABLE IF NOT EXISTS public.user_problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
    interval_days INTEGER DEFAULT 0,
    ease_factor NUMERIC DEFAULT 2.5,
    repetitions INTEGER DEFAULT 0,
    next_review_date TIMESTAMPTZ DEFAULT NOW(),
    last_reviewed_at TIMESTAMPTZ,
    status VARCHAR DEFAULT 'reviewing', -- 'reviewing', 'mastered'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, problem_id)
);

-- REVIEW_HISTORY TABLE (Audit log of all reviews)
CREATE TABLE IF NOT EXISTS public.review_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL, -- 0 (Again), 1 (Hard), 2 (Good), 3 (Easy)
    ease_factor NUMERIC NOT NULL,
    interval_days INTEGER NOT NULL,
    reviewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_history ENABLE ROW LEVEL SECURITY;

-- POLICIES FOR PROFILES
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- POLICIES FOR PROBLEMS
CREATE POLICY "Anyone can view problems"
    ON public.problems FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can insert problems"
    ON public.problems FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update problems"
    ON public.problems FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can delete problems"
    ON public.problems FOR DELETE
    TO authenticated
    USING (true);

-- POLICIES FOR USER_PROBLEMS
CREATE POLICY "Users can view their own problem progress"
    ON public.user_problems FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own problem progress"
    ON public.user_problems FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own problem progress"
    ON public.user_problems FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own problem progress"
    ON public.user_problems FOR DELETE
    USING (auth.uid() = user_id);

-- POLICIES FOR REVIEW_HISTORY
CREATE POLICY "Users can view their own review history"
    ON public.review_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own review logs"
    ON public.review_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- TRIGGER FOR AUTO-CREATING PROFILE ON USER SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, streak, last_active_date)
    VALUES (new.id, new.email, 0, NULL);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- FEEDBACKS TABLE
CREATE TABLE IF NOT EXISTS public.feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email TEXT,
    type TEXT NOT NULL CHECK (type IN ('Issue', 'Idea', 'Other')),
    message TEXT NOT NULL,
    page_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own feedback"
    ON public.feedbacks FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own feedback"
    ON public.feedbacks FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

