import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sc-logistics-list',
  templateUrl: './home.template.html',
  styleUrls: ['./home.style.scss'],
  standalone: true,
  imports: [CommonModule],
  providers: [],
})
export class HomeConponent implements OnInit, AfterViewInit {
  ngOnInit(): void {}
  ngAfterViewInit(): void {}
}
