import React from 'react'
import { useContext } from 'react'
import ChatContext from '../context/ChatContext'

function Contacts() {
    let { userContacts, setChatId, setChatEmail } = useContext(ChatContext)

    const handleEvent = (id, email) => {
        setChatEmail(email)
        setChatId(id)
        console.log(email)
    }

    return (
        <div className='z-50 m-4'>
            <div>
                <h1 className='py-2 text-xl font-semibold'>Chats</h1>
                {/* chats */}
                {userContacts && userContacts.length != 0 ? (
                    <div className='chat-box cursor-pointer border border-[#343A46] rounded-md divide-y divide-[#343A46]'>
                        {/* contact */}
                        {userContacts.map((user, index) => (
                            <div key={index} className='py-4 px-4 hover:bg-[#343A46]'>
                                <p onClick={() => handleEvent(user.id, user.first_user ? user.first_user : user.second_user)}>{user.first_user ? user.first_user : user.second_user}</p>
                            </div>
                        ))}
                    </div>
                ) : <div>
                    <p>getting your chats...</p>
                    <p>add contacts if new user!</p>
                </div>
                }
            </div>
        </div>
    )
}

export default Contacts