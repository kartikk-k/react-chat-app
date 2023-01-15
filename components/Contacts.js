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
        <div className='m-4'>
            <div>
                <h1 className='py-2 font-semibold text-xl'>Chats</h1>
                {/* chats */}
                {userContacts && userContacts.length != 0 ? (
                    <div className='chat-box border border-[#343A46] rounded-md divide-y divide-[#343A46]'>
                        {/* contact */}
                        {userContacts.map((user, index) => (
                            <div key={index} className='py-4 px-4 hover:bg-[#343A46]'>
                                <p onClick={() => handleEvent(user.id, user.first_user ? user.first_user : user.second_user)}>{user.first_user ? user.first_user : user.second_user}</p>
                            </div>
                        ))}
                    </div>
                ) : <p>getting your chats...</p>}
            </div>
        </div>
    )
}

export default Contacts