const { mongoose, Schema } = require("mongoose");

const taskSchema = new Schema(
  {
    description: {
      type: String,
      require: true,
      trim: true,
    },
    completed: { type: Boolean, require: true, default: false },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const task = mongoose.model("Task", taskSchema);

module.exports = task;
