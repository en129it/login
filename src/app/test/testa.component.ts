import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-testa',
    templateUrl: './testa.component.html',
    styleUrls: ['./testa.component.scss']
  })
export class TestAComponent {

    constructor(private router: Router) {
    }

    public changeRoute() {
        this.router.navigate(['login']);
    }

}
