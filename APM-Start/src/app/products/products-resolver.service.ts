import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { Observable, of } from 'rxjs';

// Model
import { ProductsResolved } from './product';
import { ProductService } from './product.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProductsResolver implements Resolve<ProductsResolved> {
    constructor(private productsService: ProductService) {}

    resolve (): Observable<ProductsResolved> {
        const products = [];
        const mappedProducts = this.productsService.getProducts()
            .pipe(
                map(pipedProducts => ({products: pipedProducts})),
                catchError(error => {
                    const message = `Retrieval error: ${error}`;
                    console.log(message);
                    return of({product: null, error: message});
                })
            );

        return of ({products: products});
    }
}
