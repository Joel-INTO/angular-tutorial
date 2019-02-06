import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { Observable, of } from 'rxjs';

// Model
import { ProductsResolved, Product } from './product';
import { ProductService } from './product.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProductsResolver implements Resolve<ProductsResolved> {
    constructor(private productsService: ProductService) {}

    resolve(): Observable<ProductsResolved> {
        return this.productsService.getProducts().pipe(
          map(products => ({ products: products })),
          catchError(error => {
            const message = `Retrieval error: ${error}`;
            console.log(message);
            return of({ products: null, error: message });
          })
        );
    }
}
