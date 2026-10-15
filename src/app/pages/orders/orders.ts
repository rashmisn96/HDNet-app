import { Component, inject, signal } from '@angular/core';
import { OrderService, Order, OrderResponse } from '../../core/services/order-service';
import { MatTableModule } from '@angular/material/table';

@Component({
  imports: [MatTableModule],
  selector: 'app-orders',
  styleUrl: './orders.scss',
  templateUrl: './orders.html',
})
export class Orders {
  orderservice = inject(OrderService);

  displayedColumns = ['orderNumber','orderDate','status','rxCount']
  dataSource = signal<Order[]>([]);
  isLoading = signal(false);

  //pagination
  pageNumber = signal(1);
  pageSize = signal(25);
  pagesizeOptions = [25,50,100,150];
  totalRecords = signal(0);
 
  ngOnInit(){
    this.getOrderList(this.pageNumber(), this.pageSize())
  }

  getOrderList(pageNum: number, pageSize:number){
   this.isLoading.set(true);
   this.orderservice.orderList(pageNum,pageSize).subscribe({
    next:(res)=>{
      this.dataSource.set(res.items);
      this.totalRecords.set(res.totalItems);
      this.isLoading.set(false);
    },
    error:(err)=>{
      this.isLoading.set(false);
      this.dataSource.set([]);
    }
   })
  }

 
}
