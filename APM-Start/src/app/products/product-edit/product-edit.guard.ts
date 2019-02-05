import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductEditComponent } from './product-edit.component';

@Injectable({
  providedIn: 'root'
})
export class ProductEditGuard implements CanDeactivate<ProductEditComponent> {
  canDeactivate(component: ProductEditComponent,
                currentRoute: ActivatedRouteSnapshot,
                currentState: RouterStateSnapshot,
                nextState?: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {

    // Check if any product unsaved changes, if so, display warning, confirm to deactivate
    if (component.isDirty) {
      const productName = component.product.productName || 'New Product';
      return confirm(`Navigate away and loose all the changes to ${productName}`);
    }

    // If product is unchanged, we can deactivate
    return true;
  }
}
