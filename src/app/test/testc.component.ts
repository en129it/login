import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-testc',
    templateUrl: './testc.component.html',
    styleUrls: ['./testc.component.scss']
  })
export class TestCComponent {
  constructor(private router: Router, private route: ActivatedRoute) {
  }

  public changeRoute() {
      this.router.navigate(['../testb'], {relativeTo: this.route});
  }

}
