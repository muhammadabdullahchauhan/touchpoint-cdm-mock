import { Routes } from '@angular/router';
import { AccountDetailsComponent } from './pages/account-details/account-details.component';
import { CashDepositComponent } from './pages/cash-deposit/cash-deposit.component';
import { CnicComponent } from './pages/cnic/cnic.component';
import { HomeComponent } from './pages/home/home.component';
import { SummaryComponent } from './pages/summary/summary.component';
import { flowCanDeactivateGuard } from './guards/flow-can-deactivate.guard';
import { accountDetailsFlowGuard, cashDepositFlowGuard, cnicFlowGuard, summaryFlowGuard } from './guards/flow.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'cnic', component: CnicComponent, canActivate: [cnicFlowGuard], canDeactivate: [flowCanDeactivateGuard] },
  { path: 'account-details', component: AccountDetailsComponent, canActivate: [accountDetailsFlowGuard], canDeactivate: [flowCanDeactivateGuard] },
  { path: 'cash-deposit', component: CashDepositComponent, canActivate: [cashDepositFlowGuard], canDeactivate: [flowCanDeactivateGuard] },
  { path: 'summary', component: SummaryComponent, canActivate: [summaryFlowGuard], canDeactivate: [flowCanDeactivateGuard] },
  { path: '**', redirectTo: 'home' },
];
