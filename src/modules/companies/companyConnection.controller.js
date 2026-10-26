/** Implements HTTP request handlers for companies operations. */
import {
    connectToCompany as connectToCompanyService,
    disconnectFromCompany as disconnectFromCompanyService,
    getCompanyConnectionStatus,
    getMyCompanyConnections as getMyCompanyConnectionsService,
} from "../connections/connection.service.js";

/** Checks the required candidate condition and rejects requests that do not satisfy it. */
function requireCandidate(req, res) {
    if (req.user.role !== "candidate") {
        res.status(403).json({
            success: false,
            message: "Only candidates can connect with companies.",
        });
        return false;
    }
    return true;
}

/** Creates or submits the to company data for this workflow. */
export const connectToCompany = async (req, res) => {
    try {
        if (!requireCandidate(req, res)) return;

        const companyId = Number(req.params.companyId);

        const result = await connectToCompanyService({
            userId: req.user.id,
            companyId,
        });

        return res.status(200).json({
            success: true,
            message: "Connected with company.",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

/** Coordinates the disconnect from company behavior used by this module. */
export const disconnectFromCompany = async (req, res) => {
    try {
        if (!requireCandidate(req, res)) return;

        const companyId = Number(req.params.companyId);

        await disconnectFromCompanyService({
            userId: req.user.id,
            companyId,
        });

        return res.status(200).json({
            success: true,
            message: "Disconnected from company.",
        });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

/** Retrieves connection status data for this workflow. */
export const getConnectionStatus = async (req, res) => {
    try {
        if (req.user.role !== "candidate") {
            return res.status(200).json({ success: true, data: { connected: false } });
        }

        const companyId = Number(req.params.companyId);

        const status = await getCompanyConnectionStatus({
            userId: req.user.id,
            companyId,
        });

        return res.status(200).json({ success: true, data: status });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

/** Retrieves my company connections data for this workflow. */
export const getMyCompanyConnections = async (req, res) => {
    try {
        if (!requireCandidate(req, res)) return;

        const data = await getMyCompanyConnectionsService(req.user.id);

        return res.status(200).json({ success: true, data });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};