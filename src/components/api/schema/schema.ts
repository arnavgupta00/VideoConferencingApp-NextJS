import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  servers: [
    {
      name: {
        type: String,
        required: true,
        unique: false,
      },
    },
  ],
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

const userCollection =
  mongoose.models.User || mongoose.model("User", userSchema);

const serverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: false,
  },
  users: [
    {
      name: {
        type: String,
        required: true,
        unique: false,
      },
      role: {
        type: String,
        required: false,
        unique: false,
      },
    },
  ],
});

const serverCollection =
  mongoose.models.Server || mongoose.model("Server", serverSchema);

export { userCollection, serverCollection };
