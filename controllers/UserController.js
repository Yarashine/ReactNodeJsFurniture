import jwt from 'jsonwebtoken';
import  UserModel from '../models/user.js';

import bcrypt from 'bcrypt';


export const register = async (req, res) => {
    try{
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
    
        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            passwordHash: hash,
            
        })
    
        const user = await doc.save();
        
        const token = jwt.sign({
            _id: user._id,
            },

            'secret123',
            {
                expiresIn: '100d',
            },
        );

        const {passwordHash, ...userData } = user._doc;
        res.json({
            ... userData,
            token,
        });
    
    }

    catch(err){
        res.status(500).json({
            message: 'Error Registration',
        })
    }
};

export const login = async (req, res) => {
    try{
        const user = await UserModel.findOne({email:req.body.email});

        if(!user){

            return res.status(404).json({
                message: 'Cannot find user',
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if(!isValidPass){
            return res.status(400).json({
                message:'Invalid login or password',
            });
        }

        const token = jwt.sign({
            _id: user._id,
            },

            'secret123',
            {
                expiresIn: '100d',
            },
        );

        const {passwordHash, ...userData } = user._doc;
        res.json({
            ... userData,
            token,
        });
        
    }
    catch(err){
        res.status(500).json({
            message: 'Error Authorize',
        })
    }

};

export const getMe = async (req, res) =>{
    try{
        const user = await UserModel.findById(req.userId);

        if(!user){
            return res.status(404).json({
                message: 'User not found',
            });
        }

        const {passwordHash, ...userData } = user._doc;
        res.json(userData);
    }
    catch(err){

        res.status(500).json({
            message: 'No access',
        })
    }

};

export const getUserById = async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await UserModel.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ fullName: user.fullName }); 
    } catch (error) {
      console.error('Error getting user:', error.message);
      res.status(500).json({ message: 'Error getting user' });
    }
  };

  export const getUserTokenByGoogle = async (profile) => {
    let user = await UserModel.findOne({ email: profile.emails[0].value });
    const token = jwt.sign({
        _id: user._id,
        },

        'secret123',
        {
            expiresIn: '100d',
        },
    );
    return token;
  };