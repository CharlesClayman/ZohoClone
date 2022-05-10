import { Injectable } from '@angular/core';

interface InvoiceItemTaxAndValue {
  tax: string;
  value: number;
}

@Injectable({
  providedIn: 'root',
})
export class InvoiceCalculatorService {
  constructor() {}

  private listOfTaxesAndCalculatedValues: InvoiceItemTaxAndValue[] = [];

  calculateItemTax(
    items: InvoiceItemTaxAndValue[],
    persistItems: boolean = false
  ) {
    const taxTypes = new Set(items.map((x) => x.tax));

    const filteredTaxes: InvoiceItemTaxAndValue[] = [];

    taxTypes.forEach((taxType) => {
      const sum = items
        .filter((tax) => tax.tax === taxType)
        .reduce((pre, cur) => {
          if (cur.value) return pre + cur.value;
          return pre;
        }, 0);
      filteredTaxes.push({
        tax: taxType,
        value: +sum.toFixed(2),
      });
    });

    if (persistItems) {
      this.listOfTaxesAndCalculatedValues = filteredTaxes;
    }

    return filteredTaxes;
  }

  calculateSingleItemTax(item: InvoiceItemTaxAndValue, index: number) {
    this.listOfTaxesAndCalculatedValues[index] = item;
    return this.calculateItemTax(this.listOfTaxesAndCalculatedValues);
  }
}
