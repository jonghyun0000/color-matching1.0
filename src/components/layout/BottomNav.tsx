import { Link } from 'react-router-dom';
const items = [['/','홈'],['/teams','팀등록'],['/requests','신청내역'],['/reviews','후기'],['/mypage','마이페이지']];
export function BottomNav(){return <nav className='fixed bottom-0 left-0 right-0 bg-white border-t'><div className='max-w-md mx-auto grid grid-cols-5'>{items.map(([to,label])=><Link key={to} to={to} className='p-3 text-xs text-center'>{label}</Link>)}</div></nav>}
