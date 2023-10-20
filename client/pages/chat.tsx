'use client'

import '../src/ui/md_style.css'
import React from 'react'
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from "../src/ui/avatar"
import { Button } from "../src/ui/button"
import { Card, CardContent, CardFooter } from "../src/ui/card"
import { Input } from "../src/ui/input"
import { useState, useEffect, useRef } from 'react'
import { ScrollArea } from "../src/ui/scroll-area"
import { Skeleton } from "../src/ui/skeleton"
import Login from './login'
import Register from './register'
import { useAuth } from '../context/authContext'
import MarkdownDisplay from '../src/ui/markdown-display'
import CardTips  from '../src/ui/cardtips'
import { SiInstagram, SiDiscord, SiX } from "react-icons/si";
import { RiSendPlane2Fill } from "react-icons/ri";

function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

let messageId = 0

interface Responses {
    [key: string]: string;
}

const tips_responses: Responses = {
    'O que é o Real Digital?':
        `
O Real Digital, também conhecido como Drex, é uma moeda digital que está sendo desenvolvida pelo Banco Central do Brasil. É uma representação digital da moeda brasileira, o real, e estará disponível em uma plataforma eletrônica controlada pelo banco central.\n
**Aqui estão algumas características importantes do Digital Real:**
1. CBDC: Digital Real é um tipo de CBDC, o que significa que é uma moeda digital emitida por um banco central.Ele fornece confiabilidade, estabilidade e previsibilidade que vêm com regulamentação, semelhante à moeda física.
2. Tecnologia do Ledger distribuída (DLT): o Digital Real é construído com a tecnologia Distributed Ledger, especificamente uma rede descentralizada.Isso significa que as informações não são armazenadas em um único computador, mas em uma rede de computadores que verificam e fornecem acesso simultaneamente às informações, tornando o sistema mais seguro.
3. Contratos inteligentes: o Digital Real permite o uso de contratos inteligentes, que são contratos auto-executados com os termos do contrato diretamente escritos em linhas de código.Os contratos inteligentes permitem transações automatizadas e seguras, eliminando a necessidade de intermediários e reduzindo os custos.
4. Redução dos custos: Um dos benefícios do Real Digital é o potencial de redução de custos.Os contratos inteligentes e o uso de plataformas eletrônicas podem automatizar e simplificar as transações, tornando-as mais eficientes e mais baratas.
5. Acesso aos serviços financeiros tradicionais: o Digital Real pretende facilitar o acesso aos serviços financeiros tradicionais e permitir o desenvolvimento de novos modelos de negócios na plataforma DLT gerenciada pelo banco central.Isso pode potencialmente expandir a inclusão financeira e abrir novas oportunidades para indivíduos e empresas.
É importante observar que o Digital Real ainda está na fase de desenvolvimento, e sua implementação e impacto completos na economia ainda não foram completamente determinados.
    `,

    'O Real Digital é uma criptomoeda?':
        `
Não, o Real Digital não é uma criptomoeda. O Real Digital é uma moeda digital emitida pelo Banco Central do Brasil e é regulada pela autoridade monetária. 
Diferentemente das criptomoedas, o Real Digital não possui a mesma volatilidade de preços e é respaldado pelo Banco Central, oferecendo estabilidade 
e previsibilidade em seu valor. Além disso, o Real Digital tem o objetivo de facilitar o acesso a serviços financeiros tradicionais e 
reduzir custos de transação, enquanto as criptomoedas são tipicamente descentralizadas e não são controladas por uma autoridade central.`,

    'O que é a Vega Crypto?':
        `
Vega Crypto é uma statup Brasileira de consultoria em web3 que oferece serviços de consultoria, pesquisa e educação financeira descentralizada para indivíduos e empresas.
    `,

    'Qual a diferença do Real Digital para o pix?':
        `
# Diferenças entre Real Digital e PIX

O Real Digital e o PIX são duas iniciativas diferentes do Banco Central do Brasil, cada uma com seu próprio objetivo e características. 
Aqui estão as principais diferenças entre os dois:

1. Natureza e função:

- **Real Digital**: É a versão digital da moeda brasileira, o Real. O objetivo é modernizar o sistema monetário, permitindo transações com ativos 
digitais e contratos inteligentes em um ambiente seguro e regulamentado.
- **PIX**: É um sistema de pagamento instantâneo que permite transferências e pagamentos em tempo real, 24/7, sem a necessidade de intermediários. 
PIX não é uma moeda nova, mas uma maneira rápida e eficiente de mover o real existente.

2. Tecnologia:

- **Real Digital**: Opera em uma plataforma distribuída de tecnologia do Ledger (DLT), que fornece um sistema seguro e descentralizado para gravar transações.
- **PIX**: É baseado em uma infraestrutura de processamento centralizada, mas com operações quase instantâneas.

3. Regulamentação e emissão:

- **Real Digital**: Será emitido e regulamentado pelo Banco Central, servindo como uma extensão digital da moeda física.
- **PIX**: Não envolve a emissão de uma nova moeda. É simplesmente um meio de transferir e pagar usando o real existente.

4. Casos de uso:

- **Real Digital**: Pretende facilitar transações com ativos digitais e contratos inteligentes, além de outras aplicações financeiras avançadas, 
para otimizar e fornecer mais serviços financeiros aos brasileiros.
- **PIX**: Concentra-se em transferências e pagamentos rápidos, entre indivíduos, indivíduos e empresas ou entre empresas.

Em resumo, enquanto o Real Digital é uma representação digital da moeda brasileira com potencial para revolucionar o sistema financeiro e monetário, 
o PIX é simplesmente um sistema de pagamento que já transformou como os brasileiros transferem dinheiro e efetuam pagamentos em suas vidas diárias.
    `,

    'Quais os principais benefícios do Real Digital?':
        `
**Os principais benefícios do Real Digital incluem:**
* Facilitação do acesso a serviços financeiros tradicionais, especialmente para pessoas sem acesso a contas bancárias.
* Redução de custos de transação, tornando as transações mais eficientes e econômicas.
* Maior segurança e proteção contra fraudes, devido à tecnologia de criptografia utilizada.
* Possibilidade de uso de contratos inteligentes, que automatizam e garantem a execução de transações com base em condições pré-definidas.
* Potencial para impulsionar a inovação financeira e o desenvolvimento de novos modelos de negócios.
É importante ressaltar que o Real Digital está em fase de desenvolvimento e sua implementação completa ainda está por vir. Os benefícios mencionados são baseados nas expectativas e nas possibilidades que a moeda digital pode trazer.
    `,

    'Quais os riscos do Real Digital?':
        `
**Os riscos do Real Digital podem incluir:**
* Possíveis vulnerabilidades de segurança que podem ser exploradas por hackers e cibercriminosos.
* Desafios técnicos e operacionais, como a escalabilidade da rede e a interoperabilidade com outros sistemas financeiros.
* Preocupações relacionadas à privacidade e proteção de dados, uma vez que as transações digitais podem envolver a coleta e o armazenamento de 
informações pessoais.
É fundamental que o Banco Central adote medidas robustas de segurança e privacidade para mitigar esses riscos e garantir a confiança dos usuários no Real Digital.
    
    `
};

