import { spawn } from 'child_process';

export function runScript(command, args) {
    return new Promise((resolve, reject) => {
        const process = spawn(command, args);
        let output = '';

        process.stdout.on('data', data => output += data.toString());
        process.stderr.on('data', data => console.error(`STDERR: ${data}`));

        process.on('close', code => {
            if (code !== 0) reject(output);
            else resolve(output);
        });
    });
}