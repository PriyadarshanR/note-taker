import { Component, OnInit } from '@angular/core';
import { Note } from '../../models/note.model';
import { NoteService } from '../../services/note.service';
import { Observable } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalDialogComponent } from '../../modal-dialog/modal-dialog.component';
import { UserAction } from '../../models/model';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [RouterLink, CommonModule, ModalDialogComponent],
  templateUrl: `./notes-list.component.html`,
  styleUrl: './notes-list.component.scss',
})
export class NotesListComponent implements OnInit {
  notes$ !: Observable<Note[]>;
  confirmDeleteModalVisible = false;

  constructor(private noteService: NoteService, private router: Router) { }

  ngOnInit(): void {
    this.notes$ = this.noteService.getAllNotes();
  }

  viewNote(id: number) {
    this.router.navigate(['/notes', id]);
  }

  onCloseIconClick() {
    this.confirmDeleteModalVisible = true;
  }

  onUserAction(event: UserAction) {
    if (event == UserAction.Primary) {
      //To Do
    } else {
      this.confirmDeleteModalVisible = false;
    }
  }

}
