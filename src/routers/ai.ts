import { Router } from "express";
import OpenAI from "openai"
import { ChatCompletionMessageParam } from "openai/resources";

const openAI =new  OpenAI()
export default (router:Router)=> {


    (async()=>{

            // we need chat functionality to be able to have the function calling 
    const messages:ChatCompletionMessageParam[] = [
        { "role": "system", "content": "You are a helpful assistant." },
        { "role": "user", "content": "What can you tell me about artificial intelligence?" }
      ];
    
      const completion = await openAI.chat.completions.create({
        messages,
        model: "gpt-3.5-turbo"

      });
    })()


}