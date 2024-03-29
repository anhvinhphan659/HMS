const customerService = require("../services/customer.service");
const detailOrderRoomModel = require("../models/order/detailOrderRoom.model");
const Notification = require("../models/notification/notification.model");
const { calculateDay } = require("../utils/");
const env = require("dotenv").config();
class ServiceController {
  //[GET] /orders/
  async show(req, res, next) {
    if (!req.session.cart || req.session.cart.rooms.length <= 0) {
      return res.redirect("/rooms");
    }

    if (req.query.status === "success") {
      req.session.cart = null;

      let message = "";
      if (req.query.user === "exists") {
        message = req.user
          ? "See the orders in your profile"
          : "Please check in at the hotel to activate your account (login with your current account password)";
      } else {
        message =
          "Please check in at the hotel to activate your account (default password is your ID number)";
      }

      return res.render("orders/success", {
        message: message,
        isAuth: req.user,
      });
    }
    let totalAmount = 0;
    const roomTypes = req.session.cart.rooms;
    for (const roomType of roomTypes) {
      roomType.listRoom.forEach((room) => {
        room.amount =
          calculateDay(room.checkin, room.checkout) * roomType.RoomPrice;
        totalAmount += room.amount;
      });
    }

    req.session.cart.rooms.totalAmount = totalAmount;
    req.session.cart.rooms = roomTypes;

    res.render("orders/order", {
      rooms: roomTypes,
      isAuth: req.user,
      user: req.user,
      url_staff: process.env.URL_STAFF,
    });
  }

  //[POST] /orders/
  async order(req, res, next) {
    let userIsExists = true;
    let { phone, identity } = req.body;
    let customer = await customerService.findOne({
      phone: phone,
      ID: identity,
    });
    // customer not exists
    if (!customer) {
      userIsExists = false;
      var fullname = req.body["last-name"] + " " + req.body["first-name"];
      await customerService.create({
        password: identity,
        fullname,
        phone,
        ID: identity,
      });
      customer = await customerService.findOne({ phone, identity });
    }

    const roomTypes = req.session.cart.rooms;

    for (const roomType of roomTypes) {
      for (const room of roomType.listRoom) {
        await detailOrderRoomModel.create({
          roomID: room.roomid,
          customerID: customer._id,
          roomTypeID: roomType.RoomTypeID,
          people: room.people,
          dateOfCheckIn: new Date(room.checkin),
          dateOfCheckOut: new Date(room.checkout),
          status: "pending",
          detailOrderService: [],
          price: room.amount,
        });
      }
    }
    // save new notification using await
    await Notification.create({
      title: "Đăng ký phòng",
      content: `Khách hàng ${customer.fullname} đã đăng ký phòng`,
      time: new Date().toLocaleString(),
      seen: false,
    });

    let url = "/orders?status=success";
    url += userIsExists ? "&&user=exists" : "";
    res.redirect(url);
  }
}

module.exports = new ServiceController();
