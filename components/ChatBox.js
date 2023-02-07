import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import ChatContext from '../context/ChatContext'
import AuthContext from '../context/AuthContext'
import { LoadingIcon, SettingIcon } from './Icons'
import { RefreshIcon } from './Icons'


function ChatBox({ }) {
    const { userData } = useContext(AuthContext)
    const { getChatMessages, chatId, messages, sendChatMessages, chatsLoading } = useContext(ChatContext)

    const [message, setMessage] = useState()

    useEffect(() => {
        getChatMessages(chatId)
    }, [chatId])

    const handleMessageSent = () => {
        if (message) {
            sendChatMessages(message)
            setMessage(null)
        }
    }

    return (
        <div className='relative justify-end w-full min-h-screen grid-rows-6 overflow-auto'>
            {/* header */}
            <div className='flex justify-between z-40 px-2 items-center h-14 bg-[#343A46] shadow-lg'>
                <div className='hover:opacity-60'>
                    <p className='text-white'>Chatbox</p>
                </div>
                <div className='flex space-x-2'>
                    <div className='hover:opacity-60' onClick={() => getChatMessages(chatId)}>
                        <RefreshIcon />
                    </div>
                    <div className='hover:opacity-60'>
                        <SettingIcon />
                    </div>
                </div>
            </div>

            {/* get chat messages */}
            {!chatsLoading ? (
                <div className='max-h-screen pb-5 overflow-auto'>

                    {/* chats */}
                    <div className=' bg-[#23272F]'>
                        <div className='w-full pb-6 overflow-auto'>
                            {messages && messages.length != 0 ? (
                                <div className='px-4 pb-20'>
                                    {messages.map((message, index) => (
                                        <div key={index}>
                                            {message.sender === userData.email ? (
                                                <p className='px-5 py-1 my-1 text-right'> <span className='px-2 text-xs font-semibold opacity-60'>You:</span> {message.message}</p>
                                            ) : (
                                                <p className='px-5 py-1 my-1'><span className='px-2 text-xs font-semibold opacity-60'>Other:</span> {message.message}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) :
                                <div className='mt-5'>
                                    <p className='text-center'>No chats exist</p>
                                    <p className='text-center'>Select chat if not selected</p>
                                </div>
                            }
                        </div>
                    </div>



                </div>

            ) : <div className='flex justify-center pt-5'>
                <LoadingIcon className="animate-spin" />
            </div>
            }

            {/* message box */}
            {!chatsLoading && (
                <div className=' w-full absolute bottom-24 md:bottom-14 left-0 bg-[#23272F] pb-4 overflow-scroll'>
                    {messages && (
                        <div className='flex px-5 space-x-4'>
                            <input type="text" onChange={(e) => setMessage(e.target.value)} value={message != null ? message : ''} placeholder='type your message here' className='flex-1 bg-[#16181D] px-5 py-2 rounded-md focus:outline-none' />
                            <button onClick={handleMessageSent} className='bg-[#343A46] px-5 rounded-md'>send</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default ChatBox




{/* <p key={index} className={message.sender === userData.email ? 'text-right' : 'text-left'}>{message.message}</p> */ }