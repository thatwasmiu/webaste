import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  standalone: true,
  imports: [CommonModule, RouterLink],
})
export class NotfoundComponent {}
