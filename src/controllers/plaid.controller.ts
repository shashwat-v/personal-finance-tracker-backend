import { Request, Response } from "express";
import { plaidClient } from "../utils/PlaidClient";
import { Products, CountryCode } from "plaid";
import ApiResponse from "../utils/apiResponse";

// Function to create a Plaid link token
export const createLinkToken = async (req: Request, res: Response) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).send("userId is required");
  }

  try {
    const response = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: userId, // Unique identifier for the user
      },
      client_name: "Plaid Quickstart",
      products: [Products.Auth, Products.Transactions], // Specify products
      country_codes: [CountryCode.Us], // Specify country code
      language: "en",
    });

    res.json({ link_token: response.data.link_token });
  } catch (error) {
    console.error("Error creating link token:", error);
    res.status(500).send("Error creating link token");
  }
};

// Function to exchange public token for access token
export const getAccessToken = async (req: Request, res: Response) => {
  const { public_token } = req.body;
  if (!public_token) {
    return res.status(400).send("public_token is required");
  }

  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token,
    });

    const accessToken = response.data.access_token;
    res.json({ accessToken });
  } catch (error) {
    console.error("Error exchanging public token:", error);
    res.status(500).send("Error exchanging public token");
  }
};

// Function to get account information
export const getAccounts = async (req: Request, res: Response) => {
  const { accessToken } = req.body;
  if (!accessToken) {
    return res.status(400).send("accessToken is required");
  }

  try {
    const response = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    console.log("Accounts fetched:", response.data.accounts);
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { accounts: response.data.accounts },
          "Account fetched successfully"
        )
      );
  } catch (error) {
    console.error("Error fetching accounts:", error);
    res.status(500).send("Error fetching accounts");
  }
};

// Function to get transaction data
export const getTransactions = async (req: Request, res: Response) => {
  const { accessToken, startDate, endDate } = req.body;
  if (!accessToken || !startDate || !endDate) {
    return res
      .status(400)
      .send("accessToken, startDate, and endDate are required");
  }

  try {
    const response = await plaidClient.transactionsSync({
      access_token: accessToken,
      // start_date: startDate,
      // end_date: endDate,
    });

    console.log("Transactions fetched:", response.data);
    res.json({ transactions: response.data });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).send("Error fetching transactions");
  }
};
