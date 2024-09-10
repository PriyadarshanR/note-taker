import { Component, OnInit } from '@angular/core';
import { Note } from '../../models/note.model';
import { NoteService } from '../../services/note.service';
import { Observable } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
// import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: `./notes-list.component.html`,
  styleUrl: './notes-list.component.scss',
})
export class NotesListComponent implements OnInit {
  notes$ !: Observable<Note[]>;

  constructor(private noteService: NoteService, private router: Router) { }

  ngOnInit(): void {
    this.notes$ = this.noteService.getAllNotes();
  }

  viewNote(id: number) {
    this.router.navigate(['/notes', id]);
  }

}
