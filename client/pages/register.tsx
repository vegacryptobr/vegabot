'use client'
import { Input } from '../src/ui/input'
import { Card } from '../src/ui/card'
import { Button } from '../src/ui/button'
import 'tailwindcss/tailwind.css'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/authContext';

interface RegisterProps {
  onLoginClick: () => void;
}

const Register: React.FC<RegisterProps> = ({ onLoginClick }) => {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  const [loggedCard, setLoggedCard] = useState('absolute top-0 left-0 flex flex-col justify-center items-center bg-black/[0.5] backdrop-blur-sm w-[100vw] h-[100vh]')
  
  const { setError, setLogMessage, setSuccessfulLogin } = useAuth();
  const { successfulLogin, error } = useAuth();

  const [showErrorCard, setShowErrorCard] = useState(false);
  
  const handleRegister = async () => {
    
    const requestBody = {
      email: email,
      pwd: senha,
      type: 'register'
    }
  
    try {
      const response = await fetch('https://chatvegacrypto.rj.r.appspot.com/auth', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(requestBody),
      })
  
      const data = await response.json()
      
      if(data.success) {
        setSuccessfulLogin(true)
        setLoggedCard('hidden')
        setLogMessage(`Confirme o e-mail ${data.email} na sua caixa de entrada`)
      }
      
      if (!data.success) {
        setSuccessfulLogin(false)
        setShowErrorCard(true)
        const erro = data.error.split(':')[6].split('"')[1]
        console.log(erro)
        if(erro == 'WEAK_PASSWORD ') {
          setError('Senha fraca, tente uma mais forte')
        } else if(erro == 'EMAIL_EXISTS') {
          setError('E-mail já cadastrado')
        } else if(erro == 'INVALID_EMAIL') {
          setError('E-mail inválido')
        } else if(erro == 'MISSING_EMAIL') {
          setError('E-mail não informado. Por favor, digite um e-mail')
        } else if(erro == 'MISSING_PASSWORD') {
          setError('Senha não informada. Por favor, digite uma senha')
        }
      }
      
    }catch (err) {
      console.log('Erro ao fazer registro: ' + err)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        handleRegister()
    }
  }

  useEffect(() => {
    if(!successfulLogin) {
      setError(error)
    }
  }, [successfulLogin])

  useEffect(() => {
    if (showErrorCard) {
      const timer = setTimeout(() => {
      setShowErrorCard(false);
    }, 2000);
  
      return () => clearTimeout(timer)
    }
  }, [showErrorCard]);

 
  return (
    <div>
      <Card className={loggedCard}>
        <div className="bg-zinc-100 p-[8vh] rounded-3xl">
          <h2 className='text-center'>Para continuar usado</h2>
          <h1 className='text-center text-[3vh] font-bold uppercase mb-[2vh]'>Registre-se</h1>
          <div onKeyDown={handleKeyPress}>
            <label htmlFor="email">E-mail</label>
            <Input type='email' value={email} onChange={e => setEmail(e.target.value)} required className='mb-[2vh] min-w-[40vh]' id='email' name='email' />
            <label htmlFor="senha">Senha</label>
            <Input type='password' value={senha} onChange={e => setSenha(e.target.value)} required className='mb-[2vh] min-w-[40vh]' id='senha' name='senha'/>
            <div className='flex justify-between items-center text-right'>
              <Button type='submit' className='bg-neutral-300 hover:bg-neutral-400 text-black' onClick={handleRegister}>Registrar</Button>
              <span>Já tem conta?<br /><a className='text-[#dc2c2a] cursor-pointer' onClick={ onLoginClick }> clique aqui </a>para entrar</span>
            </div>
          </div>
          
        </div>
      </Card>

      {showErrorCard && (
        <Card className='absolute top-6 left-[50%] translate-x-[-50%] p-[20px]'>
          {error}
        </Card>
      )}
    </div>
  )
}

export default Register
