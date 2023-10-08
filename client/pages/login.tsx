'use client'
import { Input } from '../src/ui/input'
import { Card } from '../src/ui/card'
import { Button } from '../src/ui/button'
import 'tailwindcss/tailwind.css'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/authContext';


interface LoginProps {
  onRegisterClick: () => void;
}

const Login: React.FC<LoginProps> = ({ onRegisterClick }) => {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')


  const [logCard, setLogCard] = useState('absolute top-0 left-0 flex flex-col justify-center items-center bg-black/[0.5] backdrop-blur-sm	 w-[100vw] h-[100vh]')

  const { setError, setLogMessage, setSuccessfulLogin } = useAuth();
  const { error, successfulLogin } = useAuth();

  const [showErrorCard, setShowErrorCard] = useState(false);


  const handleResetPwd = async () => {
    const requestBody = {
      email: email,
      type: 'reset'
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
        setLogMessage(`E-mail de recuperação enviado para ${data.email}\nLogue novamente após a recuperação`)
      }
      
      if (!data.success) {
        setSuccessfulLogin(false) 
        const erro = data.error.split(':')[6].split('"')[1]
        if(erro == 'EMAIL_NOT_FOUND') {
          setError('E-mail não cadastrado')
        }
        if(erro == 'INVALID_EMAIL') { 
          setError('E-mail inválido')
        }
        if(erro == 'MISSING_EMAIL') {
          setError('E-mail não informado. Por favor, digite um e-mail')
        }
      }
      
    }catch (err) {
      console.log('Erro ao fazer login: ' + err)
    }
    
  }

  const handleLogin = async () => {
    const requestBody = {
      email: email,
      pwd: senha,
      type: 'login'
    }
  
    try {
      const response = await fetch('https://vegachatbot123.rj.r.appspot.com/auth', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(requestBody),
      })
 
      const data = await response.json()
      
      if(data.success) {
        setLogCard('hidden')
        setSuccessfulLogin(true)
        setLogMessage('Aproveite!')
        console.log('Login efetuado com sucesso')
      }
      
      if (!data.success) {
        setShowErrorCard(true)
        const erro = data.error.split(':')[6].split('"')[1]
        if(erro == 'INVALID_PASSWORD') {
          setError('Senha incorreta')
          console.log(erro)
          console.log('Senha incorreta')
        } else if(erro == 'EMAIL_NOT_FOUND') {
          setError('E-mail não cadastrado')
          console.log('E-mail não cadastrado')
        }
      }
      
    }catch (err) {
      console.log('Erro ao fazer login: ' + err)
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
  
      return () => clearTimeout(timer);
    }
  }, [showErrorCard]);
  

  return (
    <div>
      <Card className={logCard}>
        <div className="bg-zinc-100 p-[10vh] rounded-3xl">
          <h2 className='text-center mb-[2vh]'>Entre para continuar usando!</h2>
          <div>
            <label htmlFor="email">E-mail</label>
            <Input type='email' value={email} onChange={e => setEmail(e.target.value)} required className='mb-[2vh]' name='senha' id='email' />
            <label htmlFor="senha">Senha</label>
            <Input type='password' value={senha} onChange={e => setSenha(e.target.value)} required className='mb-[2vh]' name='senha' id='senha' />
            <div className='flex justify-between items-center gap-36'>
              <Button type='submit' onClick={handleLogin}>Entrar</Button>
              <span className='text-[#dc2c2a] cursor-pointer' onClick={handleResetPwd}>Esqueceu a senha?</span>
            </div>
            <span className='mt-[10px]'><a className='text-[#dc2c2a] cursor-pointer' onClick={onRegisterClick}> Clique aqui para fazer o cadastro</a>.</span>
          </div>
        </div>
      </Card>

      {showErrorCard && (
        <Card className='absolute top-6 left-[50%] translate-x-[-50%] p-[20px]'>
            <div className='p-[10px] rounded-3xl'>
              {error}
            </div>
        </Card>
      )}
    </div>
  )
}

export default Login