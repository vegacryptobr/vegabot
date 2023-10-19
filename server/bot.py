#openai
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.chat_models import ChatOpenAI

#pinecone
import pinecone
from langchain.vectorstores import Pinecone

#tools
from langchain.tools import Tool

#agente
from langchain.agents import initialize_agent

# retrieval
from langchain.chains import RetrievalQA

#memory_and_prompt
from langchain.memory import ConversationBufferWindowMemory
from langchain.prompts import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)

#os
import os
from dotenv import load_dotenv

load_dotenv()

# setting keys and environments

# os.environ['OPENAI_API_KEY'] = os.environ.get('OPENAI_API_KEY')
os.environ['OPENAI_API_KEY'] = os.getenv('OPENAI_API_KEY')
os.environ["SERPER_API_KEY"] = os.getenv('SERPER_API_KEY')
pinecone_api_key = os.getenv('pinecone_api_key')
pinecone_environment = os.getenv('pinecone_environment')

# setting the llm
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
llm = ChatOpenAI(
    model_name='gpt-3.5-turbo-16k',
    temperature=0.5,
    callbacks=[StreamingStdOutCallbackHandler()],
    streaming=True,
)

# setting pinecone
embeddings = OpenAIEmbeddings()
pinecone.init(api_key=pinecone_api_key, environment=pinecone_environment)
index_name = 'vegabot'
vectorstore = Pinecone.from_existing_index(index_name, embeddings)

# setting memory
conversational_memory = ConversationBufferWindowMemory(
    memory_key='chat_history',
    k=10,
    return_messages=True
)

# prompt template
system_template = """
Eu sou o Vegabot, e trabalho na Vega Crypto. Estou sempre à disposição para ajudar você a compreender o mundo do real digital. Pergunte-me qualquer coisa sobre o
real digital ou a expertise financeira da Vega Crypto. Minha especialidade é esclarecer dúvidas sobre o real digital e oferecer insights sobre a Vega Crypto e o
cenário financeiro em geral. Se uma pergunta estiver além do meu conhecimento, serei transparente sobre meus limites, mas farei o possível para fornecer 
respostas abrangentes com base nas informações que tenho. Não hesite em fazer suas perguntas sobre o real digital, estou aqui para apresentar respostas claras
e esclarecedoras, sempre com um toque de amizade e carisma
"""

system_prompt = SystemMessagePromptTemplate.from_template(system_template)
human_prompt = HumanMessagePromptTemplate.from_template("{input}")
chat_prompt = ChatPromptTemplate.from_messages([system_prompt, human_prompt])

# retrieval tool
qa = RetrievalQA.from_chain_type(
      llm=llm,
      chain_type="stuff",
      retriever=vectorstore.as_retriever(),
)

# fix output format
def format_output(frase):
    pontuacoes = ['!', '.', '?', ';']
    frase_corrigida = ""

    for i in range(len(frase)):
      char = frase[i]
      frase_corrigida += char

      if char in pontuacoes and i < len(frase) - 1 and frase[i + 1] != ' ':
          frase_corrigida += ' '

    frase_corrigida = frase_corrigida.replace("- ", "-")

    return frase_corrigida

# retriever sources function
def sources(q):
  sources = vectorstore.similarity_search_with_relevance_scores(q)
  return [sources[0][0].metadata['source'], sources[1][0].metadata['source']]

# tradutor de entrada e saída
from googletrans import Translator

def detect_language(text):
    text_translator = Translator()
    language = text_translator.detect(text)
    return language.lang


def translate(text, lang):
  try:
    text_translator = Translator()
    translated_text = text_translator.translate(text, dest=lang)
    return translated_text.text
  except Exception as e:
    return('Desculpe, não consigo responder sua pergunta')

# seting tools 

tools = [
    Tool(
        name='Knowledge Base',
        func=qa.run,
        description='Utilize a ferramenta Knowledge Base para responder perguntas sobre o real digital, Vega Crypto e coisas relacionadas.',
        return_direct=True
    ),
]

agent = initialize_agent(
    agent='chat-conversational-react-description',
    tools=tools,
    llm=llm,
    verbose=True,
    max_iterations=4,
    early_stopping_method='generate',
    memory=conversational_memory,
    return_direct=True
)

user_conversations = {}
                                                                                        
def get_response(user_id, text):
    text_language = detect_language(text)
    
    if user_id not in user_conversations:
        # Initialize conversation history for new user
        user_conversations[user_id] = []

    conversation_history = user_conversations[user_id]

    try:
        # Append user input to conversation history
        conversation_history.append(text)

        # Generate response using the conversation history
        answer = agent(chat_prompt.format_prompt(input="\n".join(conversation_history)).to_string())['output']

        final_output = translate(answer, text_language)

        # Append agent response to conversation history
        conversation_history.append(final_output)

        response = { 'result': format_output(final_output), 'source': sources(text) }
        return response
    except Exception as e:
        return { "error": str(e) }