import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/core/services/category.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  counts;

  constructor(
    private catService: CategoryService
  ) { }

  ngOnInit() {
    this.getCounts();
  }

  getCounts() {
    this.catService.getCounts().subscribe(res => {
      this.counts = res.data;
    });
  }
}
