import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-success',
  imports: [RouterLink],
  templateUrl: './order-success.component.html',
  styleUrl: './order-success.component.scss',
})
export class OrderSuccessComponent implements OnInit {
  orderId: string = '';
   address: string = '';
  city: string = '';
  state: string = '';
  type: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.orderId = params['orderId'];
      this.address = params['address'];
      this.city = params['city'];
      this.state = params['state'];
      this.type = params['type'];
    });
  }
}
