import { firestore } from "@/config/firebase";
import { ResponseType, WalletType } from "@/types";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";

export const createOrUpdateWallet = async (
  walletData: Partial<WalletType>
): Promise<ResponseType> => {
  try {
    const { id, image, ...rest } = walletData;

    const payload: any = { ...rest };

    if (image) {
      const imageUploadResponse = await uploadFileToCloudinary(
        image,
        "wallets"
      );
      if (!imageUploadResponse.success) {
        return {
          success: false,
          msg: imageUploadResponse.msg || "Failed to upload image",
        };
      }
      payload.image = imageUploadResponse.data;
    }

    const isCreate = !id;
    if (isCreate) {
      payload.amount = 0;
      payload.totalIncome = 0;
      payload.totalExpenses = 0;
      payload.created = new Date();
    }

    Object.keys(payload).forEach((k) => {
      if (payload[k] === undefined) delete payload[k];
    });

    const walletRef = id
      ? doc(firestore, "wallets", id)
      : doc(collection(firestore, "wallets"));

    await setDoc(walletRef, payload, { merge: true });

    return {
      success: true,
      data: { id: walletRef.id, ...payload },
    };
  } catch (error: any) {
    console.error("Error creating or updating wallet:", error);
    return { success: false, msg: error.message };
  }
};

export const deleteWallet = async (walletId: string): Promise<ResponseType> => {
  try {
    const walletRef = doc(firestore, "wallets", walletId);

    await deleteDoc(walletRef);

    deleteTransactionsByWalletId(walletId);

    return {
      success: true,
      msg: "Wallet deleted successfully",
    };
  } catch (error: any) {
    console.error("Error deleting wallet:", error);
    return {
      success: false,
      msg: error.message,
    };
  }
};

export const deleteTransactionsByWalletId = async (
  walletId: string
): Promise<ResponseType> => {
  try {
    let hasMoreTransactions = true;

    while (hasMoreTransactions) {
      const transactionsQuery = query(
        collection(firestore, "transactions"),
        where("walletId", "==", walletId)
      );
      const transactionsSnapshot = await getDocs(transactionsQuery);

      if (transactionsSnapshot.size === 0) {
        hasMoreTransactions = false;
        break;
      }

      const batch = writeBatch(firestore);
      transactionsSnapshot.forEach((transactionDoc) => {
        batch.delete(transactionDoc.ref);
      });

      await batch.commit();

      console.log(
        `${transactionsSnapshot.size} transactions deleted in this batch`
      );
    }

    return {
      success: true,
      msg: "All transactions deleted successfully",
    };
  } catch (error: any) {
    console.error("Error deleting transactions:", error);
    return {
      success: false,
      msg: error.message,
    };
  }
};
