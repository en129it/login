import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PwdMgtRoutingModule } from './pwd-mgt-routing.module';
import { ChangePasswordComponent } from './change-password.component';

@NgModule({
  declarations: [ChangePasswordComponent],
  imports: [
    CommonModule,
    PwdMgtRoutingModule
  ]
})
export class PwdMgtModule { }
