const express = require("express");
const filesRouter = express.Router();
const { createFile, getFiles, getFile } = require("./files");

filesRouter.get('/', getFiles)
filesRouter.post('/',createFile)
filesRouter.get('/:fileName',getFile)

module.exports = filesRouter;
