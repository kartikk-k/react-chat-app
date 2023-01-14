import React from 'react'
import { useContext } from 'react'
import ChatContext from '../context/ChatContext'

function Contacts() {
    let { userContacts } = useContext(ChatContext)

    return (
        <div className='m-4'>
            <div>
                <h1 className='py-2 font-semibold text-xl'>Chats</h1>
                {/* chats */}
                {userContacts ? (
                    <div className='border border-[#343A46] overflow-hidden rounded-md divide-y divide-[#343A46]'>
                        {/* contact */}
                        {userContacts.map((user, index) => (
                            <div key={index} className='py-4 px-4 hover:bg-[#343A46]'>
                                <p>{user.first_user ? user.first_user : user.second_user}</p>
                            </div>
                        ))}
                        {/* demo emails */}
                        {/* <div className='py-4 px-4 hover:bg-[#343A46]'>
                            <p>hellokartikk@gmail.com</p>
                        </div>
                        <div className='py-4 px-4 hover:bg-[#343A46]'>
                            <p>programmingbeast@gmail.com</p>
                        </div> */}
                    </div>
                ) : <p>getting your chats...</p>}
            </div>
        </div>
    )
}

export default Contacts