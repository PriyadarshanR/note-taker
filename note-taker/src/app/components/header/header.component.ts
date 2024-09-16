import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AddNoteModalComponent } from '../add-note-modal/add-note-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
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
export class HeaderComponent implements OnInit {
  @ViewChild('addNoteModal') addNoteModal!: AddNoteModalComponent;
  @Input() showBackButton = false;
  sortActionPerformed!: string;


  constructor(private router: Router, private noteService: NoteService) { }

  ngOnInit(): void {
    this.noteService.sortNotesOrderBy.subscribe((sortAction: string) => {
      this.sortActionPerformed = sortAction;
    })
  }

  openModal() {
    this.noteService.addEditModal.next(null);
  }

  goBack() {
    this.router.navigate(['/notes'], { queryParams: { isSorted: this.sortActionPerformed } });  // Navigate back to the home page (list of notes)
  }

  searchTitle(searchString: string) {
    this.noteService.searchByTitle.next(searchString)
  }

  sortByDescPriority() {
    this.noteService.sortNotesOrderBy.next('desc');
  }

  sortByAscPriority() {
    this.noteService.sortNotesOrderBy.next('asc');
  }

  removeSort() {
    this.noteService.sortNotesOrderBy.next('false');
  }

  addFilter() {

  }

  removeFilter() {

  }
}