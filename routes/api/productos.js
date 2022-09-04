const router = require('express').Router();
const productos = [];

const getById = (id) => {
    const item = productos.find(item => item.id === id);
    return item;
}

const getIndexById = (id) => {
    const index = productos.findIndex(item => item.id === id);
    return index;
}

const getMaxId = () => {
    const ids = productos.map(item => item.id);
    if (ids.length === 0){
        return 0;
    }
    return Math.max(...ids);
}

router.get('/', (req, res) => {
    if(productos.length === 0){
        res.status(200).json({error : 'Producto no encontrado'});
    }else{
        res.status(200).json(productos);
    }
});

router.get('/:id', (req, res) => {
    if(isNaN(parseInt(req.params.id))) {
        res.status(400).json({"error": "El parámetro no es un número"});
    } else {
        const id = parseInt(req.params.id);
        const maxId = getMaxId();
        if(id > maxId || id < 1){
            res.status(400).json({"error": "El parámetro está fuera de rango"});
        } else {
            const prod = getById(id)
            if(prod){
                res.status(200).json(getById(id));
            } else {
                res.status(200).json({"error": "Producto no encontrado"});
            }
        }
    }
});

router.post('/', (req, res) => {
    if(req.body.title && req.body.price && req.body.thumbnail){
        const id = getMaxId() + 1;
        const prod = {
            "id": id,
            "title": req.body.title,
            "price": req.body.price,
            "thumbnail": req.body.thumbnail
        };
        productos.push(prod);
        res.status(200).json(prod);
    } else {
        res.status(400).json({"error": "La petición no es correcta"});
    }
});

router.put('/:id', (req, res) => {
    let isReqOk = true;
    let errorMessage = "";
    let errorCode = 400;
    let index;
    
    if(isNaN(parseInt(req.params.id))){
        isReqOk = false;
        errorMessage = "El parámetro no es un número";
    } else {
        index = getIndexById(parseInt(req.params.id));
        if(index === -1){
            isReqOk = false;
            errorMessage = "Producto no encontrado";
            errorCode = 200;
        } else if(!(req.body.title || req.body.price || req.body.thumbnail)){
            isReqOk = false;
            errorMessage = "La petición no es correcta";
        }
    }

    if(isReqOk){
        const product = productos[index];
        const editedProduct = {
            "title": req.body.title ? req.body.title : product.title,
            "price": req.body.price ? req.body.price : product.price,
            "thumbnail": req.body.thumbnail ? req.body.thumbnail : product.thumbnail,
            "id": product.id
        };
        productos[index] = editedProduct;
        res.status(200).json(editedProduct);
    } else {
        res.status(errorCode).json({"error": errorMessage});
    }
});

router.delete('/:id', (req, res) => {
    if(isNaN(parseInt(req.params.id))){
        res.status(400).json({"error": "El parámetro no es un número"});
    } else {
        const id = parseInt(req.params.id);
        const maxId = getMaxId();
        if(id > maxId || id < 1){
            res.status(400).json({"error": "El parámetro está fuera de rango"});
        } else {
            const index = getIndexById(id);
            if(index !== -1){
                const prod = getById(id);
                productos.splice(index, 1);
                res.status(200).json({deleted: prod});
            } else {
                res.status(200).json({ error: "Producto no encontrado"});
            }
        }
    }
})

module.exports = router;