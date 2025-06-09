import ticketModel from "../models/ticketModel.js";


class TicketDao {

    async getAllTicketDao() {
        return await ticketModel.find();
    }

    async getTicketByIdDao(tid) {
        return await ticketModel.findById(tid);
    }

    async createTicketDao(ticket) {
        return await ticketModel.create(ticket);
    }

  async updatedTicketDao(ticket, tid) {
    return await ticketModel.findByIdAndUpdate(
        tid,
        { $set: ticket },
        { new: true }
    );
}

    async deleteTicketDao(tid){
        return await ticketModel.deleteOne({_id: tid});
    }
}

export default TicketDao;