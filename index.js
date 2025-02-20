import fs from 'fs/promises';
import path from 'path';
import Groq from 'groq-sdk';

const client = new Groq({
    apiKey: process.env['GROQ_API_KEY'], // This is the default and can be omitted
  });

/**
 * Verifica se um arquivo existe.
 * @param {string} filePath - Caminho do arquivo.
 * @returns {Promise<boolean>} - Retorna verdadeiro se o arquivo existir.
 */
async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

/**
 * Lê um arquivo de código e retorna seu conteúdo como string.
 * @param {string} codeFilePath - Caminho do arquivo de código.
 * @returns {Promise<string>} - Conteúdo do arquivo.
 */
async function readCodeFile(codeFilePath) {
    if (!(await fileExists(codeFilePath))) {
        throw new Error(`Arquivo de código não encontrado: ${codeFilePath}`);
    }
    return fs.readFile(codeFilePath, 'utf-8');
}

/**
 * Lê o JSON de regras de complexidade.
 * @param {string} rulesFilePath - Caminho do arquivo JSON com as regras.
 * @returns {Promise<Object>} - Regras de complexidade carregadas.
 */
async function readComplexityRules(rulesFilePath) {
    if (!(await fileExists(rulesFilePath))) {
        throw new Error(`Arquivo de regras de complexidade não encontrado: ${rulesFilePath}`);
    }
    const data = await fs.readFile(rulesFilePath, 'utf-8');
    return JSON.parse(data);
}

/**
 * Analisa o código usando o modelo da Groq API para contar ocorrências de elementos de complexidade.
 * @param {string} codeContent - Código a ser analisado.
 * @param {Array} complexityRules - Lista de regras de complexidade.
 * @returns {Promise<Array>} - Retorna um array de análises.
 */
async function analyzeCodeComplexity(codeContent, complexityRules) {
    const analyses = [];
    
    for (const rule of complexityRules) {
        const prompt = `
            Analyze the following code and count occurrences of elements matching the hint: \"${rule.hint}\". Return a JSON object with the total count, a brief explanation, and the rule name as: \"${rule.description}\".

            The structure of the json must be: {"count": int, "explanation": string, "rule": string}
            
            The return must be only the json without any markdown.
            `;
        
        try {
            const response = await client.chat.completions.create({
                messages: [{ role: 'user', content: prompt + "\n\n" + codeContent }],
                model: 'qwen-2.5-coder-32b',
            });
            
            console.log(response.choices[0].message.content)

            const analysisResult = JSON.parse(response.choices[0].message.content);
            
            if (analysisResult.count !== undefined && analysisResult.explanation !== undefined && analysisResult.rule === rule.description ) {
                analyses.push(analysisResult);
            } else {
                console.warn(`Resposta inválida da API para a regra: ${rule.description}`);
            }
        } catch (error) {
            console.error(`Erro ao processar a regra ${rule.description}: ${error.message}`);
        }
    }
    
    return analyses;
}

async function main() {
    const args = process.argv.slice(2);
    if (args.length < 3) {
        console.error('Uso: node script.js <caminho_do_arquivo_de_codigo> <caminho_do_arquivo_de_regras> <limite>');
        process.exit(1);
    }

    const [codeFilePath, rulesFilePath,limit] = args;
    
    try {
        const codeContent = await readCodeFile(codeFilePath);
        const complexityRules = await readComplexityRules(rulesFilePath);
        
        console.log('Code loaded successfully.');
        console.log('Complexity rules loaded successfully.');

        const result = await analyzeCodeComplexity(codeContent,complexityRules)
        console.log("Analysis Summary:")
        console.log(result)
        
        const totalComplexityPoints = result.reduce((acc, analysis) => acc + analysis.count, 0);
        console.log("Final Complexity Count:", totalComplexityPoints);
        console.log("Is within complexity limit? ", totalComplexityPoints <= limit)
        
        // Aqui podemos chamar a função de análise de complexidade no próximo passo.
    } catch (error) {
        console.error(`Erro: ${error.message}`);
        process.exit(1);
    }
}




await main()
