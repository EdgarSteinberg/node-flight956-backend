import provModels from "../models/provModel.js";

class ProvDao {
    
    async getAllProvDao() {
        return await provModels.find().lean();
    };

    async getProvByIdDao(pid) {
        return await provModels.findById(pid);
    };

    async createProvDao(prov) {
        return await provModels.create(prov);
    };

    async updatedProvDao(pid, updated) {
        return await provModels.findByIdAndUpdate(
            pid,
            { $set: updated },
            { new: true }
        )
    };

    async deleteProvDao(pid) {
        return await provModels.deleteOne({ _id: pid });
    };
}

export default ProvDao;