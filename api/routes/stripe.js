const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);

router.post("/payment", async (req, res) => {
  try {
    const { products } = req.body.products;

    const line_items = products.map((product) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: product.title,
        },
        unit_amount: product.price * 100,
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: "https://figmaecom.onrender.com/success",
      cancel_url: "https://figmaecom.onrender.com/cancel",
    });
    res.json({ id: session.id });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
