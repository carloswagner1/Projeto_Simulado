import express from 'express';
import {
    listItems,
    insertItem,
    updateItem,
    removeItem
      } from './controllers/itemsController.js';
import {
    listProducts,
    insertProduct,
    deleteProduct,
    updateProduct } from './controllers/productsController.js';

const app = express();

app.use((req, res, next) => {

    res.header("Access-Control-Allow-Origin", "*");

    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");

    res.header("Access-Control-Allow-Headers", "X-PINGOTHER, Content-Type, Authorization");

    next();
})

app.use(express.json());

app.get('/api/ping', (request, response) => {
    response.send({
        message: 'pong'
    })
});

/* endpoints products*/
app.get('/api/products', listProducts);
app.post('/api/products', insertProduct);
app.put('/api/products/:id', updateProduct);
app.delete('/api/products/:id', deleteProduct);

/* endpoints activities*/
app.get('/api/items', listItems);
app.post('/api/items', insertItem);
app.put('/api/items/:id', updateItem);
app.delete('/api/items/:id', removeItem);


app.listen(8000, () => {
    console.log("Servidor rodando na porta 8000... ")
});
