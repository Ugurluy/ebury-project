<template>
  <div class="card col-8">
    <h3>Currency Converter</h3>
    <div class="container">
      <div class="calculator" v-for="(cs, index) in calculateSize" :key="cs">
        <div class="exchange">
          <input
            id="input"
            v-model="calculateForm[index].input"
            @keyup="getExchangeResult(calculateForm[index])"
            @focus="getOldCurrencyVal(index)"
          />
        </div>
        <div class="exchange">
          <select
            class="select"
            id="select"
            v-model="calculateForm[index].currency"
            @focus="getOldCurrencyVal(index)"
            @change="getExchangeResult(calculateForm[index])"
          >
            <option
              class="option"
              id="option"
              v-for="(currency, index) in selectableCurrencies"
              :key="index"
              :value="currency"
            >
              <span>{{ currency }}</span>
            </option>
          </select>
        </div>
        <div class="equal" v-if="index === 0">
          <img src="../assets/exchange.png" alt="" />
        </div>
      </div>
    </div>
    <div v-if="resultAmount">
      <span>1 {{ resultAmount.query.from }} = </span>
      <span>{{ resultAmount.info.rate }}</span>
      <span> {{ resultAmount.query.to }}</span>
      <br />
      <span>
        Mid-market exchange rate @
        {{ getExchangeTime(resultAmount.info.timestamp) }}</span
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import accounting from "accounting";
import moment from "moment";
import ExchangeController from "../controllers/ExchangeController";

@Component
export default class CurrencyConverter extends Vue {
  selectableCurrencies: string[] = ["GBP", "EUR", "USD", "JPY", "TRY"];
  calculateSize: any = 2;
  calculateForm: any[] = [];
  resultAmount: any = 0;
  defaultCurrencyAmount: any = 1;
  formattingOptions: any = {
    symbol: "",
    decimal: ".",
    thousand: ",",
    precision: 2,
    format: "%s%v",
  };

  /**
   * @description On created()
   * initial currencies selected,
   * initial exchange rate function called.
   */
  created() {
    for (let i = 0; i < this.calculateSize; i++) {
      this.pushCaclulateForm(i);
    }

    this.calculateForm.forEach((item, index) => {
      if (index > 0) {
        item = this.selectableCurrencies[index + 1];
      }
    });

    this.calculateDefault();
  }

  /**
   * @description New props pushed to calculateForm for checking currency from - to values vice versa
   * @param {number} index: index of selected currency
   */
  pushCaclulateForm(index: number) {
    this.calculateForm.push({
      from: false,
      to: false,
      input: "",
      currency: this.selectableCurrencies[index],
    });
  }

  /**
   * @description Async function for getting initial currency rates and timestamp
   */
  async calculateDefault() {
    const response: any = await ExchangeController.getExchangeConversion(
      this.selectableCurrencies[1],
      this.selectableCurrencies[0],
      this.defaultCurrencyAmount
    );
    this.resultAmount = response.data;
  }

  /**
   * @description API call with controller & getting result from API response
   * if there is no input, input fields become empty.
   * Regexp to find integers & floating numbers
   * @param {Object} selectedCurrency : Selected currency object
   */
  getExchangeResult(selectedCurrency: any) {
    const from = this.calculateForm.find((item) => item.from === true);
    const to = this.calculateForm.find((item) => item.to === true);

    this.$nextTick(async () => {
      const foundNumbers: any = /[+-]?([0-9]*[.])?[0-9]+/;

      if (!selectedCurrency.input) {
        this.calculateForm.forEach((item) => {
          item.input = "";
        });
      } else {
        if (foundNumbers.test(selectedCurrency.input)) {
          const response: any = await ExchangeController.getExchangeConversion(
            to.currency,
            from.currency,
            selectedCurrency.input
          );

          if (response) {
            var result: any = this.calculateForm.findIndex((t) => t.to == true);
            this.resultAmount = response.data;

            this.calculateForm[result].input = accounting.formatMoney(
              response.data.result,
              this.formattingOptions
            );
          }
        }
      }
    });
  }

  /**
   * @description Function for returning timestamp of the API call via moment.
   * @param {Number} timestamp: timestamp of the response
   */
  getExchangeTime(timestamp: number): string {
    return moment(timestamp * 1000).format("HH:mm");
  }

  /**
   * @description Get focused option's currency and change its from-to values depending on input index.
   * @param {number} index: currency index
   */
  getOldCurrencyVal(index: number) {
    this.calculateForm.forEach((f, idx) => {
      if (idx !== index) {
        f.from = false;
        f.to = true;
      } else {
        f.to = false;
        f.from = true;
      }
    });
  }
}
</script>
<style lang="scss" scoped>
.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  margin: auto;
  padding: 40px;
  margin-top: 10%;
}
.container {
  display: flex;
  justify-content: center;
}
.calculator {
  display: flex;
  align-items: center;
  margin: 20px;
}
.exchange {
  display: flex;
  flex-direction: column;
}
.select {
  height: 30px;
}
.option {
  height: 20px;
}
.equal {
  display: flex;
  height: 25px;
  width: auto;
  margin-left: 35px;
}
</style>