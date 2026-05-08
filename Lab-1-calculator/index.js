//  chalk v4 caus the lastest version 5  not support type commonJS
const chalk = require('chalk')

const { add, subtract, multiply, divide } = require('./operations.js')

function calculate(num1, operator, num2) {
    const a = parseFloat(num1);
    const b = parseFloat(num2);

    // Input validation
    if (isNaN(a) || isNaN(b)) {
        console.log(chalk.bgRed.white(" Error: Please provide valid numbers. "));
        return;
    }

    try {
        let result;
        
        // Output result with different colors based on the operation
        switch (operator) {
            case '+':
                result = add(a, b);
                console.log(chalk.green(`Result: ${a} + ${b} = ${result}`));
                break;
            case '-':
                result = subtract(a, b);
                console.log(chalk.red(`Result: ${a} - ${b} = ${result}`));
                break;
            case '*':
            case 'x': // 'x' is included as a terminal-friendly alternative to '*'
                result = multiply(a, b);
                console.log(chalk.yellow(`Result: ${a} * ${b} = ${result}`));
                break;
            case '/':
                result = divide(a, b);
                console.log(chalk.blue(`Result: ${a} / ${b} = ${result}`));
                break;
            default:
                console.log(chalk.bgRed.white(` Error: Unsupported operator '${operator}'. Use +, -, *, or / `));
        }
    } catch (error) {
        console.log(chalk.bgRed.white(` Error: ${error.message} `));
    }
}

// Source - https://stackoverflow.com/a/22214001
// Posted by Ray Toal
// Retrieved 2026-05-08, License - CC BY-SA 3.0
// process.argv[0] == "node"
// process.argv[1] == "myprogram.js"
// process.argv[2] == "firstarg"
// Bonus: Accept parameters from the command line
// process.argv returns an array where the first two items are the node executable and the script path.
// The actual arguments provided by the user start at index 2.

const args = process.argv.slice(2);

if (args.length === 3) {
    // Call the main function with the arguments passed from the command line
    calculate(args[0],args[1],args[2]);
} else {
    // Display instructions if the user doesn't provide exactly 3 arguments
    console.log(chalk.bgCyanBright("Usage: node index.js <num1> <operator> <num2>"));
    console.log(chalk.bgBlue("Example: node index.js 5 + 10"));
    console.log(chalk.gray("Note: For multiplication, you may need to use 'x' instead of '*' depending on your terminal shell."));
}

