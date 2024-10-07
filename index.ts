import express from 'express';
import bodyParser from 'body-parser';
import spawn from 'child_process';

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

const server = app.listen(3000, () => {
    const address: any = server.address();
    const port = typeof address === 'string' ? address : address?.port;
    console.log('Server is running on port :' + port);
});

app.get('/test', async function (req, res, next) {
    console.log('Test API called');
    console.log(req.query);
    // res.header('Content-Type','application/json;charset=utf-8');;
    res.send('/test called');
})

app.post('/', function (req, res, next) {
    console.log(req.body);
    res.send(req.body);
})

const callCLI = async (url: string) => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn.spawn('python3', [`./test.py`, url]);

        let result='';

        pythonProcess.stdout.on('data', (data) => {
            result+=data.toString();
        })
        pythonProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            console.log(`Python process exited with code ${code}`);
            if (code !== 0) {
                reject(`Python process exited with error code ${code}`);
            }else{
                resolve(result);
            }
        });

        pythonProcess.on('error', (err) => {
            reject(`Failed to start Python process: ${err.message}`);
        });
    })
}


app.get('/spawn', async function (req, res, next) {
    try{
        const url='http://localhost:3000/test';
        const result= await callCLI(url);
        res.send(result);
        console.log('Result:',result);
    }catch(err){
        res.status(500).send(err)
    }
})