export default function Chat() {
    const [isLoginOpen, setIsLoginOpen] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState<any[]>([])
    const messageEndRef = useRef<HTMLDivElement>(null)
    const [userId, setUserId] = useState(0)
    const [tipsView, setTipsView] = useState('')
    const { successfulLogin, logMessage } = useAuth();
    const [loginMessage, setLoginMessage] = useState('')
    const [showLoginMessage, setShowLoginMessage] = useState(false);

    useEffect(() => {

    const initializeConnection = async () => {
            setUserId(getRandomInt(1, 1000000))
            await fetch('https://chatvegacrypto.rj.r.appspot.com/init', {
                method: 'GET',
            });
            console.log('Connection initialized')
        };
    
        initializeConnection();
    }, []);


    const handleLogin = () => {
        if (!isLoginOpen) {
            setIsLoginOpen(true)
        } else {
            setIsLoginOpen(false)
        }
    }

    const handleInput = async () => {
        setInput('')

        if (input === '') {
            return
        }

        messageId++
        const newMessage = { sender: 'you', content: input, messageId: messageId }
        setMessages([...messages, newMessage])

        if (messageId === 1) {
            if (tips_responses.hasOwnProperty(input)) {
                messageId++
                const timer = setTimeout(() => {
                    let response: string = tips_responses[input];
                    const newResponse = { sender: 'vegabot', content: response }
                    setMessages([...messages, newMessage, newResponse])
                }, 3000);
            } else {

            }
        }

        const requestBody = { input: input, userId: userId }

        try {
            setIsLoading(true)
            setTipsView('flex hidden')
            const response = await fetch('https://chatvegacrypto.rj.r.appspot.com/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            })

            if(messageId === 2) {
                return
            }

            if (!response.ok) {
                throw new Error(`request failed with status ${response.status}`)
            }

            let data = await response.json()

            if ('error' in data) {
                messageId++
                let erro = data.error
                let newContent = (erro.split('LLM output: ')[1])
                const newResponse = { sender: 'vegabot', content: newContent}
                setMessages([...messages, newMessage, newResponse])
            } else {
                messageId++
                let newContent = data.result
                console.log(newContent)

                let source = data.source
                const newResponse = { sender: 'vegabot', content: newContent, sources: source}
                setMessages([...messages, newMessage, newResponse])
            }

        } catch (error: any) {
            if (error instanceof Error) {
                console.error('Erro: ', error.message)
            } else {
                console.error('Erro desconhecido: ', error)
            }
        }

    }
    
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleInput()
        }
    }

    useEffect(() => {
        messageEndRef.current?.scrollIntoView()
        messages.map((message) => (
            message.sender === "vegabot" ? setIsLoading(false) : setIsLoading(true)
        ))
    }, [messages])

    useEffect(() => {
        handleInput()
    }, [tipsView])

    useEffect(() => {
        if (successfulLogin) {
            setLoginMessage(logMessage)
            setShowLoginMessage(true)
        }
    }, [successfulLogin])

    useEffect(() => {
        if (showLoginMessage) {
            const timer = setTimeout(() => {
                setShowLoginMessage(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [showLoginMessage])

    return (
        <div>
            <div className='flex rounded-[35px] max-lg:h-screen'>
                <div className="h-[85vh] w-[15vw] bg-[#1a1a1a] rounded-l-[2vh] max-lg:rounded-none max-lg:h-[80px] max-lg:hidden">
                    <div className='flex flex-col items-center h-full p-[4.5vh] overflow-hidden relative'>
                        <Image src='/images/logo.png' className='h-[15vh] w-auto' width={400} height={400} alt="" />
                        <div className='flex'>
                            <a href='https://www.instagram.com/vegacrypto/' target='_blank' className='opacity-50 hover:opacity-100 cursor-pointer p-5'><SiInstagram fill='#dd2c2a' /></a>
                            <a href='https://discord.com/invite/Qw3ycUFKKD' target='_blank' className='opacity-50 hover:opacity-100 cursor-pointer p-5'><SiDiscord fill='#dd2c2a' /></a>
                            <a href='https://twitter.com/Vegacrypto_' target='_blank' className='opacity-50 hover:opacity-100 cursor-pointer p-5'><SiX fill='#dd2c2a'/></a>
                        </div>
                    
                    </div>

                </div>
                <Card className="flex flex-col lg:w-[50vw] border-r-[1.3vh] border-b-[1.3vh] bg-[transparent] border-t-[1.3vh] border-[#1a1a1a] rounded-r-[2vh] rounded-l-none max-lg:rounded-none max-lg:border-0 relative ">
                    <CardContent className='flex flex-col items-center'>
                        <ScrollArea className="h-[75vh] w-full px-[2vw] max-lg:h-[93vh] max-lg:w-screen max-lg:px-[10vw]" >
                            <div className={tipsView}>
                                <h1 className='text-neutral-800 text-[3rem] font-extrabold text-center mt-[7%]'>VEGABOT</h1>

                                <div className='flex flex-wrap justify-center gap-[5vh] mt-[5vh] max-lg:flex-nowrap max-lg:flex-col max-lg:mt-10'>
                                    <CardTips text='O que é o Real Digital?' onClick={() => {
                                        setInput('O que é o Real Digital?')
                                        setTipsView('flex hidden')
                                    }} />
                                    
                                    <CardTips text='O Real Digital é uma criptomoeda?' onClick={() => {
                                        setInput('O Real Digital é uma criptomoeda?')
                                        setTipsView('flex hidden')
                                    }} />

                                    <CardTips text='O que é a Vega Crypto?' onClick={() => {
                                        setInput('O que é a Vega Crypto?')
                                        setTipsView('flex hidden')
                                    }} />

                                    <CardTips text='Qual a diferença do Real Digital para o pix?' onClick={() => {
                                        setInput('Qual a diferença do Real Digital para o pix?')
                                        setTipsView('flex hidden')
                                    }} />
                                    
                                    <CardTips text='Quais os principais benefícios do Real Digital?' onClick={() => {
                                        setInput('Quais os principais benefícios do Real Digital?')
                                        setTipsView('flex hidden')
                                    }} />
                                    
                                    <CardTips text='Quais os riscos do Real Digital?' className='max-lg:hidden' onClick={() => {
                                        setInput('Quais os riscos do Real Digital?')
                                        setTipsView('flex hidden')
                                    }} />

                                </div>

                            </div>

                            {messages.map((message, index) => (
                                <div key={index}>
                                    {message.sender === 'you' && (
                                        <div className='flex gap-[2vh] justify-end mt-[5vh] mb-5'>
                                            <Card className="max-w-[85%] bg-zinc-800 text-neutral-300 rounded-[3vh]">
                                                <CardContent className="flex flex-wrap min-h-[5vh] max-w-[100%] px-[1vw] py-[1.4vh] text-[1.5vh] max-lg:text-sm max-lg:px-4" >
                                                    {message.content}
                                                </CardContent>
                                            </Card>

                                        
                                        </div>
                                    )}


                                    {message.messageId === messages.length && (
                                        isLoading && (
                                            <div className='flex items-start gap-[2vh] mt-[2vh] mb-5 '>
                                                <Skeleton className="h-[4.2vh] w-[4.2vh] rounded-full max-lg:hidden bg-neutral-200" />
                                                <Skeleton className="min-h-[5vh] px-[2vh] py-[1.4vh] text-[1.5vh] max-lg:text-sm text-zinc-800 rounded-[3vh] bg-neutral-200">
                                                    Digitando...
                                                </Skeleton>
                                            </div>
                                        )
                                    )}

                                    {message.sender == 'vegabot' && (
                                        <div key={index} className='flex gap-[2vh] mt-[2vh] mb-5'>
                                            <Avatar className='h-[4.2vh] w-[4.2vh] text-[1.5vh] max-lg:text-sm max-lg:hidden'>
                                                <AvatarFallback className='bg-neutral-400 text-neutral-200 m-auto'>V</AvatarFallback>
                                                <AvatarImage src='images/logo.png' className='m-auto'></AvatarImage>
                                            </Avatar>
                                            <Card className="lg:max-w-[85%] bg-transparent text-[#333333] rounded-[3vh] shadow-inner hover:border-black hover:ease-in-out">
                                                <CardContent className="flex flex-wrap min-h-[5vh] max-w-[100%] lg:px-[1vw] lg:py-[1.4vh] text-[1.5vh] max-lg:text-sm p-[20px]">
                                                    <MarkdownDisplay content={message.content} />
                                                </CardContent>
                                            </Card>

                                            {/* <Accordion type="single" className='max-w-[70%] h-8 bg-zinc-800 rounded-b-3xl' collapsible>
                                                <AccordionItem value="item-1">
                                                    <AccordionTrigger><span style={{color:'#DCDCDC', margin: '-50% auto'}}>Fontes:</span></AccordionTrigger>
                                                        <AccordionContent>
                                                            <div className='text-center '>
                                                                <a href={message.sources[0]}>{message.sources[0]}</a><br />
                                                                <a href={message.sources[1]}>{message.sources[1]}</a>
                                                            </div>
                                                        </AccordionContent>
                                                </AccordionItem>
                                            </Accordion> */}
                                        </div>
                                    )}
                                </div>

                            ))}

                            <div ref={messageEndRef} />
                        </ScrollArea>
                        <CardFooter className='bottom-[0vh] absolute'>
                                {isLoading ? (
                                    <div className="flex gap-[1vh]" >
                                        <Input type='text' className='bg-neutral-200 pl-[1.5vh] text-[1.5vh] text-neutral-800 rounded-[1vh] w-[35vw] h-[5vh] max-lg:h-[40px] placeholder:text-neutral-600 placeholder:text-sm max-lg:text-sm max-lg:w-[80vw]' placeholder="Aguarde um momento enquanto eu processo sua resposta" value={input} onChange={e => setInput(e.target.value)} />
                                        <Button 
                                        type="submit" 
                                        className="bg-neutral-200 rounded-[1vh] lg:h-[5vh] lg:w-[3vw] hover:bg-neutral-400" 
                                        > 
                                            <RiSendPlane2Fill fill='#c2c2c' /> 
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex gap-[1vh]" >
                                        <Input type='text' className='bg-neutral-200 pl-[1.5vh] text-[1.5vh] focus:ring-1 ring-neutral-900 text-black rounded-[1vh] w-[35vw] h-[5vh] max-lg:h-[40px] placeholder:text-neutral-600 placeholder:text-sm max-lg:text-sm max-lg:w-[80vw]' placeholder="Me faça uma pergunta sobre o Real Digital" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyPress} />
                                        <Button 
                                        type="submit" 
                                        className="bg-neutral-200 rounded-[1vh] lg:h-[5vh] lg:w-[3vw] hover:bg-neutral-400" 
                                        onClick={handleInput}> 
                                            <RiSendPlane2Fill fill='#c2c2c' /> 
                                        </Button>
                                    </div>
                                )}
                        </CardFooter>
                    </CardContent>
                    
                </Card>
            </div>

            {showLoginMessage && (
                <Card className='absolute top-6 left-[50%] translate-x-[-50%] p-[20px]'>
                    {loginMessage}
                </Card>
            )}

            {messageId > 7 && (
                <>
                    {isLoginOpen ? (
                        <Register onLoginClick={handleLogin} />
                    ) : (
                        <Login onRegisterClick={handleLogin} />
                    )}
                </>
            )}
        </div>
    )
}