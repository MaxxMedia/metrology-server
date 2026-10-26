/** Implements HTTP request handlers for connections operations. */
import * as connectionService from "./connection.service.js";

/** Creates or submits the connection request data for this workflow. */
export const sendConnectionRequest = async (req, res) => {
  try {
    if (req.user.role !== "candidate") {
      return res.status(403).json({
        success: false,
        message: "Only candidates can send connection requests.",
      });
    }

    const senderId = req.user.id;
    const { receiverId, message } = req.body;

    const result = await connectionService.sendConnectionRequest({
      senderId,
      receiverId,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Connection request sent successfully.",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/** Coordinates the accept connection request behavior used by this module. */
export const acceptConnectionRequest = async (req, res) => {
  try {
    if (req.user.role !== "candidate") {
      return res.status(403).json({ success: false, message: "Not allowed." });
    }

    const receiverId = req.user.id;
    const { requestId } = req.params;

    const result = await connectionService.acceptConnectionRequest({
      requestId: Number(requestId),
      receiverId,
    });

    return res.status(200).json({
      success: true,
      message: "Connection request accepted successfully.",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/** Rejects the  connection request request and records its resulting state. */
export const rejectConnectionRequest = async (req, res) => {
  try {
    if (req.user.role !== "candidate") {
      return res.status(403).json({ success: false, message: "Not allowed." });
    }

    const receiverId = req.user.id;
    const { requestId } = req.params;

    const result = await connectionService.rejectConnectionRequest({
      requestId: Number(requestId),
      receiverId,
    });

    return res.status(200).json({
      success: true,
      message: "Connection request rejected successfully.",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/** Cancels the  connection request request and updates its state. */
export const cancelConnectionRequest = async (req, res) => {
  try {
    if (req.user.role !== "candidate") {
      return res.status(403).json({ success: false, message: "Not allowed." });
    }

    const senderId = req.user.id;
    const { requestId } = req.params;

    const result = await connectionService.cancelConnectionRequest({
      requestId: Number(requestId),
      senderId,
    });

    return res.status(200).json({
      success: true,
      message: "Connection request cancelled successfully.",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/** Retrieves my connections data for this workflow. */
export const getMyConnections = async (req, res) => {
  try {
    if (req.user.role !== "candidate") {
      return res.status(403).json({ success: false, message: "Not allowed." });
    }

    const userId = req.user.id;
    const connections = await connectionService.getMyConnections(userId);

    return res.status(200).json({ success: true, data: connections });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/** Removes or disables the connection record through this workflow. */
export const removeConnection = async (req, res) => {
  try {
    if (req.user.role !== "candidate") {
      return res.status(403).json({ success: false, message: "Not allowed." });
    }

    const userId = req.user.id;
    const connectionId = Number(req.params.userId);

    await connectionService.removeConnection({ userId, connectionId });

    return res.status(200).json({
      success: true,
      message: "Connection removed successfully.",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/** Retrieves received requests data for this workflow. */
export const getReceivedRequests = async (req, res) => {
  try {
    if (req.user.role !== "candidate") {
      return res.status(403).json({ success: false, message: "Not allowed." });
    }

    const userId = req.user.id;
    const requests = await connectionService.getReceivedRequests(userId);

    return res.status(200).json({ success: true, data: requests });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/** Retrieves sent requests data for this workflow. */
export const getSentRequests = async (req, res) => {
  try {
    if (req.user.role !== "candidate") {
      return res.status(403).json({ success: false, message: "Not allowed." });
    }

    const userId = req.user.id;
    const requests = await connectionService.getSentRequests(userId);

    return res.status(200).json({ success: true, data: requests });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/** Retrieves connection status data for this workflow. */
export const getConnectionStatus = async (req, res) => {
  try {
    if (req.user.role !== "candidate") {
      return res.status(403).json({ success: false, message: "Not allowed." });
    }

    const currentUserId = req.user.id;
    const targetUserId = Number(req.params.userId);

    const status = await connectionService.getConnectionStatus({
      currentUserId,
      targetUserId,
    });

    return res.status(200).json({ success: true, data: status });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/** Retrieves mutual connections data for this workflow. */
export const getMutualConnections = async (req, res) => {
  try {
    if (req.user.role !== "candidate") {
      return res.status(403).json({ success: false, message: "Not allowed." });
    }

    const currentUserId = req.user.id;
    const targetUserId = Number(req.params.userId);

    const mutualConnections = await connectionService.getMutualConnections({
      currentUserId,
      targetUserId,
    });

    return res.status(200).json({
      success: true,
      count: mutualConnections.length,
      data: mutualConnections,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/** Retrieves suggested connections data for this workflow. */
export const getSuggestedConnections = async (req, res) => {
  try {
    if (req.user.role !== "candidate") {
      return res.status(403).json({ success: false, message: "Not allowed." });
    }

    const userId = req.user.id;
    const suggestions = await connectionService.getSuggestedConnections(userId);

    return res.status(200).json({
      success: true,
      count: suggestions.length,
      data: suggestions,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};