import React, { useState, useContext, useEffect } from 'react'
import * as EmailValidator from 'email-validator'
import AuthContext from '../context/AuthContext'
import ChatContext from '../context/ChatContext'
import supabase from '../utils/supabase'
import { AvatarIcon, ChatsIcon, MenuIcon, SearchIcon } from './Icons'
import Contacts from './Contacts'

function Sidebar() {
    const { userData } = useContext(AuthContext)
    const { getContacts } = useContext(ChatContext)

    const [isCreateChat, setCreateChat] = useState(false)
    const [newEmail, setNewEmail] = useState(false)

    const [isSidebar, setIsSidebar] = useState()

    // creating new chat/connection
    const createChat = async (email) => {
        console.log("creating chat")
        if (!email) return null
        if (email.trim() === userData.email) return null

        if (EmailValidator.validate(email.trim())) {
            // checking if relationship already exists
            let exist = await chatExist(email)
            console.log("existence of user: ", exist)
            // add chat into db tables
            if (exist === true) {
                console.log("user already exists")
                alert("user already exists")
                setCreateChat(false)
                return null
            }

            if (exist === false) {
                console.log("creating user")
                try {
                    let { data, error } = await supabase
                        .from("chat")
                        .insert({
                            first_user: userData.email,
                            first_user_id: userData.id,
                            second_user: email
                        })
                    if (error) {
                        console.log(error)
                    }
                    else {
                        getContacts()
                        setCreateChat(false)
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        }
    }

    // checking if chat connection already exists?
    const chatExist = async (email) => { // optimise by directly checking if request user exist from userContacts
        console.log("email: ", email)
        let isExist = false
        let user = ''
        for (let i = 1; i <= 2; i++) {
            i === 1 ? user = "first" : user = "second"
            try {
                let { data, error } = await supabase
                    .from("chat")
                    .select("id, first_user, second_user")
                    .eq(`${user}_user`, userData.email) // first it will find all the connections where new user's id is available in first_user row

                console.log("comp data: i", i, " data", data)
                if (data != null) {
                    data.map((chat) => {
                        console.log(chat)
                        if (i === 1) {
                            console.log("second user: ", chat.second_user)
                            if (chat.second_user.trim() === email) {
                                console.log("checking first")
                                isExist = true
                                return isExist
                            }
                        } if (i === 2) {
                            if (chat.first_user.trim() === email) {
                                isExist = true
                                return isExist
                            }
                        }
                    })
                }
            } catch (error) {
                console.log("error checking user existence", error)
            }
        } return isExist
    }


    return (
        <div className='sidebar z-50 w-full md:min-w-[350px] bg-[#23272F] h-auto overflow-scroll'>
            <div className='sticky top-0 bg-[#23272F]'>
                {/* searchbar */}
                <div className='m-4'>
                    <div className='flex items-center p-2 space-x-2 rounded-md searchbar'>
                        <div className='opacity-60'>
                            <SearchIcon />
                        </div>
                        <input type="text" placeholder='search in chats' className='w-full bg-transparent' />
                    </div>
                </div>

                {/* start a new chat button */}
                <div className='px-4'>
                    <button onClick={() => setCreateChat(true)} className='start-btn w-full p-2 rounded-md bg-[#343A46] shadow-md hover:opacity-70'>Start a new chat</button>
                </div>
            </div>

            {/* create chat option */}
            {isCreateChat && (
                <div>
                    <div onClick={() => setCreateChat(false)} className='absolute top-0 z-50 w-full h-full bg-black opacity-80'></div>
                    <div className='absolute z-50 flex items-center justify-center w-full mt-5 top-52 '>
                        <div className='bg-[#343A46] p-10 rounded-md space-x-2'>
                            <h1 className='text-center'>Create new chat</h1>
                            <input type="text" onChange={(e) => setNewEmail(e.target.value)} placeholder='example@gmail.com' className='bg-transparent focus:outline-none bg-[#16181D] p-2 rounded-md m-2' />
                            <div className='flex justify-between'>
                                <button onClick={() => setCreateChat(false)}>Cancel</button>
                                <button onClick={() => createChat(newEmail)}>Create</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <Contacts />
            </div>
        </div>
    )
}

export default Sidebar