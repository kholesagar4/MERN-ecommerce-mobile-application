const { Order } = require("../models/order");
const { OrderItem } = require("../models/order-item");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
  const orderList = await Order.find()
    .populate("user", "name")
    .sort({ dateOrdered: -1 });

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
});

router.get(`/:id`, async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    });

  if (!order) {
    res.status(500).json({ success: false });
  }
  res.send(order);
});

router.post(`/`, async (req, res) => {
  console.log("hi there ");
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrdersItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });
      newOrdersItem = await newOrdersItem.save();
      return newOrdersItem._id;
    })
  );

  const orderItemsIdsResolved = await orderItemsIds;

  const totalPrice = await Promise.all(
    orderItemsIdsResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "product",
        "price"
      );
      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    })
  );

  const totalPriceSum = totalPrice.reduce((a, b) => a + b, 0);

  let order = new Order({
    orderItems: orderItemsIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPriceSum,
    user: req.body.user,
  });
  order = await order.save();
  if (!order) return res.status(404).send("the order cannot be created!");

  res.send(order);
});

router.put("/:id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );

  if (!order) return res.status(400).send("the order cannot be created!");

  res.send(order);
});

router.delete(`/:id`, (req, res) => {
  Order.findByIdAndRemove(req.params.id)
    .then(async (order) => {
      if (order) {
        await order.orderItems.map(async (orderItem) => {
          await OrderItem.findByIdAndRemove(orderItem);
        });
        return res
          .status(200)
          .json({ success: true, message: "the order is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "order not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

router.get("/get/totalsales", async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
  ]);

  if (!totalSales) {
    return res.status(400).send("The order sales cannot be generated");
  }
  res.send({ totalsales: totalSales.pop().totalsales });
});

router.get(`/get/count`, async (request, response) => {
  const orderCount = await Order.countDocuments((count) => count);

  if (!orderCount) {
    response.status(500).json({ success: false });
  }
  response.send({ orderCount: orderCount });
});

router.get(`/get/userorders/:userid`, async (req, res) => {
  const userOrderList = await Order.find({ user: req.params.userid })
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    })
    .sort({ dateOrdered: -1 });

  if (!userOrderList) {
    res.status(500).json({ success: false });
  }
  res.send(userOrderList);
});

module.exports = router;
/*
order Examole 
{
    "orderItems":[
        {
            "quantity":3,
            "product":"608e2ec0f9e6fc034c032afd"
        },
        {
            "quantity":3,
            "product":"608e2f34bfd4f845e8fb9add"
        },
    ]
    "shippingAddress1":"Address line 1 "
    "shippingAddress2":"1-B",
    "city":"Prague",
    "zip":"0000",
    "country":"India",
    "phone":"+911234567893"
    "user":"60913420fddadb3b287f71b7"
}
    
 */
