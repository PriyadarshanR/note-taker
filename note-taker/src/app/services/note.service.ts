import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Note } from '../models/note.model';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private apiUrl = 'http://localhost:8082/notes'; // Backend API

  //Used for the Modal Dialog
  //If NewNote or UpdateNote is to be performed
  addEditModal = new Subject<Note | null>();
  noteListUpdated = new BehaviorSubject(true);

  searchByTitle = new Subject<string>();

  constructor(private http: HttpClient) { }

  getAllNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.apiUrl}/getAll`);
  }

  getNoteById(id: number): Observable<Note> {
    return this.http.get<Note>(`${this.apiUrl}?id=${id}`);
  }

  createNote(note: Note): Observable<Note> {
    return this.http.post<Note>(`${this.apiUrl}/save`, note);
  }

  updateNote(id: number, note: Note): Observable<Note> {
    return this.http.put<Note>(`${this.apiUrl}/update?id=${id}`, note);
  }

  deleteNote(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete?id=${id}`);
  }
}

