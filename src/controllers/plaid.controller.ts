import { Request, Response } from "express";
import { plaidClient } from "../utils/PlaidClient";
import { Products, CountryCode } from "plaid"; // Adjust this import based on Plaid API typings
import { resolve } from "path";
import ApiResponse from "../utils/apiResponse";

export const createLinkToken = async (req: Request, res: Response) => {
  const { userId } = req.body;
  try {
    const response = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: userId, // Replace with a unique identifier for the user
      },
      client_name: "Plaid Quickstart",
      products: [Products.Auth, Products.Transactions], // Use Products enum from Plaid API
      country_codes: [CountryCode.Us], // Use CountryCode enum from Plaid API
      language: "en",
    });
    res.json({ link_token: response.data.link_token });
  } catch (error) {
    console.error("Error creating link token", error);
    res.status(500).send("Error creating link token");
  }
};

export const getAccessToken = async (req: Request, res: Response) => {
  const { public_token } = req.body;
  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token,
    });
    const accessToken = response.data.access_token;
    res.json({ accessToken });
  } catch (error) {
    console.error("Error exchanging public token", error);
    res.status(500).send("Error exchanging public token");
  }
};

export const getAccounts = async (req: Request, res: Response) => {
  const { accessToken } = req.body;
  try {
    const response = await plaidClient.accountsGet({
      access_token: accessToken,
    });
    console.log(response.data.accounts);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { accounts: response.data.accounts },
          "Account feteched successfully"
        )
      );
  } catch (error) {
    console.error("Error fetching accounts", error);
    res.status(500).send("Error fetching accounts");
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  const { accessToken, startDate, endDate } = req.body;
  try {
    const response = await plaidClient.transactionsGet({
      access_token: accessToken,
      start_date: startDate,
      end_date: endDate,
    });
    res.json({ transactions: response.data.transactions });
  } catch (error) {
    console.error("Error fetching transactions", error);
    res.status(500).send("Error fetching transactions");
  }
};
