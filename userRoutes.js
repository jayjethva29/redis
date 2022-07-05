const express = require("express");
const userController = require("./userController");
const redisSearchController = require("./redisSearchController");

const router = express.Router();

router.route("/").post(userController.createOne).get(userController.getAll);

router
  .route("/:id")
  // .get(redisSearchController.getOne)
  .get(userController.getOne)
  .patch(userController.updateOne)
  .delete(userController.deleteOne);

module.exports = router;
