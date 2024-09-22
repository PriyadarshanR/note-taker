import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NoteService } from '../../services/note.service';
import { PrimaryActionDirective } from '../../directives/primary-action.directive';
import { ModalDialogComponent } from '../../modal-dialog/modal-dialog.component';
import { UserAction } from '../../models/model';
import { Priority } from '../../models/note.model';

@Component({
  selector: 'app-note-detail',
  standalone: true,
  imports: [PrimaryActionDirective, ModalDialogComponent],
  templateUrl: `./note-detail.component.html`,
  styleUrl: './note-detail.component.scss',
})
export class NoteDetailComponent implements OnInit {
  note: any;
  confirmDeleteModalVisible = false;
  sortActionPerformed !: string;
  priority = Priority;
  navigationState: NavigationExtras | undefined;

  constructor(private route: ActivatedRoute, private noteService: NoteService, private router: Router) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.sortActionPerformed = this.route.snapshot.paramMap.get('isSorted') ?? 'false';

    id && this.noteService.getNoteById(Number(id)).subscribe(data => {
      this.note = data;
    });

    this.navigationState = history.state;
  }

  editNote() {
    // Redirect to edit page or open a modal for editing
    this.noteService.addEditModal.next(this.note);
  }

  deleteNote() {
    this.confirmDeleteModalVisible = true;
  }

  onUserAction(event: UserAction) {
    if (event == UserAction.Primary) {
      const id = this.route.snapshot.paramMap.get('id');
      this.noteService.deleteNote(Number(id)).subscribe(() => {
        this.router.navigate(['/notes'], { queryParams: { isSorted: this.sortActionPerformed }, state: this.navigationState })
      });
    } else {
      this.confirmDeleteModalVisible = false;
    }
  }
}