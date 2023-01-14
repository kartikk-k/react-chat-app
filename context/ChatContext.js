import { createContext, useState, useContext, useEffect } from "react";
import supabase from "../utils/supabase";
import AuthContext from "./AuthContext";
import * as EmailValidator from 'email-validator'

const ChatContext = createContext()
export default ChatContext

export const ChatProvider = ({ children }) => {
    const { userData } = useContext(AuthContext)

    const [userContacts, setUserContacts] = useState()
    const [isLoading, setIsLoading] = useState(<Boolean />)

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

    // exporting variables and functions to be used inside app
    const contextData = {
        userContacts: userContacts,
        getContacts: getContacts,
    }

    return (
        <ChatContext.Provider value={contextData}>
            {isLoading ? <h1>Loading</h1> : children}
        </ChatContext.Provider>
    )
}