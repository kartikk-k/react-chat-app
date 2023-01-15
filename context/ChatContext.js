import { createContext, useState, useContext, useEffect } from "react";
import supabase from "../utils/supabase";
import AuthContext from "./AuthContext";

const ChatContext = createContext()
export default ChatContext

export const ChatProvider = ({ children }) => {
    const { userData } = useContext(AuthContext)

    const [userContacts, setUserContacts] = useState()
    const [chatId, setChatId] = useState()
    const [chatEmail, setChatEmail] = useState()
    const [messages, setMessages] = useState([])
    const [isLoading, setIsLoading] = useState(<Boolean />)
    const [chatsLoading, setChatsLoading] = useState(<Boolean />)

    useEffect(() => {
        getContacts()
    }, [])

    // getting logged in user's connected users
    const getContacts = async () => {
        // -------------------------------------
        // database table key rows (name: chat) 
        // id -- first_user -- second_user      
        // -------------------------------------

        setIsLoading(true)
        let user = 0

        // declaring empty array which will later be used to concat as logged in user can be positioned as first_user or second_user
        let contacts = []

        // looping through both rows to get all logged in user's contacts/connections
        for (let i = 1; i <= 2; i++) {
            i === 1 ? user = "first" : user = "second"
            try {
                const { data, error } = await supabase
                    .from("chat")
                    .select(`id, ${i === 1 ? "second" : "first"}_user`)
                    .eq(`${user}_user`, userData.email)

                if (data && data != null) {
                    console.log("data: ", data)
                    if (data.length != 0) {
                        contacts = contacts.concat(data)
                    }
                }
            } catch (error) {
                console.log("error fetching contacts", error)
            }
        }
        console.log("contacts: ", contacts)
        setUserContacts(contacts)
        setIsLoading(false)
    }


    // get messages from particular chat
    const getChatMessages = async (id) => {
        setChatsLoading(true)
        try {
            let { data, error } = await supabase
                .from("messages")
                .select("message, sender")
                .eq("chat_id", id)
                .order('id', { ascending: true })

            setMessages(data)
            console.log("messages: ", data)
        } catch (error) {
            console.log("error getting messages", error)
        }
        setChatsLoading(false)
    }

    const getChatEmail = (email) => {
        setChatEmail(email)
    }

    const sendChatMessages = async (message) => {
        let { data, error } = await supabase
            .from("messages")
            .insert([{
                message: message,
                chat_id: chatId,
                sender: userData.email
            }])
    }

    // tracking for realtime message updates
    useEffect(() => {
        const subscription = supabase
            .channel('public:messages')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' },
                payload => {
                    console.log("Changes received: ", payload)
                    // setMessages(payload.new)
                    if (payload.new.chat_id === chatId) {
                        if (messages) {
                            setMessages(messages.concat(payload.new))
                        } else {
                            setMessages(payload.new)
                        }
                    }
                })
            .subscribe()

        return () => {
            supabase.removeChannel(subscription)
        }
    }, [messages])

    // tracking for realtime user updates
    useEffect(() => {
        const subscription = supabase
            .channel('public:chat')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'chat' },
                payload => {
                    console.log("Changes received: ", payload)
                    if (userContacts) {
                        setUserContacts(userContacts.concat(payload.new))
                    } else {
                        setUserContacts(payload.new)
                    }
                })
            .subscribe()

        return () => {
            supabase.removeChannel(subscription)
        }
    }, [userContacts])

    // exporting variables and functions to be used inside app
    const contextData = {
        userContacts: userContacts,
        getContacts: getContacts,
        setChatId: setChatId,
        chatId: chatId,
        messages: messages,
        sendChatMessages: sendChatMessages,
        getChatMessages: getChatMessages,
        chatsLoading: chatsLoading,
        setChatEmail: setChatEmail
    }

    return (
        <ChatContext.Provider value={contextData}>
            {isLoading ? <h1>Loading</h1> : children}
        </ChatContext.Provider>
    )
}