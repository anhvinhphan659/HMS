const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const DetailOrderRoomSchema = new Schema({
    roomID: { type: Schema.Types.ObjectId },
    roomTypeID: { type: Schema.Types.ObjectId },
    dateOfCheckIn: { type: Schema.Types.Date },
    dateOfCheckOut: { type: Schema.Types.Date },
    _id: { type: Schema.Types.ObjectId },
    detailOrderService: [{ type: Schema.Types.ObjectId }],
    price: {type: Schema.Types.Number},
  },
  {
    collection: "DetailOrderRoom",
});
const DetailOrderRoom = mongoose.model(
    "DetailOrderRoom",
    DetailOrderRoomSchema
);
module.exports = DetailOrderRoom;