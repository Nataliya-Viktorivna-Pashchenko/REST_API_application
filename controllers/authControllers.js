const User = require ("../models/user.js");
const wrapperCtrl = require("../service/wrapperCtrl.js");
const validateUser = require("../service/validateUsers");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('node:fs/promises');
const path = require("node:path");
const gravatar = require ("gravatar");
const Jimp = require('jimp');

const addUser = async (req, res) => {
  validateUser.validateUser(req.body);
  const { email, password } = req.body
  const userTwin = await User.findOne({email});
  if (userTwin !== null) {
    return res.status(409).json({"message": "Email in use"})
  }
    const passwordHash = await bcrypt.hash(password, 10)
    const avatarURL = gravatar.url(email);

   const user =await User.create({email, password: passwordHash, avatarURL});

      const {subscription} = user;
      
      res.status(201).json({user: {email, subscription}});
   }

const logUser = async(req, res) => {
    validateUser.validateUser(req.body);
    const { email, password } = req.body
    
    const userLog = await User.findOne({email});
    if (userLog === null) {
      return res.status(401).json({"message": "Email or password is wrong"})
    }
    const isMatch = await bcrypt.compare(password, userLog.password);
    if (isMatch === false) {
      return res.status(401).json({"message": "Email or password is wrong"})
    }
   
    const token = jwt.sign({id: userLog._id}, process.env.JWT_SECRET, {expiresIn: 60*60});

    await User.findByIdAndUpdate(userLog._id, {token});

    const {subscription} = userLog;
    res.status(200).json({"token":token, "user": {"email":email, "subscription":subscription}});
   }

const logout = async (req, res) =>{
   await User.findByIdAndUpdate(req.user._id, {token: null})
   res.status(204).end()
   }

const current = async (req, res) => {
  
    const user = await User.findById(req.user._id)
    
    const {email, subscription} = user;
    res.status(200).send({email, subscription})
   }

const changeSubscription = async (req, res) => {
  
  if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
    res.status(400).json({"message": "missing field Subscription"});
  }
  validateUser.validateSubscription(req.body);
  const result = await User.findByIdAndUpdate(req.user._id, req.body, {new:true})

  if (result === null) {
    res.status(404).json({"message": "Not found"});
   }
     res.status(200).json(result);
}

const avatar = async (req, res) => {
  
if (req.file === undefined) {
  res.status(400).json({"message": "missing field avatar"});
}
const sendPath = path.join("/avatars", req.file.filename);

    const newPath = path.join(__dirname, "..", 'public/avatars', req.file.filename);

    Jimp.read(req.file.path, (err, image) => {
      if (err) {return res.status(404).json(err)};
      image.resize(250,250).write(newPath);
    });

    await fs.rename(req.file.path, newPath);
    
    const user = await User.findByIdAndUpdate(req.user._id, {avatarURL: sendPath}, {new: true});

    res.send({"avatarURL": user.avatarURL});
   }

   module.exports = {
    addUser: wrapperCtrl(addUser),
    logUser: wrapperCtrl(logUser),
    logout: wrapperCtrl(logout),
    current: wrapperCtrl(current),
    avatar: wrapperCtrl(avatar),
    changeSubscription: wrapperCtrl(changeSubscription),
    }