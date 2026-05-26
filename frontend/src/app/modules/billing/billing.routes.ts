import { Routes } from "@angular/router";
import { InvoiceListComponent } from "./invoice-list/invoice-list.component";

export const BILLING_ROUTES: Routes = [
    {path: '', component:InvoiceListComponent}
];
