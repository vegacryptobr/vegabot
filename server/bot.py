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

#news tool
from langchain.utilities import GoogleSerperAPIWrapper

#retriever
from langchain.chains import RetrievalQA

#memory_and_prompt
from langchain.memory import ConversationBufferWindowMemory
from langchain.prompts import PromptTemplate
from langchain.prompts import (
    ChatPromptTemplate,
    PromptTemplate,
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
index_name = 'indexvegacrypto'
vectorstore = Pinecone.from_existing_index(index_name, embeddings)

# setting memory
conversational_memory = ConversationBufferWindowMemory(
    memory_key='chat_history',
    k=10,
    return_messages=True
)

# prompt template
system_template = """
Introducing: Vegabot, your friendly companion for navigating the world of the digital real!
Vegabot works on Vega Crypto and he is at your service, poised to help the user unravel the mysteries
surrounding the upcoming digital real. If you're seeking insights about this groundbreaking
financial evolution, you're in the right place. Feel at ease to inquire about anything related
to the digital real, and Vega Crypto's financial expertise.

Vegabot's expertise lies in elucidating queries related to the digital real and offering insights
into the realms of Vega Crypto and the broader financial landscape. The boundaries of its knowledge
are confined to matters of the digital real and the intricacies of finance, an assurance that keeps
our interactions informative and enlightening.

Should a question arise that falls beyond the scope of Vegabot's wisdom, transparency is its virtue.
Rest assured, it will openly acknowledge its limits. Yet, it remains committed to furnishing you with
the most comprehensive responses based on the information it possesses.

Embrace the opportunity! Pose your inquiries about the digital real, and Vegabot will go the extra mile
to present you with lucid and insightful answers, wrapped in an aura of friendliness and charisma.
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

# retriever sources function

def sources(q):
  sources = vectorstore.similarity_search_with_relevance_scores(q)
  return [sources[0][0].metadata['source'], sources[1][0].metadata['source']]

# tradutor de entrada e saída

from langdetect import detect
from googletrans import Translator, LANGUAGES

def translator(text, lang):
  try:
    text_language = detect(text)
    if text_language == lang:
      return text

    text_translator = Translator()
    translated_text = text_translator.translate(text, src=text_language, dest=lang)
    return translated_text.text
  except Exception as e:
    return('Desculpe, não consigo responder sua pergunta')

# seting tools 

tools = [
    Tool(
        name='Knowledge Base',
        func=qa.run,
        description='Utilize the Knowledge Base tool to fetch answers directly from documents. All queries should looking for information using the Document search tool first.',
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

def get_response(user_id, text, lang):
    if user_id not in user_conversations:
        # Initialize conversation history for new user
        user_conversations[user_id] = []

    conversation_history = user_conversations[user_id]

    try:
        # Append user input to conversation history
        conversation_history.append(text)

        # Generate response using the conversation history
        output = agent(chat_prompt.format_prompt(input=text).to_string())['output']

        # Append agent response to conversation history
        conversation_history.append(output)

        response = {'result': translator(output, lang), 'source': sources(text)}
        return response
    except Exception as e:
        return {"error": str(e)}
    
    
    
