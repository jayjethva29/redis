const { createClient } = require("redis");
const User = require("./userModel");

const redisClient = createClient({
  // url: "redis://Jay:Pass8318!@redis-13592.c264.ap-south-1-1.ec2.cloud.redislabs.com:13592",
});
const DEFAULT_EXP_TIME = 3600;

// (async function () {
//   await redisClient.connect();
//   console.log("client created");
//   // redisClient.flushAll();
// })();

exports.createOne = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    res.status(200).json({
      status: "succes",
      data: {
        data: user,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    let users = await redisClient.get("users");

    if (users) return res.status(200).json({ data: JSON.parse(users) });

    console.log("Cashe missed");
    users = await User.findAll();

    //Set data to redis
    redisClient.SETEX("users", DEFAULT_EXP_TIME, JSON.stringify(users));

    res.status(200).json({ data: users });
  } catch (error) {
    console.log(error);
  }
};

// exports.getOne = async (req, res, next) => {
exports.getOne = async (req, res, next) => {
  try {
    let user = await redisClient.GET(`user?id=${req.params.id}`);

    if (user)
      return res.status(200).json({
        status: "succes",
        data: {
          data: JSON.parse(user),
        },
      });

    console.log("Cache missed");
    user = await User.findByPk(req.params.id);

    if (!user)
      return res.status(404).json({
        message: "No record found",
      });

    //Set data to redis
    redisClient.SETEX(
      `user?id=${req.params.id}`,
      DEFAULT_EXP_TIME,
      JSON.stringify(user)
    );
    res.status(200).json({
      status: "succes",
      data: {
        data: user,
      },
    });
  } catch (err) {
    next(err);
  }
};
//   try {
//     // let user = await redisClient.GET(`user?id=${req.params.id}`);
//     let user = await redisClient.json.get("test-key", {
//       // JSON Path: .node = the element called 'node' at root level.
//       path: ".node",
//     });

//     if (user)
//       return res.status(200).json({
//         status: "succes",
//         data: {
//           data: user,
//           // data: JSON.parse(user),
//         },
//       });

//     console.log("Cache missed");
//     user = await User.findByPk(req.params.id);

//     if (!user)
//       return res.status(404).json({
//         message: "No record found",
//       });

//     await redisClient.json.set("test-key", ".", { node: user });

//     res.status(200).json({
//       status: "succes",
//       data: {
//         data: user,
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// };

exports.updateOne = async (req, res, next) => {
  try {
    const [isUpdated] = await User.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!isUpdated)
      return res.status(404).json({
        message: "No record found",
      });

    // //Set Data to Redis [Bad Solution]
    // Delete Data from Redis
    redisClient.DEL("users");

    const user = await User.findByPk(req.params.id);

    res.status(200).json({
      status: "succes",
      data: {
        data: user,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const isDeleted = await User.destroy({
      where: { id: req.params.id },
    });

    if (!isDeleted)
      return res.status(404).json({
        message: "No record found",
      });

    redisClient.DEL("users");
    res.status(200).json({
      status: "succes",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
