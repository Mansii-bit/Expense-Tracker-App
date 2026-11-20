import { getDashboard } from "../transaction/transaction.controller.js";

export const getReport = async (req, res) => {
    return getDashboard(req, res);
};
