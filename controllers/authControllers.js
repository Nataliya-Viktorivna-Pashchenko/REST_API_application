const User = require ("../models/user.js");
const wrapperCtrl = require("../service/wrapperCtrl.js");
const validateUser = require("../service/validateUsers");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('node:fs/promises');
const path = require("node:path");
const gravatar = require ("gravatar");
const Jimp = require('jimp');
const sendEmail = require("../service/sendEmail.js");
// const nanoid = require("nanoid");
const { v4: uuidv4 } = require('uuid');

const addUser = async (req, res) => {
  validateUser.validateUser(req.body);
  const { email, password } = req.body
  const userTwin = await User.findOne({email});
  if (userTwin !== null) {
    return res.status(409).json({"message": "Email in use"})
  }
    const passwordHash = await bcrypt.hash(password, 10)
    const avatarURL = gravatar.url(email);

    const verificationToken = uuidv4();

   await sendEmail({
      to: email,
      from: "nvpashchenko@ukr.net",
      subject: "Welcome to Phonebook",
      html:`To confirm your registration please click on the <a href="http://localhost:3000/api/users/verify/${verificationToken}">link</a>`,
      text: `To confirm your registration please click on thehttp://localhost:3000/api/users/verify/${verificationToken}`
    })

   const user =await User.create({email, verificationToken, password: passwordHash, avatarURL});

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
   if (userLog.verify === false){
    return res.status(401).send({message:"Your email is not verified"})
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

const verifyEmail = async (req, res) => {
    const {verificationToken} = req.params;

    const user = await User.findOne({verificationToken});
    if (user === null){
      return res.status(404).send({message: 'User not found'});
          };
    await User.findByIdAndUpdate(user._id, {verify: true, verificationToken:null })
    res.status(200).send({message: 'Verification successful'})

   }

const verifyEmailAgain = async (req, res) => {
  if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
    res.status(400).json({"message": "missing required field email"});
  }
  validateUser.validateUser(req.body);

  const user = await User.findOne(req.body);
  if (user === null){
  return res.status(404).send({message: 'User not found'});
      };
      if (user.verificationToken === null) {
        return res.status(400).send({"message": "Verification has already been passed"})
      }
  const {email} = req.body;
      await sendEmail({
        to: email,
        from: "nvpashchenko@ukr.net",
        subject: "Welcome to Phonebook",
        html:`To confirm your registration please click on the <a href="http://localhost:3000/api/users/verify/${user.verificationToken}">link</a>`,
        text: `To confirm your registration please click on thehttp://localhost:3000/api/users/verify/${user.verificationToken}`
      })
      res.status(200).send({"message": "Verification email sent"})
}

   module.exports = {
    addUser: wrapperCtrl(addUser),
    logUser: wrapperCtrl(logUser),
    logout: wrapperCtrl(logout),
    current: wrapperCtrl(current),
    avatar: wrapperCtrl(avatar),
    changeSubscription: wrapperCtrl(changeSubscription),
    verifyEmail: wrapperCtrl(verifyEmail),
    verifyEmailAgain: wrapperCtrl(verifyEmailAgain),
    }