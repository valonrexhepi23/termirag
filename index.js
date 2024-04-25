#!/usr/bin/env node
import "dotenv/config";

import { OpenAIEmbeddings } from "@langchain/openai";
import chalk from "chalk";
import figlet from "figlet";
import * as fs from "fs";
import gradient from "gradient-string";
import inquirer from "inquirer";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import OpenAI from "openai";

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// method -> [prompt/path , systemrole]
let mapOfMethods = new Map([
  [
    "Ask Me Anything",
    [
      "What is your question? - You can leave chat by writing " +
        chalk.bold("close"),
      "You are a helpful assistant that answers to a given text.",
    ],
  ],
  //   [
  //     "Add a PDF to Vector Database",
  //     [
  //       "Please provide the Path to the PDF.",
  //       "You are a helpful assistant that answers to a given text.",
  //     ],
  //   ],
  ["List all PDFs", fs.readFileSync("pdfs.txt").toString().split("\n")],
  ["Exit", []],
]);

async function askSolver(message, choices) {
  const answers = await inquirer.prompt({
    name: "method",
    type: "list",
    message: message,
    choices: choices,
    default() {
      return "Summarize Text";
    },
  });
  return answers.method;
}

async function getPrompt(method) {
  const answers = await inquirer.prompt({
    name: "prompt",
    type: "input",
    message: mapOfMethods.get(method)[0],
    default() {
      return "What is love?";
    },
  });
  return answers.prompt;
}

async function chatCompletion(prompt, context, method) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      { role: "system", content: mapOfMethods.get(method)[1] },
      {
        role: "user",
        content: `This is the context:
            ${context}
        -----
        And this is the question:
        ${prompt}
      `,
      },
    ],
  });
  console.log(chalk.bold(chalk.yellowBright("TermiRAG")));
  for await (const part of response) {
    if (part && part.choices && part.choices[0].delta.content)
      process.stdout.write(part.choices[0].delta.content);
  }
}

async function chatCompletionFromDocument(pathToPDF, prompt) {
  const loader = new PDFLoader(pathToPDF);
  const docs = await loader.load();
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const allSplits = await textSplitter.splitDocuments(docs);
  const vectorStore = await MemoryVectorStore.fromDocuments(
    allSplits,
    new OpenAIEmbeddings({
      apiKey: process.env.OPENAI_API_KEY || "",
    })
  );
  const retriever = vectorStore.asRetriever({
    k: 3,
    searchType: "similarity",
  });
  const retrievedDocs = await retriever.getRelevantDocuments(prompt);
  const retrievedContext = retrievedDocs
    .map((doc) => doc.pageContent)
    .join("\n\n");
  console.log();
  await chatCompletion(prompt, retrievedContext, method);
  console.log();
}

figlet("TermiRAG", (err, data) => {
  console.log();
  console.log(gradient.atlas(data));
});
await sleep(500);

let method = "";

while (method !== "Exit") {
  method = await askSolver("Please select:", Array.from(mapOfMethods.keys()));

  if (method === "List all PDFs") {
    mapOfMethods.get(method).forEach((pdf) => console.log(pdf));
  } else if (method != "Exit") {
    let prompt = "";
    const selectedPdf = await askSolver(
      "Please select a PDF",
      Array.from(mapOfMethods.get("List all PDFs"))
    );
    while (prompt !== "close") {
      prompt = await getPrompt(method);
      if (prompt !== "close") {
        await chatCompletionFromDocument(selectedPdf, prompt);
      }
    }
  }
  console.log();
}

figlet("Thanks!", (err, data) => {
  console.log(gradient.fruit(data));
});
