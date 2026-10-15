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

@Service()
export class OrderService {
    http = inject(HttpClient);
    baseurl = environment.apiBaseUrl;
    
    orderList(pageNum: number, pageSize:number){
        return this.http.get<OrderResponse>(`${this.baseurl}/orders`,{
            params:{page:pageNum, size:pageSize}
        })
    }
}
