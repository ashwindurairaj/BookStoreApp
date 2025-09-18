import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../../services/book/book.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-cart',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    RouterLink,
    MatRadioModule,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  userName: string = '';
  userPhone: string = '';
  userAddress: string = '';
  userCity: string = '';
  userState: string = '';
  userType: string = '';
  selectedAddressIndex: number | null = null;
  addresses: any[] = [];
  showSummary: boolean = false;
  isContinueLoading: boolean = false;
  showCustomerDetails: boolean = false;

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit(): void {
    this.fetchCartItems();
    this.loadUserInfo();
  }

  fetchCartItems(): void {
    this.bookService.getCart().subscribe({
      next: (res: any) => {
        this.cartItems = res.result;
      },
      error: (err) => console.error('Failed to fetch cart items:', err),
    });
  }

  loadUserInfo(): void {
    const userInfo = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.userName = userInfo.fullName || '';
    this.userPhone = userInfo.phone || '';
    this.addresses = userInfo.address || [];
    
    // Auto-select the first address if available
    if (this.addresses.length > 0 && this.selectedAddressIndex === null) {
      this.selectedAddressIndex = 0;
    }
  }

  incrementQuantity(item: any): void {
    item.quantityToBuy += 1;
    this.updateCart(item);
  }

  decrementQuantity(item: any): void {
    if (item.quantityToBuy > 1) {
      item.quantityToBuy -= 1;
      this.updateCart(item);
    }
  }

  updateCart(item: any): void {
    this.bookService.updateCart(item._id, item.quantityToBuy).subscribe({
      next: () => {
        this.fetchCartItems();
      },
      error: (err) => console.error('Failed to update cart quantity:', err),
    });
  }

  removeFromCart(cartItemId: string): void {
    this.bookService.removeCart(cartItemId).subscribe({
      next: () => {
        this.fetchCartItems();
      },
      error: (err) => console.error('Failed to remove from cart:', err),
    });
  }

  selectAddress(index: number): void {
    this.selectedAddressIndex = index;
  }

  newAddress = {
    address: '',
    city: '',
    state: '',
    type: 'Home',
  };

  saveAddress(): boolean {
    if (
      !this.newAddress.address.trim() ||
      !this.newAddress.city.trim() ||
      !this.newAddress.state.trim()
    ) {
      alert('Please fill in all fields');
      return false;
    }

    const userInfo = JSON.parse(localStorage.getItem('currentUser') || '{}');
    userInfo.address = userInfo.address || [];
    userInfo.address.push({ ...this.newAddress });

    localStorage.setItem('currentUser', JSON.stringify(userInfo));

    // reload addresses
    this.addresses = userInfo.address;

    // auto-select the newly added address
    this.selectedAddressIndex = this.addresses.length - 1;

    // reset form
    this.newAddress = { address: '', city: '', state: '', type: 'Home' };
    
    return true;
  }

  continueToSummary(): void {
    // Check if user has filled the new address form but hasn't saved it
    const hasFilledNewAddress = this.newAddress.address.trim() && 
                                this.newAddress.city.trim() && 
                                this.newAddress.state.trim();

    // If no saved addresses AND no filled form, show alert
    if (this.addresses.length === 0 && !hasFilledNewAddress) {
      alert('Please add an address first');
      return;
    }

    // If user filled the form but didn't save, save it automatically
    if (hasFilledNewAddress) {
      const saved = this.saveAddress();
      if (!saved) {
        return; // If save failed (validation failed), stop here
      }
    }

    // If still no addresses after trying to save (shouldn't happen but safe check)
    if (this.addresses.length === 0) {
      alert('Please add an address first');
      return;
    }

    // Use the selected address, or default to the first one
    const selectedAddress = this.addresses[this.selectedAddressIndex ?? 0];

    this.userAddress = selectedAddress.address;
    this.userCity = selectedAddress.city;
    this.userState = selectedAddress.state;
    this.userType = selectedAddress.type || 'Home';

    this.showSummary = true;
  }

  orderNow(): void {
    const orderPayload = {
      orders: this.cartItems.map((item) => ({
        product_id: item.product_id._id,
        product_name: item.product_id.bookName,
        product_quantity: item.quantityToBuy,
        product_price: item.product_id.discountPrice,
      })),
    };

    this.bookService.addOrder(orderPayload).subscribe({
      next: (res: any) => {
        const orderId = res.result[0]._id;

        this.cartItems.forEach((item) => {
          this.bookService.removeCart(item._id).subscribe({
            next: () => {
              this.fetchCartItems();
            },
            error: (err) =>
              console.error('Failed to remove from cart:', err),
          });
        });

        this.router.navigate(['home/orderSuccess'], {
          queryParams: {
            orderId: orderId,
            address: this.userAddress,
            city: this.userCity,
            state: this.userState,
            type: this.userType,
          },
        });
      },
      error: (err) => console.error('Failed to place order:', err),
    });
  }
  deleteAddress(index: number): void {
  const userInfo = JSON.parse(localStorage.getItem('currentUser') || '{}');

  if (userInfo.address && userInfo.address.length > index) {
    userInfo.address.splice(index, 1); // remove address at index
    localStorage.setItem('currentUser', JSON.stringify(userInfo));
    this.addresses = userInfo.address;

    // Reset selection if needed
    if (this.addresses.length === 0) {
      this.selectedAddressIndex = null;
    } else if (this.selectedAddressIndex === index) {
      this.selectedAddressIndex = 0; // fallback to first address
    }
  }
}

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => {
      return total + item.product_id.discountPrice * item.quantityToBuy;
    }, 0);
  }
}