import { Component, inject, signal } from '@angular/core';
import { OrderService, Order } from '../../core/services/order-service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from '../../shared/components/dialog-component/dialog-component';
import { CancelReason } from '../../core/services/order-service';

@Component({
  imports: [MatTableModule, MatPaginatorModule, MatToolbarModule, MatButtonModule, MatDialogModule],
  selector: 'app-orders',
  styleUrl: './orders.scss',
  templateUrl: './orders.html',
})
export class Orders {
  orderservice = inject(OrderService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  displayedColumns = ['orderNumber', 'orderDate', 'status', 'rxCount', 'actions']
  dataSource = signal<Order[]>([]);
  username = signal(this.getStoredUsername());
  isLoading = signal(false);
  errorMsg = signal<string | null>(null)
  cancellingOrder = signal<string | null>(null);

  //pagination
  pageNumber = signal(0);
  pageSize = signal(100);
  pagesizeOptions = [25,50,100];
  totalRecords = signal(0);

  cancelOrderFor = ['RECEIVED','PROCESSING'];

 
  ngOnInit(){
    console.log(sessionStorage.getItem('role'))
    this.getOrderList(this.pageNumber(), this.pageSize())
  } 

  getOrderList(pageNum: number, pageSize:number){
   this.isLoading.set(true);
   this.errorMsg.set(null);
   this.orderservice.orderList(pageNum,pageSize).subscribe({
    next:(res)=>{
      this.dataSource.set(res.items);
      this.totalRecords.set(res.totalItems);
      this.isLoading.set(false);
    },
    error:(err)=>{
      this.isLoading.set(false);
      this.dataSource.set([]);
      this.errorMsg.set(err.error?.message ?? 'Unable to load orders. Please try again.');
    }
   })
  }

  canCancelOrder(order:Order):boolean{
    if (!this.cancelOrderFor.includes(order.status)) {
      return false;
    }

    try {
      const roles = JSON.parse(sessionStorage.getItem('roles') ?? '[]');
      return Array.isArray(roles) && roles.includes('HDNet Cancel');
    } catch {
      return false;
    }

  }



  cancelOrder(order: Order): void {
    const dialogRef = this.dialog.open<DialogComponent, void, CancelReason>(DialogComponent);
    dialogRef.afterClosed().subscribe((reason) => {
      if (!reason) return;

      this.cancellingOrder.set(order.orderNumber);
      this.errorMsg.set(null);
      this.orderservice.cancelOrder(order.orderNumber, reason).subscribe({
        next: (updatedOrder) => {
          this.updateOrder(updatedOrder);
          this.cancellingOrder.set(null);
        },
        error: (err) => {
          const currentOrder = err.error?.order as Order | undefined;
          if (currentOrder) this.updateOrder(currentOrder);
          this.errorMsg.set(err.error?.message ?? 'Unable to cancel the order. Please try again.');
          this.cancellingOrder.set(null);
        },
      });
    });
  }

  private updateOrder(updatedOrder: Order): void {
    this.dataSource.update((orders) =>
      orders.map((order) =>
        order.orderNumber === updatedOrder.orderNumber ? updatedOrder : order,
      ),
    );
  }

  onPageChange(event:PageEvent):void{
    this.pageNumber.set(event.pageIndex);
    this.pageSize.set(event.pageSize);

    this.getOrderList(this.pageNumber(), this.pageSize());
  }

  signoutAccount() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('roles');
    sessionStorage.removeItem('username');
    this.router.navigate(['/login']);
  }

  private getStoredUsername(): string {
    const username = sessionStorage.getItem('username');
    if (!username) return '';

    try {
      const parsedUsername: unknown = JSON.parse(username);
      return typeof parsedUsername === 'string' ? parsedUsername : username;
    } catch {
      return username;
    }
  }

 
}
