import { Component, inject, signal } from '@angular/core';
import { OrderService, Order } from '../../core/services/order-service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  imports: [MatTableModule, MatPaginatorModule, MatToolbarModule, MatButtonModule],
  selector: 'app-orders',
  styleUrl: './orders.scss',
  templateUrl: './orders.html',
})
export class Orders {
  orderservice = inject(OrderService);
  private router = inject(Router);

  displayedColumns = ['orderNumber', 'orderDate', 'status', 'rxCount', 'actions']
  dataSource = signal<Order[]>([]);
  isLoading = signal(false);
  errorMsg = signal<string | null>(null)

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

 



  onPageChange(event:PageEvent):void{
    this.pageNumber.set(event.pageIndex);
    this.pageSize.set(event.pageSize);

    this.getOrderList(this.pageNumber(), this.pageSize());
  }

  signoutAccount() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

 
}
