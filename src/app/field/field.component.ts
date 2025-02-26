import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { FieldInfo } from '../classes/fieldInfo';

@Component({
  selector: 'app-field',
  standalone: true,
  imports: [NgClass],
  templateUrl: './field.component.html',
  styleUrl: './field.component.scss'
})
export class FieldComponent {
  @Input() code: string = '';
  @Input() fieldInfo!: FieldInfo;
  
  constructor() {
  }
  
  accessable: boolean = false;
  
}
