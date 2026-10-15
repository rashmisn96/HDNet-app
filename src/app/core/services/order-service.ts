// ** @description
// Handles  API calls and the core business logic for the Orders page

import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environment';


export interface Order {
   orderNumber :string;
   orderDate:string;
   status:string;
   rxCount:number;
   shipToState: string;
   lastUpdated:string;
}

export interface OrderResponse {
    items:Order[],
    page:number;
    size:number;
    totalItems:number
}

export type CancelReason =
    | 'CUSTOMER_REQUEST'
    | 'DUPLICATE_ORDER'
    | 'ADDRESS_ISSUE'
    | 'OTHER';

@Service()
export class OrderService {
    http = inject(HttpClient);
    baseurl = environment.apiBaseUrl;
    
    orderList(pageNum: number, pageSize:number){
        return this.http.get<OrderResponse>(`${this.baseurl}/orders`,{
            params:{page:pageNum, size:pageSize}
        })
    }

    cancelOrder(orderNumber: string, reason: CancelReason) {
        return this.http.post<Order>(`${this.baseurl}/orders/${orderNumber}/cancel`, { reason });
    }
}
