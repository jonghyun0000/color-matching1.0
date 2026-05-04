# 춘천과팅 (React + Supabase + Vercel)

## 실행
1. `cp .env.example .env.local` 후 값 입력
2. `npm install`
3. `npm run dev`

## 배포
- GitHub push
- Vercel에서 Import Project
- Environment Variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

## Supabase 설정
- migration 실행: `supabase db push`
- private bucket `student-ids` 생성
- storage policy: 사용자 본인 경로(`auth.uid()/...`)만 업/조회 허용, admin은 signed URL로 조회

## 관리자 계정 초기화
1. Supabase Auth에서 admin 이메일 계정 생성
2. `profiles.role='admin'`으로 업데이트
3. 코드 하드코딩 금지

## 보안 체크리스트
- `.env.local` gitignore 포함
- service role key 클라이언트 금지
- 모든 테이블 RLS 활성화
- 연락처는 매칭 승인 전 노출 금지
- 학생증 버킷 private
