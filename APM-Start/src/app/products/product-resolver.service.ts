import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';

import { ProductResolved } from './product';
import { ProductService } from './product.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ProductResolver implements Resolve<ProductResolved> {
    constructor(private productService: ProductService) {}

    resolve (route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<ProductResolved> {

        const id = route.paramMap.get('id');
        if (isNaN(+id)) {
            const message = `Product id was not a number: ${id}`;
            console.log(message);
            return of({product: null, error: message});
        }

        return this.productService.getProduct(+id)
            .pipe(
                map(product => ({product: product})),
                catchError(error => {
                    const message = `Retrieval error: ${error}`;
                    console.log(message);
                    return of({product: null, error: message});
                })
            );
    }
}
