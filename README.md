# Code Complexity Analyzer

## Overview
This script analyzes the cognitive complexity of a given code file using predefined complexity rules. The analysis is performed using the **Groq API** and the **qwen-2.5-coder-32b** model to count occurrences of specific complexity elements in the code. The results include a total complexity score and a comparison against a predefined complexity limit.

## Features
- Reads a source code file and a JSON file containing complexity rules.
- Uses the Groq API to analyze the code for complexity indicators.
- Generates a report with total complexity points and explanations.
- Checks if the code complexity is within an acceptable threshold.

## Prerequisites
- **Node.js 18+**
- **Groq API Key** (set in the environment variable `GROQ_API_KEY`)
- A JSON file containing complexity rules
- Internet connection for API requests

## Installation

1. Clone this repository:
   ```sh
   git clone https://github.com/your-repo/code-complexity-analyzer.git
   cd code-complexity-analyzer
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

## Usage

Run the script using the following command:
```sh
node index.js <code_file_path> <rules_json_path> <complexity_limit>
```

### Example
```sh
node index.js sample_code.js complexity_rules.json 10
```

### Parameters
- `<code_file_path>`: Path to the file containing the source code to analyze.
- `<rules_json_path>`: Path to the JSON file with complexity rules.
- `<complexity_limit>`: Maximum allowed complexity score.

## Complexity Rules JSON Format
The rules file should be a JSON array with objects defining the complexity indicators.
Example:
```json
[
  {
    "description": "Nested Loops",
    "hint": "loops inside loops"    
  },
  {
    "description": "Long Functions",
    "hint": "functions longer than 50 lines" 
  }
]
```

## Output
After execution, the script prints:
1. A summary of the complexity analysis for each rule.
2. The total complexity points found in the code.
3. Whether the complexity is within the given threshold.

Example output:
```sh
Code loaded successfully.
Complexity rules loaded successfully.

Analysis Summary:
[
  { "count": 3, "explanation": "Three instances of nested loops found.", "rule": "Nested Loops" },
  { "count": 2, "explanation": "Two functions exceed 50 lines.", "rule": "Long Functions" }
]

Final Complexity Count: 5
Is within complexity limit? true
```

## Error Handling
- If any file does not exist, the script will exit with an error message.
- If the API response is invalid, a warning will be logged, and the analysis will continue.
- If the complexity limit parameter is missing, the script will terminate with an appropriate message.

## License
This project is licensed under the MIT License.

## Contributing
Feel free to submit pull requests to improve the functionality or optimize the analysis process.

