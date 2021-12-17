const Customer = require("../models/account/customer.model");
const bcrypt = require("bcrypt");

module.exports = {
  getAllCustomer: (req, res, next) => {
    let perPage = 5; // số lượng sản phẩm xuất hiện trên 1 page
    let page = req.query.page || 1; // số page hiện tại
    if (page < 1) {
      page = 1;
    }

    Customer.find() // find tất cả các data
      .skip(perPage * page - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
      .limit(perPage)
      .exec((err, customers) => {
        Customer.countDocuments((err, count) => {
          // đếm để tính có bao nhiêu trang
          if (err) return next(err);
          let isCurrentPage;
          const pages = [];
          for (let i = 1; i <= Math.ceil(count / perPage); i++) {
            if (i === +page) {
              isCurrentPage = true;
            } else {
              isCurrentPage = false;
            }
            pages.push({
              page: i,
              isCurrentPage: isCurrentPage,
            });
          }
          res.render("customer/list-customer", {
            customers,
            pages,
            isNextPage: page < Math.ceil(count / perPage),
            isPreviousPage: page > 1,
            nextPage: +page + 1,
            previousPage: +page - 1,
          });
        });
      });
  },
  addCustomer: async (req, res) => {
    // check if username is exist using await
    const checkUsername = await Customer.findOne({
      username: req.body.username,
    });
    if (checkUsername) {
      return res.render("customer/add-customer", {
        error: "Username đã tồn tại",
      });
    }

    // check if email is exist using await
    const checkPhoneNumber = await Customer.findOne({ phone: req.body.phone });
    if (checkPhoneNumber) {
      return res.render("customer/add-customer", {
        error: "Số điện thoại đã tồn tại",
      });
    }

    const checkID = await Customer.findOne({ ID: req.body.id });
    if (checkID) {
      return res.render("customer/add-customer", {
        error: "ID đã tồn tại",
      });
    }

    // hash password
    const hash = bcrypt.hashSync(req.body.password.toString(), 10);

    const newCustomer = new Customer({
      username: req.body.username,
      password: hash,
      fullname: req.body.name,
      phone: req.body.phone,
      ID: req.body.id,
      status: true,
    });
    newCustomer.save((err) => {
      if (err) return next(err);
      return res.redirect("/customer/list-customer?page=1");
    });
  },
  editCustomerGet: (req, res) => {
    Customer.findById(req.params.id, (err, customer) => {
      if (err) return next(err);
      res.render("customer/edit-customer", {
        customer,
      });
    });
  },
  editCustomerPost: async (req, res) => {
    // check if phone number is exist using await
    const checkPhoneNumber = await Customer.findOne({ phone: req.body.phone });
    const checkID = await Customer.findOne({ ID: req.body.ID });
    const customer = await Customer.findById(req.body._id);
    if (checkPhoneNumber) {
      return res.render("customer/edit-customer", {
        error: "Số điện thoại đã tồn tại",
        customer,
      });
    }
    if (checkID) {
      return res.render("customer/edit-customer", {
        error: "ID đã tồn tại",
        customer,
      });
    }

    customer.fullname = req.body.name;
    customer.phone = req.body.phone;
    customer.ID = req.body.ID;
    customer.save((err) => {
      if (err) return next(err);
      return res.redirect("/customer/list-customer?page=1");
    });
  },

  blockCustomer: (req, res) => {
    Customer.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: false,
        },
      },
      (err, account) => {
        if (err) return next(err);
        res.redirect("/customer/list-customer?page=1");
      }
    );
  },
  unblockCustomer: (req, res) => {
    Customer.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: true,
        },
      },
      (err, account) => {
        if (err) return next(err);
        res.redirect("/customer/list-customer?page=1");
      }
    );
  },
  deleteCustomer: (req, res) => {
    Customer.findByIdAndDelete(req.params.id, (err, account) => {
      if (err) return next(err);
      res.redirect("/customer/list-customer?page=1");
    });
  },
};