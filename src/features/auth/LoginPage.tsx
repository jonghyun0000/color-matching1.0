import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
export function LoginPage(){const [email,setEmail]=useState('');const [password,setPassword]=useState('');const nav=useNavigate();
const submit=async()=>{const {error}=await supabase.auth.signInWithPassword({email,password}); if(error) return alert(error.message); nav('/');};
return <div className='p-4 space-y-3'><h1 className='text-2xl font-bold'>춘천과팅 로그인</h1><input className='w-full border p-2' placeholder='아이디(email)' value={email} onChange={e=>setEmail(e.target.value)} /><input type='password' className='w-full border p-2' placeholder='비밀번호' value={password} onChange={e=>setPassword(e.target.value)} /><button onClick={submit} className='w-full rounded bg-pink-500 text-white p-2'>로그인</button><Link to='/register' className='text-pink-600'>회원가입</Link></div>}
