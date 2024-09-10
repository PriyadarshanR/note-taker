import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AddNoteModalComponent } from '../add-note-modal/add-note-modal.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Note } from '../../models/note.model';
import { NoteService } from '../../services/note.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AddNoteModalComponent, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @ViewChild('addNoteModal') addNoteModal!: AddNoteModalComponent;
  @Input() showBackButton = false;


  constructor(private router: Router, private noteService: NoteService) { }

  openModal() {
    this.noteService.addEditModal.next(null);
  }

  goBack() {
    this.router.navigate(['/']);  // Navigate back to the home page (list of notes)
  }
}