import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Guid } from 'guid-typescript';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CurrentUser } from 'src/app/_model/currentUser';
import { Invoice } from 'src/app/_model/invoice';
import { AccountService } from 'src/app/_services/account.service';
import { FilesService } from 'src/app/_services/files.service';
import { InvoiceCalculatorService } from 'src/app/_services/invoice-calculator.service';
import { InvoiceService } from 'src/app/_services/invoice.service';

interface TaxAndCalculatedValues {
  tax: string;
  value: number;
}

interface InvoiceItem {
  itemName: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

@Component({
  selector: 'app-invoice-preview',
  templateUrl: './invoice-preview.component.html',
  styleUrls: ['./invoice-preview.component.css'],
})
export class InvoicePreviewComponent implements OnInit,OnDestroy {
  invoiceId!: Guid;
  invoice!: Invoice;
  imageName!: string;
  currentUser!: CurrentUser;
  discountValue: number = 0;
  invoiceItems: InvoiceItem[] = [];
  taxes: TaxAndCalculatedValues[] = [];
  getUserInfoSubs:Subscription|undefined;
  getInvoiceSubs:Subscription|undefined;

  constructor(
    private invoiceService: InvoiceService,
    private accountService: AccountService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private invoiceCalculator: InvoiceCalculatorService
  ) {
    this.invoiceId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.getInvoice();
    this.getUserInfo();
  }

  getInvoice() {
   this.getInvoiceSubs = this.invoiceService.getSingleInvoice(this.invoiceId).subscribe(
      (response: any) => {
        this.invoice = response as Invoice;

        this.invoice?.items.forEach((element) => {
          this.invoiceItems.push({
            itemName: element?.item?.name,
            description: element?.description,
            quantity: element?.quantity,
            rate: element?.item?.sellingPrice,
            amount: element?.item?.sellingPrice * element?.quantity,
          });
        });

        // Calculating item taxes for display
        const results = this.invoice?.items.map((item) => {
          const calculatedValue =
            (item?.tax?.taxRate / 100) *
            item?.item?.sellingPrice *
            item.quantity;
          const taxName = `${item?.tax?.taxName}[${item?.tax?.taxRate}%]`;
          return {
            tax: taxName,
            value: calculatedValue,
          };
        });
        this.taxes = this.invoiceCalculator.calculateItemTax(results);
        //Calculating invoice discount's actual value
        this.discountValue =
          (this.invoice?.discount / 100) * this.invoice?.subTotal;
      },
      (error: any) => {
        this.toastr.error(error.message);
      }
    );
  }

  getImageNameFromPath(path: string) {
    return path.substring(path.lastIndexOf('\\') + 1);
  }

  getUserInfo() {
   this.getUserInfoSubs = this.accountService.getCurrentUserInfo().subscribe(
      (response: any) => {
        this.currentUser = response as CurrentUser;
        this.imageName = this.getImageNameFromPath(
          this.currentUser?.companyLogo
        );
      },
      (error: any) => {
        this.toastr.error(error.message);
      }
    );
  }
  
  ngOnDestroy(): void {
   this.getUserInfoSubs?.unsubscribe();
   this.getInvoiceSubs?.unsubscribe();
  }
}
