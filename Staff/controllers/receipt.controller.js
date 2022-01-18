const RoomOrder = require("../models/order/detailOrderRoom.model");
const Room = require("../models/room/roomType.model");
const ServiceOrder = require("../models/order/detailOrderService.model");
const Service = require("../models/service/service.model");
const Customer = require("../models/account/customer.model");



module.exports = {
    showReceipt: async (req, res) => {
        const roomReceipt =  await RoomOrder.findById(req.params.id);
        const roomType = await Room.findById(roomReceipt.roomTypeID);
        const customerInfo = await Customer.findById(roomReceipt.customerID);

        const checkIn =  roomReceipt.dateOfCheckIn.toLocaleDateString() + " " + roomReceipt.dateOfCheckIn.toLocaleTimeString();
        // const checkOut = roomReceipt.dateOfCheckOut.toLocaleDateString() + " " + roomReceipt.dateOfCheckOut.toLocaleTimeString();
        const time = new Date()
        const checkOut = time.toLocaleDateString() + " " + time.toLocaleTimeString();

        const numday = Math.ceil(time.getTime()/(24*60*60000)) - Math.floor(roomReceipt.dateOfCheckIn.getTime() /(24*60*60000)) 

        const room = {id: req.params.id, name: roomReceipt.roomID, type: roomType.name, price: roomType.price, checkin: checkIn, checkout: checkOut, numday: numday, subtotal: numday * roomType.price};
        var service = [];
        var total = numday * roomType.price;

        //Tìm xem khách hàng có còn đặt phòng nào khác hay không (using)

        for(var i = 0; i < roomReceipt.detailOrderService.length; i++){
            const serviceId = roomReceipt.detailOrderService[i];
            const serviceItem = await ServiceOrder.findOne({
                $and: [
                  {
                    _id: serviceId,
                  },
                  {
                      status: "using",
                  }, ],
                  });
            if (serviceItem) {
                const serviceInfo = await Service.findById(serviceItem.serviceID);

                service.push({
                    name: serviceInfo.name,
                    price: serviceInfo.price,
                    quantity: serviceItem.number,
                    subtotal: serviceInfo.price * serviceItem.number
                });
                total += serviceInfo.price * serviceItem.number;
            }
        }



        res.render('receipt/receipt',{
            customerInfo,
            room,
            service,
            total
        })
    },

    payment: async (req, res) => {
        const order = await RoomOrder.findOneAndUpdate(
            {_id: req.params.id},
            {status: "done", dateOfCheckOut: new Date()}
        )

        const otherOrder = await RoomOrder.find({customerID: order.customerID, status: "using"})
        if (otherOrder.length == 0){
            await Customer.findByIdAndUpdate(order.customerID, {status: false})
            // await Customer.findOneAndUpdate({_id: order.customerID}, {status: false})
        }
        res.redirect('/customer?status=using&page=1')
    }
}
