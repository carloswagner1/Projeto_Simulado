import { request, response } from 'express';
import { openDatabase } from '../database.js';

export const listItems = async (request, response) => {
    const db = await openDatabase();

    const items = await db.all(`
        SELECT * FROM items
    `);

    db.close();

    response.send(items);
};

export const insertItem = async (request, response) => {
    const { product_id } = request.body;


    const db = await openDatabase();
    const product = await db.get(`
        SELECT * FROM products WHERE id = ?
    `, [product_id]);

    if(product){
        let quantity = 1;
        const data = await db.run(`
            INSERT INTO items (product_id, quantity, price)
            VALUES
            (?, ?, ?)
        `, [product.id, quantity, product.price]);
        db.close();
        response.send({
            product_id: product.id,
            quantity: quantity,
            price: product.price,
            message: `Produto ${product.name} foi adicionado ao carrinho`
        });
        return;
    }
    db.close();

    response.status(400).send({
        message: `Produto não cadastrado`
    });
};

export const updateItem = async (request, response) => {
    const { product_id, quantity, price } = request.body;

    const db = await openDatabase();
    const product = await db.get(`
        SELECT * FROM products WHERE id = ?
    `, [product_id]);
    if(product){
        const selectedItem = await db.get(`
            SELECT * FROM items
            WHERE product_id = ?
        `, [product_id]);
        if(selectedItem){
            const data = await db.run(`
                UPDATE items
                SET quantity = ?,
                    price = ?
                WHERE id = ?
            `, [quantity, price, selectedItem.id]);

            db.close();

            response.send({
                product_id: product.id,
                quantity: quantity,
                price: price,
                message: `Item ${product.name} atualizado com sucesso`
            });
            return;
        }
        db.close();

        response.status(400).send({
            message: `Item ainda não adicionado`
        });
        return;
    }
    db.close();
    response.status(400).send({
        message: `Produto não cadastrado`
    })
};

export const removeItem = async (request, response) => {
    const { id } = request.params;

    const db = await openDatabase();

    const data = await db.run(`
        DELETE FROM items
        WHERE id = ?
    `, [id]);

    db.close();

    response.send({
        id,
        message: `Item deletado com sucesso`
    });
};