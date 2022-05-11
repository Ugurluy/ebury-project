import { shallowMount } from "@vue/test-utils";
import CurrencyConverter from "@/components/CurrencyConverter.vue";
import axios from "axios";

const wrapper = shallowMount(CurrencyConverter, {});
let instance: any = wrapper.vm;

const exchangeResult: any = {
  date: "2022-05-09",
  info: {
    rate: 130.097501,
    timestamp: 1652199857,
  },
  query: {
    amount: 1,
    from: "USD",
    to: "JPY",
  },
  result: 130.380502,
  success: true,
};

const inputtedExcResult: any = {
  date: "2022-05-09",
  info: {
    rate: 130.097501,
    timestamp: 1652199857,
  },
  query: {
    amount: 1,
    from: "USD",
    to: "JPY",
  },
  result: 2,
  success: true,
};

const defaultExcResult: any = {
  date: "2022-05-09",
  info: {
    rate: 1.16778,
    timestamp: 1652199857,
  },
  query: {
    amount: 1,
    from: "GBP",
    to: "EUR",
  },
  result: 1.16778,
  success: true,
};

describe("CurrencyConverter.vue", () => {
  it("Changes the First Input from-to boolean value when entered", async () => {
    instance.getOldCurrencyVal(0);

    const input = (await wrapper.find("#input")) as any;
    input.element.value = 2;
    input.trigger("keyup");

    expect(instance.calculateForm[0].from).toBe(true);
    expect(instance.calculateForm[0].to).toBe(false);

    expect(instance.calculateForm[1].from).toBe(false);
    expect(instance.calculateForm[1].to).toBe(true);
  });
  it("Changes the Second Input from-to boolean value when entered", async () => {
    instance.getOldCurrencyVal(1);

    const input = (await wrapper.find("#input")) as any;
    input.element.value = 1;
    input.trigger("keyup");

    expect(instance.calculateForm[0].from).toBe(false);
    expect(instance.calculateForm[0].to).toBe(true);
    expect(instance.calculateForm[1].from).toBe(true);
    expect(instance.calculateForm[1].to).toBe(false);
  });
  it("Get default currencies response from API", async () => {
    const from = instance.selectableCurrencies[0];
    const to = instance.selectableCurrencies[1];
    const amount = (instance.calculateForm[0].input = 1);

    const response: any = await axios.get(
      `https://api.apilayer.com/exchangerates_data/convert?to=${to}&from=${from}&amount=${amount}&date=2022-05-09`,
      {
        headers: {
          apikey: "4LKv7p4JSqBUWA7mt3cGAIDCUysr7fdk",
        },
      }
    );
    var resultAmount = response.data;

    expect(resultAmount.query.from).toBe(from);
    expect(resultAmount.query.to).toBe(to);
    expect(resultAmount.result).toBe(defaultExcResult.result);
  });
  it("Get result when currencies changed", async () => {
    const from = instance.selectableCurrencies[2];
    const to = instance.selectableCurrencies[3];
    const amount = (instance.calculateForm[0].input = 1);

    const response: any = await axios.get(
      `https://api.apilayer.com/exchangerates_data/convert?to=${to}&from=${from}&amount=${amount}&date=2022-05-09`,
      {
        headers: {
          apikey: "4LKv7p4JSqBUWA7mt3cGAIDCUysr7fdk",
        },
      }
    );
    var resultAmount = response.data;

    expect(resultAmount.query.from).toBe(from);
    expect(resultAmount.query.to).toBe(to);
    expect(resultAmount.result).toBe(exchangeResult.result);
  });

  it("Get result when there is no input but different currencies have selected", async () => {
    const selected1 = wrapper.find("select").findAll("option").at(0);
    await selected1.setSelected();
    expect((wrapper.findAll("option:checked").at(0).element as any).value).toBe(
      instance.selectableCurrencies[0]
    );

    const selected2 = wrapper.find("select").findAll("option").at(1);
    await selected2.setSelected();
    expect((wrapper.findAll("option:checked").at(1).element as any).value).toBe(
      instance.selectableCurrencies[1]
    );
  });

  it("Get Exchange Result when input value changed", async () => {
    const input = (await wrapper.find("#input")) as any;
    input.element.value = 2;
    input.trigger("keyup");

    const from = instance.calculateForm.find((item) => item.from === true);
    const to = instance.calculateForm.find((item) => item.to === true);

    const response: any = await axios.get(
      `https://api.apilayer.com/exchangerates_data/convert?to=${to.currency}&from=${from.currency}&amount=${input.element.value}&date=2022-05-09`,
      {
        headers: {
          apikey: "4LKv7p4JSqBUWA7mt3cGAIDCUysr7fdk",
        },
      }
    );
    var resultAmount = response.data;
    expect(resultAmount.query.from).toBe(from.currency);
    expect(resultAmount.query.to).toBe(to.currency);
    expect(resultAmount.result).toBe(inputtedExcResult.result);
  });
});
