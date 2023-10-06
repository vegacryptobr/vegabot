'use client'
import { AuthProvider } from "../../context/authContext";
import Chat from "../../pages/chat";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";


export default function Home() {
  return (
    <AuthProvider>
      <div className="flex flex-col gap-[20px] min-h-screen bg-[#f5f5f5] items-center justify-center overflow-hidden">
        <Chat />

        <div className="flex max-lg:hidden">
          <HoverCard>
            <HoverCardTrigger className="cursor-pointer">Quer aprender mais sobre o Real Digital?</HoverCardTrigger>
            <HoverCardContent>
              <a href="https://discord.com/invite/D6nMD2CSs6" className="text-[#dc2c2a]">Clique aqui</a> para aprender mais sobre o Real Digital na comunidade da Vega Crypto
            </HoverCardContent>
          </HoverCard>
        </div>

      </div>
        
    </AuthProvider>

  )
}
