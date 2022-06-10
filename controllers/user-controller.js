const { User, Thought } = require('../models');

const userController = {
    getAllUser(req, res) {
      User.find({})
      .populate({
        path: 'friends',
        select: '-__v'
      })
      .select('-__v')
      .sort({ _id: -1 })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  getUserById({ params }, res) {
      User.findOne({ id: params.id })
      .populate({
          path: 'friends',
          select: '-__v'
      })
      .select('-__v')
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
          console.log(err);
          res.sendStatus(400);
      });
  },
  createUser({ body }, res) {
      User.create(body)
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.status(400).json(err.message));
  },
  updateUser({ params, body }, res) {
      User.findOneAndUpdate({ _id: params.id}, body, { new: true, runValidators: true })
      .then(dbUserData => {
          if (!dbUserData) {
              res.status(404).json({ message: 'No User found with this id!' });
              return;
          }
          res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },

  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },

  addFriend({ params }, res) {
      User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { friends: params.friendId } },
          { new: true, runValidators: true }
      )
      .then(dbUserData => {
          if (!dbUserData) {
              res.status(404).json({ message: 'No user found with this id!' });
              return;
          }
          res.json(dbUserData);
      })
      .catch(err => res.json(err));
  }, 

  removeFriend({ params }, res) {
      User.findOneAndUpdate(
          { _id: params.userId },
          { $pullAll: { friends: [params.friendId] } },
          { new: true }
      )
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));
  } 
  
};

module.exports = userController;