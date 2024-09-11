import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserAction } from '../models/model';
import { PrimaryActionDirective } from '../directives/primary-action.directive';

@Component({
  selector: 'app-modal-dialog',
  standalone: true,
  imports: [CommonModule, PrimaryActionDirective],
  templateUrl: './modal-dialog.component.html',
  styleUrl: './modal-dialog.component.scss'
})
export class ModalDialogComponent {
  @Input({ required: true }) visible !: boolean;
  @Input({ required: true }) header !: string;
  @Input({ required: true }) primaryAction !: string;
  @Input({ required: true }) secondaryAction !: string;

  @Output() onActionClicked = new EventEmitter<UserAction>();

  onPrimaryActionClick() {
    this.onActionClicked.emit(UserAction.Primary);
  }

  closeModal() {
    this.onActionClicked.emit(UserAction.secondary);
  }

}
