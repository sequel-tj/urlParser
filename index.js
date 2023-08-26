const express = require('express');
const path = require('path');

const app = express();
const log = console.log;
const publicPath = path.join(__dirname + "/public");

let logfile = [];

app.use(express.static(publicPath));

app.get("/history", (req, res) => {
    res.send(
        `
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>History Page</title>
        
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                ::-webkit-scrollbar-thumb {
                    background: red; 
                  }
        
                body {
                    background-color: black;
                    color: white;
                    width: 100%;
                    height: 100%;
                    font-size: 20px;
                }
            </style>
        
        </head>
        
        <body>
            <div style=" margin: 40px auto; padding: 20px; width: 100%; background-color: black; ">
                <div style="width: 80%; margin: auto;">
                    <h1 style="text-align: center;">Server Logs</h1>
                    <hr style="width: 150px; margin: 0 auto 30px auto;">
                </div>
                <pre style="width: 80%; margin: auto; height: 500px; color: white; background: #252B48; border-radius: 5px; overflow-y: scroll;"><div style="margin: 20px;">${JSON.stringify(logfile, null, 2)}</div></pre>
            </div>

        </body>
        
        </html>
        `
    );
});


app.get("/favicon.ico", (req, res) => {
    res.sendFile(publicPath + "/index.html");
});

app.get("*", (req, res) => {
    let data = req.url;
    let n = data.length;
    
    data = req.url.substring(1, n).split("/");
    n = data.length;

    const operators = new Map([
        ["add", "+"],
        ["plus", "+"],
        ["substract", "-"],
        ["minus", "-"],
        ["multiply", "*"],
        ["into", "*"],
        ["divide", "/"],
        ["by", "/"],
    ]);

    let error404 = false;

    for (let i=1; i<n; i+=2) {
        if (operators.has(data[i]) == true) data[i] = operators.get(data[i]);
        else {
            error404 = true;
            break;
        }
    }
    
    if (error404) res.sendFile(publicPath + "/error.html");
    else {
        let question = "", answer = 0;
        for (let i=0; i<n; i++) {
            question += data[i];
        }
    
        const result = {
            "question": question,
            "answer" : eval(question).toFixed(2),
        }
    
        logfile = [result, ...logfile];
        if (logfile.length > 20) logfile.pop();
    
        res.json(logfile);
    }

});

app.listen(3000, () => {
    log("Server running on port: 3000");
});