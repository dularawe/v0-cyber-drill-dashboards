-- Create Row Level Security policies

-- Users RLS
CREATE POLICY "users_select_own" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_select_all_for_admin" ON public.users FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'super_admin')
);
CREATE POLICY "users_insert_own" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "users_update_own" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Questions RLS (admins can manage)
CREATE POLICY "questions_select_all" ON public.questions FOR SELECT USING (true);
CREATE POLICY "questions_insert_admin" ON public.questions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'super_admin')
);
CREATE POLICY "questions_update_admin" ON public.questions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'super_admin')
);
CREATE POLICY "questions_delete_admin" ON public.questions FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'super_admin')
);

-- X-CONs RLS
CREATE POLICY "xcons_select_own" ON public.xcons FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "xcons_select_all_for_admin" ON public.xcons FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'super_admin')
);
CREATE POLICY "xcons_insert_admin" ON public.xcons FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'super_admin')
);
CREATE POLICY "xcons_update_admin" ON public.xcons FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'super_admin')
);
CREATE POLICY "xcons_delete_admin" ON public.xcons FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'super_admin')
);

-- Leaders RLS
CREATE POLICY "leaders_select_own" ON public.leaders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "leaders_select_for_xcon" ON public.leaders FOR SELECT USING (
  xcon_id IN (SELECT id FROM public.xcons WHERE user_id = auth.uid())
);
CREATE POLICY "leaders_select_for_admin" ON public.leaders FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'super_admin')
);
CREATE POLICY "leaders_insert_admin" ON public.leaders FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'super_admin')
);
CREATE POLICY "leaders_update_admin" ON public.leaders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'super_admin')
);
CREATE POLICY "leaders_delete_admin" ON public.leaders FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'super_admin')
);

-- Drill Sessions RLS
CREATE POLICY "drill_sessions_select_all" ON public.drill_sessions FOR SELECT USING (true);
CREATE POLICY "drill_sessions_insert_admin" ON public.drill_sessions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'super_admin')
);
CREATE POLICY "drill_sessions_update_admin" ON public.drill_sessions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'super_admin')
);
CREATE POLICY "drill_sessions_delete_admin" ON public.drill_sessions FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'super_admin')
);

-- Drill Session Questions RLS
CREATE POLICY "drill_session_questions_select_all" ON public.drill_session_questions FOR SELECT USING (true);
CREATE POLICY "drill_session_questions_insert_admin" ON public.drill_session_questions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'super_admin')
);

-- Answers RLS
CREATE POLICY "answers_select_own" ON public.answers FOR SELECT USING (
  leader_id IN (SELECT id FROM public.leaders WHERE user_id = auth.uid())
);
CREATE POLICY "answers_select_for_xcon" ON public.answers FOR SELECT USING (
  leader_id IN (
    SELECT l.id FROM public.leaders l
    INNER JOIN public.xcons x ON l.xcon_id = x.id
    WHERE x.user_id = auth.uid()
  )
);
CREATE POLICY "answers_select_for_admin" ON public.answers FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'super_admin')
);
CREATE POLICY "answers_insert_leader" ON public.answers FOR INSERT WITH CHECK (
  leader_id IN (SELECT id FROM public.leaders WHERE user_id = auth.uid())
);
CREATE POLICY "answers_update_xcon" ON public.answers FOR UPDATE USING (
  leader_id IN (
    SELECT l.id FROM public.leaders l
    INNER JOIN public.xcons x ON l.xcon_id = x.id
    WHERE x.user_id = auth.uid()
  )
);

-- Leaderboard RLS
CREATE POLICY "leaderboard_select_all" ON public.leaderboard FOR SELECT USING (true);
CREATE POLICY "leaderboard_insert_admin" ON public.leaderboard FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'super_admin')
);
CREATE POLICY "leaderboard_update_admin" ON public.leaderboard FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'super_admin')
);
