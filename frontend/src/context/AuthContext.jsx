import { useEffect,useState,useContext,createContext} from "react";

const AuthContext=createContext(null)

export function AuthProvider({children}){
    const [user,setUser]=useState(null)
    const [token,setToken]=useState(null)
    const [authLoading,setAuthLoading]=useState(true)

    useEffect(()=>{
        const storedToken=localStorage.getItem("access_token")
        const storedUser=localStorage.getItem("user")
        if(storedToken && storedUser){
            setUser(JSON.parse(storedUser))
            setToken(storedToken)
        }
        setAuthLoading(false)
    },[])
    
    const login = (accessToken , userData)=>{
        localStorage.setItem("access_token",accessToken)
        localStorage.setItem("user",JSON.stringify(userData))

        setToken(accessToken)
        setUser(userData)
    }

    const logout =()=>{
        localStorage.removeItem("access_token")
        localStorage.removeItem("user")
        setToken(null)
        setUser(null)
    }
    const values={
        user,
        token,
        authLoading,
        isAuthenticated: !!token,
        login,
        logout
    }

    return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}
export function useAuth(){
    return useContext(AuthContext);
}