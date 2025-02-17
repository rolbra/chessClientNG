import { Component } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-field',
  standalone: true,
  imports: [NgClass],
  templateUrl: './field.component.html',
  styleUrl: './field.component.scss'
})
export class FieldComponent {
  code: string = '&#x265F';
  accessable: boolean = true;
}
