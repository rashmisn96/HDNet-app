import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import type { CancelReason } from '../../../core/services/order-service';

@Component({
  imports: [MatDialogModule, FormsModule],
  selector: 'app-dialog-component',
  styleUrl: './dialog-component.scss',
  templateUrl: './dialog-component.html',
})
export class DialogComponent {
  reason: CancelReason = 'CUSTOMER_REQUEST';
  readonly cancelReasons: { value: CancelReason; label: string }[] = [
    { value: 'CUSTOMER_REQUEST', label: 'Customer Request' },
    { value: 'DUPLICATE_ORDER', label: 'Duplicate Order' },
    { value: 'ADDRESS_ISSUE', label: 'Address Issue' },
    { value: 'OTHER', label: 'Other' },
  ];
}
