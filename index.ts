import express from 'express';
import bodyParser from 'body-parser';
import spawn from 'child_process';
import fs from 'fs';
import cors from 'cors';

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use(cors());

const server = app.listen(3000, () => {
    const address: any = server.address();
    const port = typeof address === 'string' ? address : address?.port;
    console.log('Server is running on port :' + port);
});



const callCLI = async (url: string) => {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn.spawn('python3', [`./test.py`, url]);

        let result = '';

        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        })
        pythonProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            console.log(`Python process exited with code ${code}`);
            if (code !== 0) {
                reject(`Python process exited with error code ${code}`);
            } else {
                resolve(result);
            }
        });

        pythonProcess.on('error', (err) => {
            reject(`Failed to start Python process: ${err.message}`);
        });
    })
}

app.post('/ogp', (req, res) => {
    const title = req.body.title || 'default';
    console.log('Title:', title);
    console.log('ogp API called');
    const pythonProcess = spawn.spawn('python3', [`OGP/cogp`, title]);
    pythonProcess.on('close', (code) => {
        const imagePath = `OGP/Images/${title}.png`;
        if (fs.existsSync(imagePath)) {
            fs.readFile(imagePath, (err, data) => {
                if (err) {
                    if(!res.headersSent){
                    return res.status(500).send(err);
                    }
                }
                const base64Image = Buffer.from(data).toString('base64');
                if(!res.headersSent){
                res.json({
                    image: base64Image
                });
            }
                fs.unlink(imagePath,(unlinkErr)=>{
                    if(unlinkErr){
                        console.log('Failed to delete image:',unlinkErr);
                    }
                })
            });
        } else {
            if(!res.headersSent){
            res.status(500).send('Image not found');
            }
        }
    })
    pythonProcess.on('error', (err) => {
        if(!res.headersSent){
        res.send(`Failed to start Python process: ${err.message}`);
        }
    });
    pythonProcess.stderr.on('data', (data) => {
        if(!res.headersSent){
        res.send(data.toString())
        }
    });
})