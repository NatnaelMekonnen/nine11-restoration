import mongoose, { ClientSession } from "mongoose";

export const withTransaction = async (
  asyncFunction: (session: ClientSession) => Promise<void>,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await asyncFunction(session);
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
