import React from 'react'
import { useAuth, } from '../hooks/use.auth'
import { Navigate } from 'react-router';

const Protected = ({children}: {children: React.ReactNode}) => {
  const {loading,user} = useAuth();
  
  if(loading){
    return <main><h1>Loading....</h1></main>
  }
   if(!user){
    return <Navigate to="/login" />
  }
  return (
    <div>
      {children}
    </div>
  )
}

export default Protected
