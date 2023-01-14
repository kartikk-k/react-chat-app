import { createContext, useEffect, useState } from "react";
import supabase from "../utils/supabase";
import Router from "next/router";

const AuthContext = createContext()
export default AuthContext

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(<Boolean />)
    const [userData, setUserData] = useState()
    const [isAuthenticated, setIsAuthenticated] = useState()

    useEffect(() => {
        console.log(userData)
        getUserData()
    }, [])

    // sign up with password
    const signUpWithPassword = async (email, password) => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
            })
            data ? console.log(data) : console.log(error)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    // sign in with password
    const signInWithPassword = async (email, password) => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            })
            console.log("data", data)
            if (data.user) {
                setUserData(data.user)
                setIsAuthenticated(true)
                Router.push('/')
                setIsLoading(false)
            } else {
                console.log("error: ", error)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getUserData = async () => {
        setIsLoading(true)
        try {
            let { data, error } = await supabase.auth.getUser()
            console.log("getting user data: ", data)
            if (data != null) {
                setUserData(data.user)
                // setting user position as (first_user OR second_user)
                data.user?.aud === "authenticated" ? setIsAuthenticated(true) : setIsAuthenticated(false)
                setIsLoading(false)
            } else {
                setIsAuthenticated(false)
                console.log("error: ", error)
                setIsLoading(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const signOut = async () => {
        setIsLoading(true)
        try {
            const { error } = await supabase.auth.signOut()
            console.log("sign out")
            setIsAuthenticated(false)
        } catch (error) {
            console.log(error)
        }
        setIsLoading(false)
    }

    const contextData = {
        signUpWithPassword: signUpWithPassword,
        signInWithPassword: signInWithPassword,
        isAuthenticated: isAuthenticated,
        getUserData: getUserData,
        signOut: signOut,
        userData: userData,
    }

    return (
        <AuthContext.Provider value={contextData}>
            {isLoading ? <h1>Loading</h1> : children}
        </AuthContext.Provider>
    )
}