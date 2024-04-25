# TermiRAG
<img width="488" alt="Screenshot 2024-04-25 at 23 37 39" src="https://github.com/valonrexhepi23/termirag/assets/92568217/ededa9a9-4ada-4774-bbbb-1580cbc40c64">

## Create a little `ASK YOUR PDF` within your terminal.
### Prerequisites
Before you can run TermiRAG, ensure you have the following installed:

- [Node.JS (v20.09)](https://nodejs.org/en/download)
- npm (Node Package Manager)

### Installation
Clone the repository to your local machine using:
```
git clone https://github.com/valonrexhepi23/termirag.git
cd termirag
```
Install the necessary dependencies by running:
```
npm install
```
### Configuration
Ensure you have an [OPENAI API KEY](https://www.maisieai.com/help/how-to-get-an-openai-api-key-for-chatgpt).

Run the following command:
```
cd termirag | touch .env
```
If you have created the .env file, open it and insert this into the file:
```
OPENAI_API_KEY=YourAPIKEY
```
And replace it with an actual API KEY.

### Usage
You can add PDF-Files inside the folder or you can specifiy the path in
```
16:  const folderPath = './'
```
<img width="223" alt="Screenshot 2024-04-25 at 23 42 09" src="https://github.com/valonrexhepi23/termirag/assets/92568217/d3bb8aa5-4914-419f-b67f-4212630342ea">

Run the application using:
```
node index.js
```
The application will greet you with a stylish ASCII art title.

### Operational Workflow
1. **Select an Action**
2. **Engage with Prompts**
3. **View Resonses**

### Support
For support, please open an issue in the GitHub repository or contact `me` the repository owner.
Thank you for using TermiRAG, and we hope you find it useful in your PDF document management and interaction tasks!
