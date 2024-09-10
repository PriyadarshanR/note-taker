import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appPrimaryAction]',
  standalone: true
})
export class PrimaryActionDirective {

  constructor(private elRef: ElementRef) {
    this.elRef.nativeElement.style.background = '#1e3a8a';
    this.elRef.nativeElement.style.color = 'white';
  }

}
