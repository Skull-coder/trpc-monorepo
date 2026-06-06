"use client"
import { getUser } from "~/hooks/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const {user} = getUser()

  useEffect(() => {
    if(!user || !user.id){
      router.replace("/login")
    }
    else{
      router.replace("/dashboard")
    }
  
    
  }, [user, router])
  

  return (
    <main className="min-h-screen min-w-screen flex justify-center items-center">
      <div>
        <h1 className="text-3xl">Streamyst - Stream in Style</h1>
        <h2> {JSON.stringify(user)} </h2>
      </div>
    </main>
  );
}
