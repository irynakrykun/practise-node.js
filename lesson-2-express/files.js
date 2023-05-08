const fs = require("fs/promises");
const path = require("path");
const chalk = require("chalk");
const checkExtension = require("./helpers/checkExtension");
const dataValidation = require("./helpers/dataValidation");

async function createFile(req, res, next) {
  const { fileName, content } = req.body;
  // const data = {
  //   fileName,
  //   content,
  // };
  const { error } = dataValidation(req.body);
  if (error) {
    res.status(400).json({
      message: `Please specify ${error.details[0].context.key} parameter`,
    });

    return;
  }
  const { result, extension: extension } = checkExtension(fileName);
  if (!result) {
    res.status(400).json({
      message:
        " `Sorry, this application doesn't support ${extension} extension!`",
    });

    return;
  }
  try {
    await fs.writeFile(
      path.join(__dirname, "./files", fileName),
      content,
      "utf-8"
    );
    res.status(201).json({ message: `File was successfully created` });
  } catch (error) {
    next(error);
  }
}

async function getFiles(req, res, next) {
  try {
    const filesArr = await fs.readdir(path.join(__dirname, "./files"));
    if (!filesArr.length) {
      res
        .status(404)
        .json({ message: "There are not files in this directory" });
    }
    res.json({ status: "success", data: filesArr });
  } catch (err) {
    next(err);
  }
}

async function getFile(req, res, next) {
  const fileName = req.params.fileName
  try {
    const filesInfo = await fs.readdir(path.join(__dirname, "./files"));
    if (!filesInfo.length) {
      res.status(400).json({message:"There are not files in this directory"})
      
      return;
    }
    if (!filesInfo.includes(fileName)) {
      res.status(404).json({message:`File with name ${fileName} not found`})
      
      return;
    }
    const fileStat = await fs.stat(path.join(__dirname, "./files", fileName));
    const objInfo = {
      fileName: path.basename(path.join(__dirname, "./files", fileName)),
      extension: path.extname(path.join(__dirname, "./files", fileName)),
      content: await fs.readFile(
        path.join(__dirname, "./files", fileName),
        "utf-8"
      ),
      size: fileStat.size,
      date: fileStat.birthtime.toString(),
    };
    res.json(objInfo)
  
  } catch (err) {
   next(err)
  }
}

module.exports = {
  createFile,
  getFiles,
  getFile,
};
