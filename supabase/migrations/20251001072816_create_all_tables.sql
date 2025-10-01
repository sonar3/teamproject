/*
  # Create all application tables

  ## Tables Created
  
  ### 1. employees (직원 관리)
    - id (uuid, primary key)
    - name (text) - 직원명
    - email (text, unique) - 이메일
    - password (text) - 비밀번호
    - gender (text) - 성별 (남/여)
    - position (text) - 직급
    - project (text) - 프로젝트명
    - start_date (date) - 입사일
    - end_date (date, nullable) - 퇴사일
    - grade (text) - 권한 등급 (일반직원/리더/최고관리자)
    - is_first_login (boolean) - 최초 로그인 여부
    - favorite_foods (text[]) - 선호 음식
    - interests (text[]) - 관심사
    - created_at, updated_at (timestamptz)

  ### 2. notices (공지사항)
    - id (uuid, primary key)
    - title (text) - 제목
    - content (text) - 내용
    - author_id (text) - 작성자 ID
    - author_name (text) - 작성자명
    - is_important (boolean) - 중요 공지 여부
    - view_count (integer) - 조회수
    - created_at, updated_at (timestamptz)

  ### 3. blog_posts (블로그)
    - id (uuid, primary key)
    - title (text) - 제목
    - content (text) - 내용
    - excerpt (text) - 요약
    - author_id (text) - 작성자 ID
    - author_name (text) - 작성자명
    - author_grade (text) - 작성자 권한
    - source (text) - 작성 방식 (editor/file)
    - file_name (text, nullable) - 파일명
    - tags (text[]) - 태그
    - is_published (boolean) - 발행 여부
    - view_count (integer) - 조회수
    - published_at (timestamptz, nullable) - 발행일
    - created_at, updated_at (timestamptz)

  ### 4. reports (보고서)
    - id (uuid, primary key)
    - title (text) - 제목
    - content (text) - 내용
    - author_id (text) - 작성자 ID
    - author_name (text) - 작성자명
    - author_grade (text) - 작성자 권한
    - category (text) - 카테고리
    - status (text) - 상태
    - view_count (integer) - 조회수
    - created_at, updated_at (timestamptz)

  ### 5. report_threads (보고서 댓글)
    - id (uuid, primary key)
    - report_id (uuid, foreign key) - 보고서 ID
    - author_id (text) - 작성자 ID
    - author_name (text) - 작성자명
    - content (text) - 댓글 내용
    - created_at (timestamptz)

  ### 6. vacations (휴가 관리)
    - id (uuid, primary key)
    - employee_id (text) - 직원 ID
    - employee_name (text) - 직원명
    - vacation_type (text) - 휴가 종류
    - start_date (date) - 시작일
    - end_date (date) - 종료일
    - reason (text) - 사유
    - status (text) - 상태 (대기/승인/반려)
    - created_at, updated_at (timestamptz)

  ### 7. equipments (장비 관리)
    - id (uuid, primary key)
    - name (text) - 장비명
    - type (text) - 장비 유형
    - status (text) - 상태 (사용가능/사용중/수리중/폐기)
    - holder_id (text, nullable) - 보유자 ID
    - holder_name (text, nullable) - 보유자명
    - specs (text, nullable) - 사양
    - purchase_date (date, nullable) - 구매일
    - created_at, updated_at (timestamptz)

  ### 8. collaboration_tools (협업툴 관리)
    - id (uuid, primary key)
    - name (text) - 툴 이름
    - description (text) - 설명
    - url (text) - URL
    - icon (text, nullable) - 아이콘
    - category (text) - 카테고리
    - created_at, updated_at (timestamptz)

  ## Security
    - RLS enabled on all tables
    - Policies for authenticated users only
*/

-- 1. employees table
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  gender text NOT NULL CHECK (gender IN ('남', '여')),
  position text NOT NULL,
  project text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  grade text NOT NULL CHECK (grade IN ('일반직원', '리더', '최고관리자')),
  is_first_login boolean DEFAULT true,
  favorite_foods text[],
  interests text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read employees"
  ON employees FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert employees"
  ON employees FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update employees"
  ON employees FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete employees"
  ON employees FOR DELETE
  TO authenticated
  USING (true);

-- 2. notices table
CREATE TABLE IF NOT EXISTS notices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author_id text NOT NULL,
  author_name text NOT NULL,
  is_important boolean DEFAULT false,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read notices"
  ON notices FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert notices"
  ON notices FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update notices"
  ON notices FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete notices"
  ON notices FOR DELETE
  TO authenticated
  USING (true);

-- 3. blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  excerpt text NOT NULL,
  author_id text NOT NULL,
  author_name text NOT NULL,
  author_grade text NOT NULL CHECK (author_grade IN ('일반직원', '리더', '최고관리자')),
  source text NOT NULL CHECK (source IN ('editor', 'file')),
  file_name text,
  tags text[] DEFAULT '{}',
  is_published boolean DEFAULT false,
  view_count integer DEFAULT 0,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read blog_posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert blog_posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update blog_posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete blog_posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (true);

-- 4. reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author_id text NOT NULL,
  author_name text NOT NULL,
  author_grade text NOT NULL CHECK (author_grade IN ('일반직원', '리더', '최고관리자')),
  category text NOT NULL,
  status text DEFAULT '진행중',
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read reports"
  ON reports FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert reports"
  ON reports FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update reports"
  ON reports FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete reports"
  ON reports FOR DELETE
  TO authenticated
  USING (true);

-- 5. report_threads table
CREATE TABLE IF NOT EXISTS report_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  author_id text NOT NULL,
  author_name text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE report_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read report_threads"
  ON report_threads FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert report_threads"
  ON report_threads FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update report_threads"
  ON report_threads FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete report_threads"
  ON report_threads FOR DELETE
  TO authenticated
  USING (true);

-- 6. vacations table
CREATE TABLE IF NOT EXISTS vacations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id text NOT NULL,
  employee_name text NOT NULL,
  vacation_type text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text NOT NULL,
  status text DEFAULT '대기',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE vacations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read vacations"
  ON vacations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert vacations"
  ON vacations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update vacations"
  ON vacations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete vacations"
  ON vacations FOR DELETE
  TO authenticated
  USING (true);

-- 7. equipments table
CREATE TABLE IF NOT EXISTS equipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  status text DEFAULT '사용가능',
  holder_id text,
  holder_name text,
  specs text,
  purchase_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE equipments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read equipments"
  ON equipments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert equipments"
  ON equipments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update equipments"
  ON equipments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete equipments"
  ON equipments FOR DELETE
  TO authenticated
  USING (true);

-- 8. collaboration_tools table
CREATE TABLE IF NOT EXISTS collaboration_tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  url text NOT NULL,
  icon text,
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE collaboration_tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read collaboration_tools"
  ON collaboration_tools FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert collaboration_tools"
  ON collaboration_tools FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update collaboration_tools"
  ON collaboration_tools FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete collaboration_tools"
  ON collaboration_tools FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
CREATE INDEX IF NOT EXISTS idx_employees_grade ON employees(grade);
CREATE INDEX IF NOT EXISTS idx_notices_created_at ON notices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_report_threads_report_id ON report_threads(report_id);
CREATE INDEX IF NOT EXISTS idx_vacations_employee_id ON vacations(employee_id);
CREATE INDEX IF NOT EXISTS idx_equipments_status ON equipments(status);
