const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RoomSchema = new Schema(
  {
    roomNumber: { type: Schema.Types.String },
    status: { type: Schema.Types.Boolean },
    retalEndDate: { type: Schema.Types.Date },
    bookedDate: [{ type: Schema.Types.Date }],
  },
  {
    collection: "Room",
  }
);
const Room = mongoose.model("Room", RoomSchema);
module.exports = Room;