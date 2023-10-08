import express from 'express';
import { Connection } from './database/db.js';
import { log } from 'console';

import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import histories from './controller/history.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicPath = path.join(__dirname + "/public");

app.use(express.static(publicPath));

Connection(); // connecting to db


let logfile = await histories.find({}, {_id: 0, __v: 0});


app.get("/history", async (req, res) => { // displays the last 20 logs
    res.sendFile(publicPath + "/history.html");
});

app.get("/logFile", async(req, res) => { // act as a api for fetching logfile data in html file
    res.send(logfile);
});


// app.get("/favicon.ico", (req, res) => { // for handling eval() function favicon not found error
//     res.sendFile(publicPath + "/index.html");
// });

app.get("*", async (req, res) => { // parsing the url request
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
        ["xor", "^"],
        ["and", "&"],
        ["or", "|"],
    ]);

    let error404 = false;

    for (let i = 0; i < n && !error404; i += 2) {
        if (isNaN(data[i])) error404 = true;
    }

    for (let i = 1; i < n && !error404; i += 2) {
        if (operators.has(data[i]) == true) data[i] = operators.get(data[i]);
        else error404 = true;
    }

    if (error404) res.sendFile(publicPath + "/error.html");
    else {
        let question = "", answer = 0;
        for (let i = 0; i < n; i++) {
            question += data[i];
        }

        const result = {
            "question": question,
            "answer": eval(question).toFixed(2),
        }

        logfile = [result, ...logfile];
        if (logfile.length > 20) logfile.pop();

        try {
            await histories.deleteMany();
            await histories.insertMany(logfile);
            logfile = await histories.find({}, {_id: 0, __v: 0});

            res.json(logfile[0]);
        } 
        catch (error) {
            res.status(500).json({"error": error.message});
        }
    }

});



app.listen(3000, () => { // starts the server on the specified port
    log("Server running on port: 3000");
});