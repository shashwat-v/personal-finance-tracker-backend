import { Request, Response } from "express";
const fyersModel = require("fyers-api-v3").fyersModel
const fyers = new fyersModel()
const appId = "DYDX2P3BXM-100"
const secretId = "V44I3I6EUM"

fyers.setAppId(appId)
fyers.setRedirectUrl("https://www.google.com")

export const generateAuthCode = async (req: Request, res: Response) => {
    const url = fyers.generateAuthCode()
    res.json(url);
}

export const setAccessToken = async (req: Request, res: Response) => {
    const { auth_code } = req.params;

    fyers.generate_access_token({"secret_key":secretId,"auth_code":auth_code}).then((response: any)=>{
        if(response.s=='ok'){
            fyers.setAccessToken(response.access_token)
        }else{
            console.log("error generating access token",response)
        }
    })

    fyers.get_holdings().then((response: any) => {
        res.json(response)
    }).catch((error: Error) => {
        res.json(error)
    })
}