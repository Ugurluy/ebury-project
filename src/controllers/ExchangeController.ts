import HttpService from "@/services/HttpService";
import { AxiosResponse } from "axios";

export default class ExchangeController {
  /**
   * @description Get Controller for Exchange Conversion of given currencies and amount
   * @param {string} to: to
   * @param {string} from: from
   * @param {number} amount: amount
   * @returns
   */
  public static async getExchangeConversion(
    to: string,
    from: string,
    amount: number
  ): Promise<AxiosResponse> {
    return HttpService.get(
      `[api]/convert?to=${to}&from=${from}&amount=${amount}`
    );
  }
}
