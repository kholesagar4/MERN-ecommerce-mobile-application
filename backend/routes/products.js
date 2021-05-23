const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();
const { Product } = require("../models/product");
const mongoose = require("mongoose");
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

router.get(`/`, async (request, response) => {
  // const productList = await Product.find().select('name image -_id');
  let filter = {};
  if (request.query.categories) {
    filter = { category: request.query.categories.split(",") };
  }
  console.log(filter);
  const productList = await Product.find(filter).populate("category");
  if (!productList) {
    response.status(500).json({ success: false });
  }
  response.send(productList);
});

router.get(`/:id`, async (request, response) => {
  if (!mongoose.isValidObjectId(request.params.id)) {
    return response.status(400).send("Invalid product ID");
  }
  const product = await Product.findById(request.params.id).populate(
    "category"
  );
  if (!product) {
    response.status(500).json({ success: false });
  }
  response.send(product);
});

router.post(`/`, uploadOptions.single("image"), async (request, response) => {
  const category = await Category.findById(request.body.category);
  if (!category) return response.status(400).send("Invalid Category");

  const file = request.file;
  if (!file) return response.status(400).send("No Image in the request");

  const fileName = request.file.filename;
  // const basePath = `${request.protocol}://${request.get(
  //   "host"
  // )}/public/uploads/`;
  const basePath = `public/uploads/`;
  let product = new Product({
    name: request.body.name,
    description: request.body.description,
    richDescription: request.body.richDescription,
    image: `${basePath}${fileName}`,
    brand: request.body.brand,
    price: request.body.price,
    category: request.body.category,
    countInStock: request.body.countInStock,
    rating: request.body.rating,
    numReviews: request.body.numReviews,
    isFeatured: request.body.isFeatured,
  });

  product = await product.save();
  if (!product) return response.status(500).send("product is not inserted ");

  response.send(product);
});

router.put("/:id", uploadOptions.single("image"), async (request, response) => {
  if (!mongoose.isValidObjectId(request.params.id)) {
    return response.status(400).send("Invalid product ID");
  }
  const category = await Category.findById(request.body.category);
  if (!category) return response.status(400).send("Invalid Category");

  const product = await Product.findById(request.params.id);
  if (!product) return response.status(400).send("Invalid Category");

  const file = request.file;
  let imagepath;

  if (file) {
    const fileName = file.filename;
    // const basePath = `${request.protocol}://${request.get(
    //   "host"
    // )}/public/uploads/`;
    const basePath = `public/uploads/`;
    imagepath = `${basePath}${fileName}`;
  } else {
    imagepath = product.image;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    request.params.id,
    {
      name: request.body.name,
      description: request.body.description,
      richDescription: request.body.richDescription,
      image: imagepath,
      brand: request.body.brand,
      price: request.body.price,
      category: request.body.category,
      countInStock: request.body.countInStock,
      rating: request.body.rating,
      numReviews: request.body.numReviews,
      isFeatured: request.body.isFeatured,
    },
    { new: true }
  );

  if (!updatedProduct)
    return response.status(500).send("the Updated Product cannot be Update!");

  response.send(updatedProduct);
});

router.delete(`/:id`, (request, response) => {
  Product.findByIdAndRemove(request.params.id)
    .then((product) => {
      if (product) {
        return response
          .status(200)
          .json({ success: true, message: "the product is deleted!" });
      } else {
        return response
          .status(404)
          .json({ success: false, message: "product not found" });
      }
    })
    .catch((err) => {
      return response.status(400).json({ success: false, error: err });
    });
});

router.get(`/get/count`, async (request, response) => {
  const productCount = await Product.countDocuments((count) => count);

  if (!productCount) {
    response.status(500).json({ success: false });
  }
  response.send({ productCount: productCount });
});

router.get(`/get/featured/:count`, async (request, response) => {
  const count = request.params.count ? request.params.count : 0;
  const products = await Product.find({
    isFeatured: true,
  }).limit(+count);

  if (!products) {
    response.status(500).json({ success: false });
  }
  response.send(products);
});

router.put(
  "/gallery-images/:id",
  uploadOptions.array("images", 10),
  async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return response.status(400).send("Invalid product ID");
    }
    let imagesPaths = [];
    const files = req.files;
    //const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    const basePath = `public/uploads/`;

    if (files) {
      files.map((file) => {
        imagesPaths.push(`${basePath}${file.filename}`);
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        images: imagesPaths,
      },
      { new: true }
    );

    if (!product) return res.status(500).send("product is not inserted ");

    res.send(product);
  }
);

module.exports = router;
