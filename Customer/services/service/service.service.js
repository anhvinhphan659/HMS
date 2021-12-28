const serviceModel = require("../../models/service/service.model");
const serviceTypeService = require("./serviceType.service")
const ServiceService = {
    
    async findAll() {
        const res = await serviceModel.find({});
        return res;
    },
    async findById(id) {
        return await serviceModel.findById(id).lean();
    },
    async findByTypeId(serviceTypeId) {
        const currentServiceType = await serviceTypeService.findById(serviceTypeId)
        const servicesId = currentServiceType.services
        const services = servicesId.map(serviceModel.findById)
        return await services;
    },
}

module.exports = ServiceService