import { Component, OnInit } from '@angular/core';

import { CartService } from '@spartacus/core';

@Component({
  selector: 'cx-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.scss']
})
export class CartDetailsComponent implements OnInit {
  cart$;
  entries$;
  cartLoaded$;

  constructor(protected cartService: CartService) {}

  ngOnInit() {
    this.cart$ = this.cartService.getActive();
    this.entries$ = this.cartService.getEntries();
    this.cartLoaded$ = this.cartService.getLoaded();
  }

  getAllPromotionsForCart(cart) {
    const potentialPromotions = cart.potentialOrderPromotions || [];
    const appliedPromotions = cart.appliedOrderPromotions || [];
    return [...potentialPromotions, ...appliedPromotions];
  }

  cartHasPromotions(cart) {
    const hasPotentialPromotions =
      cart.potentialOrderPromotions && cart.potentialOrderPromotions.length > 0;
    const hasAppliedPromotions =
      cart.appliedOrderPromotions && cart.appliedOrderPromotions.length > 0;
    return hasPotentialPromotions || hasAppliedPromotions;
  }
}
