import { openDatabase } from '../database.js';

export const listProducts = async(request, response) =>{
    const db = await openDatabase();
    const products = await db.all(`
        SELECT * FROM products
    `);
    db.close();
    response.send(products);
};

export const insertProduct = async (request, response) => {
    const { name, icon, description, price, type } = request.body;
    const db = await openDatabase();
    const data = await db.run(`
        INSERT INTO products (name, icon, description, price, type)
        VALUES (?, ?, ?, ?, ?)
    `, [name, icon, description, price, type]);
    db.close();
    response.send({
        id: data.lastID,
        name,
        icon,
        description,
        price,
        type
    });
};

export const updateProduct = async (request, response) => {
    const { name, icon, description, price, type } = request.body;
    const { id }  = request.params;

    const db = await openDatabase();

    const product = await db.get(`
        SELECT * FROM products WHERE id = ?
    `, [id]);

    if(product){
        const data = await db.run(`
        UPDATE products
            SET name = ?,
                icon = ?,
                description = ?,
                price = ?,
                type = ?
            WHERE id = ?
        `, [name, icon, description, price, type, id]);

        db.close();
        response.send({
            name,
            icon,
            description,
            price,
            type
        });
        return;
    }

    db.close();
    response.send(product || {});
};

export const deleteProduct = async (request, response) => {
    const { id } = request.params;
    const db = await openDatabase();
    const data = await db.run(`
        DELETE FROM products
        WHERE id = ?
    `, [id]);
    db.close();
    response.send({
        id,
        message: `Produto [${id}] removido com sucesso`
    });
};