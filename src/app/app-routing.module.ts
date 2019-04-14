import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'pwdmgt', loadChildren: './pwd-mgt/pwd-mgt.module#PwdMgtModule'},
  {path: '', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: false, enableTracing: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
