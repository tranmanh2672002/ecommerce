"use strict";

const AccessService = require("../services/access.service");

class AccessController {
  signUp = async (req, res, next) => {
    try {
      console.log("[P]:::signUp", req.body);
      const data = await AccessService.signUp(
        req.body.name,
        req.body.email,
        req.body.password
      );
      return res.status(200).json({ code: 200, metaData: data });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AccessController();
