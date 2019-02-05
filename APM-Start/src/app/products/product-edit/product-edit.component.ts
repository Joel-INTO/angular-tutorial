import { Component, OnInit } from '@angular/core';

import { MessageService } from '../../messages/message.service';
import { ActivatedRoute, Router } from '@angular/router';

import { Product, ProductResolved } from '../product';
import { ProductService } from '../product.service';
import { ProductResolver } from '../product-resolver.service';

@Component({
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  pageTitle = 'Product Edit';
  errorMessage: string;

  private dataIsvalid: { [key: string]: boolean } = {};

  get isDirty(): boolean {
    // TODO: compare values instead of strings
    const state = JSON.stringify(this.originalProduct) !==
                  JSON.stringify(this.currentProduct);
    return state;
  }

  private currentProduct: Product;
  private originalProduct: Product;

  get product(): Product {
    return this.currentProduct;
  }

  set product(value: Product) {
    this.currentProduct = value;
    // Clone the object to retain a copy
    this.originalProduct = { ...value };
  }

  constructor(private productService: ProductService,
              private messageService: MessageService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.route.data.subscribe(
      data => {
        const resolvedData: ProductResolved = data['resolvedData'];
        this.errorMessage = resolvedData.error;
        this.onProductRetrieved(resolvedData.product);
      }
    );
  }

  onProductRetrieved(product: Product): void {
    this.product = product;

    if (!this.product) {
      this.pageTitle = 'No product found';
    } else {
      if (this.product.id === 0) {
        this.pageTitle = 'Add Product';
      } else {
        this.pageTitle = `Edit Product: ${this.product.productName}`;
      }
    }
  }

  deleteProduct(): void {
    if (this.product.id === 0) {
      // Don't delete, it was never saved.
      this.onSaveComplete(`${this.product.productName} was deleted`);
    } else {
      if (confirm(`Really delete the product: ${this.product.productName}?`)) {
        this.productService.deleteProduct(this.product.id)
          .subscribe(
            () => this.onSaveComplete(`${this.product.productName} was deleted`),
            (error: any) => this.errorMessage = <any>error
          );
      }
    }
  }

  isValid(path?: string): boolean {
    this.validate();
    if (path) {
      return this.dataIsvalid[path];
    }
    return (
      this.dataIsvalid &&
      Object.keys(this.dataIsvalid).every((d) => this.dataIsvalid[d] === true));
  }

  reset(): void {
    this.dataIsvalid = null;
    this.currentProduct = null;
    this.originalProduct = null;
  }

  saveProduct(): void {
    if (this.isValid()) {
      if (this.product.id === 0) {
        this.productService.createProduct(this.product)
          .subscribe(
            () => this.onSaveComplete(`The new ${this.product.productName} was saved`),
            (error: any) => this.errorMessage = <any>error
          );
      } else {
        this.productService.updateProduct(this.product)
          .subscribe(
            () => this.onSaveComplete(`The updated ${this.product.productName} was saved`),
            (error: any) => this.errorMessage = <any>error
          );
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete(message?: string): void {
    if (message) {
      this.messageService.addMessage(message);
    }
    this.reset();

    // Navigate back to the product list
    this.router.navigate(['/products']);
  }

  validate(): void {
    // Clear validation object
    this.dataIsvalid = {};

    // Info tab
    if (this.product.productName &&
      this.product.productName.length >= 3 &&
      this.product.productCode) {
      this.dataIsvalid['info'] = true;
    } else {
      this.dataIsvalid['info'] = false;
    }

    // Tags tab
    if (this.product.category &&
      this.product.category.length >= 3) {
      this.dataIsvalid['tags'] = true;
    } else {
      this.dataIsvalid['tags'] = false;
    }
  }
}
