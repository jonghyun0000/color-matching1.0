import { useAuth } from '../../hooks/useAuth';
export function MyPage(){const logout=useAuth(s=>s.logout); return <div className='p-4 space-y-2'><h2 className='font-bold text-xl'>마이페이지</h2><p>신고 및 문의는 관리자 이메일 john_1217@naver.com 으로 보내주세요.</p><button className='bg-gray-800 text-white px-3 py-2 rounded' onClick={()=>void logout()}>로그아웃</button></div>}
