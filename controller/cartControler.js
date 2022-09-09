import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const databaseCart = path.join(__dirname, '../database/cart.txt');
const databaseProducts = path.join(__dirname, '../database/products.txt');

const getMaxId = () => {
    const ids = databaseCart.map(item => item.id);
    if (ids.length === 0){
        return 0;
    }
    return Math.max(...ids);
}

const readFile = async(file) => {
    try {
        const data = await fs.promises.readFile(file, 'utf-8', (err, data) =>{
            if(err) throw err
            return data
        })
        return JSON.parse(data)
    } catch (error) {
        console.error(`Error: ${error}`)        
    }
}

const saveCart = async(req, res) => {
    try {
        const databaseData = await readFile(databaseCart)
        const id = getMaxId() + 1;
        const cart = {
            id: id,
            timestamp: Date.now(),
            products: []
        }
        databaseData.push(cart)
        await fs.promises.writeFile(databaseCart, JSON.stringify(databaseData, null, 2), err => {
            if(err) throw err
        })
        res.status(200).json({message: `Carrito creado, ID: ${cart.id}`})
    } catch (error) {
        console.error(`Error: ${error}`)
    }
}

const deleteCart = async(req, res) => {
    const { id } = req.params
    try {
        const databaseData = await readFile(databaseCart)
        const indexCart = databaseData.findIndex(cart => cart.id == id)
        if(indexCart != -1){
            databaseData.splice(indexCart, 1)
            await fs.promises.writeFile(databaseCart, JSON.stringify(databaseData, null, 2), err => {
                if(err) throw err
            })
            res.status(200).json({message: 'Carrito borrado!'})
        } else {
            res.status(400).json({error: 'El carrito no existe'})
        }
    } catch (error) {
        console.error(`Error: ${error}`)
    }
}

const getProducts = async(req, res) => {
    const {id} = req.params
    try {
        const databaseData = await readFile(databaseCart)
        databaseData.forEach(cart => {
            if(cart.id == id){
                res.send(cart.products)
            }
        })
    } catch (error) {
        console.error(`Error: ${error}`)
    }
}

const saveProductByID = async (req, res) => {
    const {id} = req.params
    const {productArrID} = req.body

    try {
        const databaseDataCart = await readFile(databaseCart)
        const cartIndex = databaseDataCart.findIndex(cart => cart.id == id)
        if(cartIndex != -1){
            const databaseDataProducts = await readFile(databaseProducts)
            const dataProducts = []
            databaseDataProducts.forEach(product => {
                productArrID.forEach(id => {
                    if(product.id == id){
                        dataProducts.push(product)
                    }
                })
            })
            if(dataProducts.length != 0){
                let concatData = databaseDataCart[cartIndex].products.concat(dataProducts)
                databaseDataCart[cartIndex].products = concatData
                await fs.promises.writeFile(databaseCart, JSON.stringify(databaseDataCart, null, 2), err => {
                    if(err) throw err
                })
                res.status(200).json({message: 'Productos agregados!'})
            } else {
                res.status(400).json({error: 'No se encontraron productos'})
            }
        } else {
            res.status(400).json({error: 'Carrito no encontrado'})
        }
    } catch (error) {
        console.error(`Error: ${error}`)
    }
}

 const deleteCartProductByID = async(req, res) => {
    const {id, productId} = req.params 
    try {
        const databaseDataCart = await readFile(databaseCart)
        const cartData = databaseDataCart.find(cart => cart.id == id)
        if(cartData){
            const productIndex = cartData.products.findIndex(product => product.id == productId)
            if(productIndex != -1){
                cartData.products.splice(productIndex, 1)
                await fs.promises.writeFile(databaseCart, JSON.stringify(databaseDataCart, null, 2), err => {
                    if(err) throw err
                })
                res.status(200).json({message: 'Producto borrado'})
            } else {
                res.status(400).json({error: 'Producto no encontrado'})
            }
        } else {
            res.status(400).json({error: 'Carrito no encontrado'})
        }
    } catch (error) {
        console.error(`Error: ${error}`)
    }
}

export const cartController = {
    saveCart, deleteCart, getProducts, saveProductByID, deleteCartProductByID
}