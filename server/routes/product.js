const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const { auth } = require("../middleware/auth");
const { Product } = require('../models/Product');

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (ext !== '.jpg' || ext !== '.png') {
            return cb(res.status(400).end('only jpg, png are allowed'), false);
        }
        cb(null, true);
    }
});

let upload = multer({ storage: storage }).single("file");

//=================================
//             Product
//=================================

router.post("/uploadImage", auth, (req, res) => {
    upload(req, res, err => {

        if (err) {
            return res.json({ success: false, err });
        } else {
            try {
                let path = ""
                sharp(req.file.path)
                    .resize(200, 200)
                    .toFile(path = "thumbanails/" + `thumbnails-${req.file.originalname}.webp`, (err, resizeImage) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(resizeImage);
                        }
                    })
                console.log(res.req.file.path)
                console.log(path)
                return res.json({ success: true, image: res.req.file.path, thumbanail: path, fileName: res.req.file.filename });
            } catch (error) {
                console.log(error);
            }
        }
    })

});

router.post("/uploadProduct", auth, (req, res) => {
    const product = new Product(req.body);

    product.save((err) => {
        if (err) return res.status(400).json({ success: false, err });
        return res.status(200).json({ success: true });
    })
});

router.post("/getProducts", (req, res) => {

    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);

    let findArgs = {};
    let term = req.body.searchTerm;

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                }

            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    if (term) {
        Product.find(findArgs)
            .find({ $text: { $search: term } })
            .populate("writer")
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec((err, products) => {
                if (err) return res.status(400).json({ success: false, err });
                res.status(200).json({ success: true, products, postSize: products.length });
            })
    } else {
        Product.find(findArgs)
            .populate("writer")
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec((err, products) => {
                if (err) return res.status(400).json({ success: false, err });
                res.status(200).json({ success: true, products, postSize: products.length });
            })
    }
});

// /product_by_id?id=${productId}&type=single
router.get('/product_by_id', (req, res) => {
    let type = req.query.type;
    let productsId = req.query.id;

    if (type === "array") {
        let ids = req.query.id.split(',');
        productsId = [];
        productsId = ids.map(item => item);
    }

    Product.find({ '_id': { $in: productsId } })
        .populate('writer')
        .exec((err, product) => {
            if (err) return res.status(400).send(err);
            return res.status(200).send(product);
        })

})


module.exports = router;
