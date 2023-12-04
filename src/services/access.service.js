"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createToken } = require("../auth/authUtils");
const { getInfoData } = require("../utils");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static signUp = async (name, email, password) => {
    try {
      //   step 1: check email
      const isExistedEmail = await shopModel.findOne({ email }).lean();
      if (isExistedEmail) {
        return {
          code: "xxx",
          message: "Email is already exists",
          status: "error",
        };
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });
      if (newShop) {
        // created private key, public key
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
        });

        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
        });

        if (!publicKeyString) {
          return {
            code: "xxx",
            message: "publicKeyString error",
            status: "error",
          };
        }

        const publicKeyObject = crypto.createPublicKey(publicKeyString);
        // create token
        const token = await createToken(
          { userId: newShop._id, email },
          publicKeyObject,
          privateKey
        );

        console.log(`Created Token Success:::`, token);
        return {
          code: 200,
          metaData: {
            shop: getInfoData({
              fields: ["_id", "name", "email"],
              object: newShop,
            }),
            token,
          },
        };
      }
      return {
        code: 200,
        metaData: null,
      };
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
