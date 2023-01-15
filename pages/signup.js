import React from 'react'
import Head from 'next/head'
import { useContext, useState } from 'react'
import Router from 'next/router'
import AuthContext from '../context/AuthContext'

function Signup() {
    const { signUpWithPassword } = useContext(AuthContext)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const signUp = () => {
        console.log(email.trim(), password)
        signUpWithPassword(email.trim(), password)
        Router.push('/login')
    }

    return (
        <>
            <Head>
                <title>Signup</title>
            </Head>

            <div className='grid justify-center items-center h-screen'>
                <div className='flex-row space-y-4'>
                    <h1 className='text-center text-2xl font-semibold text-[#ffffff]'>Whatsapp</h1>
                    <div className='flex-row space-y-4 bg-[#343A46] p-10 rounded-md'>
                        <h2 className='text-center'>Signup</h2>
                        <div className='flex flex-col space-y-3'>
                            <input onChange={(e) => setEmail(e.target.value)} className='bg-transparent border-b focus:outline-none' type="text" placeholder='Email-id' />
                            <input onChange={(e) => setPassword(e.target.value)} className='bg-transparent border-b focus:outline-none' type="password" placeholder='Password' />
                        </div>
                        <div className='flex justify-center'>
                            <button onClick={signUp} className='bg-[#16181D] p-2 px-6 rounded-md hover:opacity-70'>Sign up</button>
                        </div>
                        <p className='cursor-pointer opacity-40' onClick={() => Router.push('/login')}>Have an account? Log in</p>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Signup