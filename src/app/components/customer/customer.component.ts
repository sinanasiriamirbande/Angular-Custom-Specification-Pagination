import {Component, OnInit} from '@angular/core';
import {CustomerService} from '../../services/customer.service';
import {PageEvent} from '../../models/specification';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {


  public dataSource = new MatTableDataSource<any>();
  public displayedColumns = ['name'];

  searchForm: FormGroup;

  constructor(public customerService: CustomerService,
              private fb: FormBuilder) {
  }


  createSearchFormGroup() {
    this.searchForm = this.fb.group({
      name: '',
    });
  }

  pageHandler(e: PageEvent) {
    this.customerService.specificationModel.limit = e.pageSize;
    this.customerService.specificationModel.skip = e.currentIndex * e.pageSize;
    this.getCustomers();
  }

  getCustomers() {
    this.customerService.getAll().subscribe((res: any) => {
      this.dataSource = new MatTableDataSource<any>(res);
      this.customerService.setPageDetailData(res);
    });
  }

  ngOnInit(): void {
    this.createSearchFormGroup();
    this.getCustomers();
    this.onSearchFormChange();
  }

  onSearchFormChange() {
    this.searchForm.valueChanges.subscribe(res => {
      this.customerService.specificationModel.searchKeyword = res;
      this.customerService.specificationModel.skip = 0;
      this.getCustomers();
    });
  }

}
