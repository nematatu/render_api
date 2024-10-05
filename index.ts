import express from 'express';
import bodyParser from 'body-parser';

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