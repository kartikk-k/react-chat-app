import Head from 'next/head'
import React, { useEffect } from 'react'
import { useContext, useState } from 'react'
import AuthContext from '../context/AuthContext'
import Router from 'next/router'

function Login() {
    const { signInWithPassword, isAuthenticated } = useContext(AuthContext)

    useEffect(() => {
        console.log(isAuthenticated)
        if (isAuthenticated) {
            Router.push('/')
        }
    }, [isAuthenticated])

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const signIn = () => {
        signInWithPassword(email.trim(), password)
    }

    return (
        <>
            <Head>
                <title>Login</title>
            </Head>

            <div className='grid justify-center items-center h-screen'>
                <div className='flex-row space-y-4'>
                    <h1 className='text-center text-2xl font-semibold text-[#ffffff]'>Whatsapp</h1>
                    <div className='flex-row space-y-4 bg-[#343A46] p-10 rounded-md'>
                        <h2 className='text-center'>Login</h2>
                        <div className='flex flex-col space-y-3'>
                            <input onChange={(e) => setEmail(e.target.value)} className='bg-transparent border-b focus:outline-none' type="text" placeholder='Email-id' />
                            <input onChange={(e) => setPassword(e.target.value)} className='bg-transparent border-b focus:outline-none' type="password" placeholder='Password' />
                        </div>
                        <div className='flex justify-center'>
                            <button onClick={signIn} className='bg-[#16181D] p-2 px-6 rounded-md hover:opacity-70'>Sign in</button>
                        </div>
                        <p className='cursor-pointer opacity-40' onClick={() => Router.push('/signup')}>Don't have an account? Sign up</p>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Login