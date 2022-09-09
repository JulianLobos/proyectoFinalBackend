import { Router } from 'express';
import { productController } from '../controller/productController.js';
const productsRouter = Router();

productsRouter.get('/:id', productController.getProductById); // Traemos los productos desde su ID
productsRouter.post('/', productController.saveProduct); // Agregamos productos al listado (admin)
productsRouter.put('/:id', productController.updateProductById); // Actualizamos un producto desde su ID (admin)
productsRouter.delete('/:id', productController.deleteProductById); // Eliminamos un producto desde su ID (admin)

export default productsRouter;