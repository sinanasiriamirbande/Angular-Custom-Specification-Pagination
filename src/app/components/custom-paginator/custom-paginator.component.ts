import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {PageEvent} from '../../models/specification';
import {MatSelectChange} from '@angular/material/select';

@Component({
  selector: 'app-custom-paginator',
  templateUrl: './custom-paginator.component.html',
  styleUrls: ['./custom-paginator.component.scss']
})
export class CustomPaginatorComponent implements OnInit, OnChanges {
  @Input() data: PageEvent;
  @Output() page: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();
  @Input() pageSizeOptions: number[];
  searchTerm$ = new Subject<number>();
  @Input() pageText = true;

  constructor() {
    this.changePage();
  }

  ngOnInit() {
  }

  next() {
    if (this.data.currentIndex < this.data.length / this.data.pageSize - 1) {
      this.data.currentIndex++;
      this.page.emit(this.data);
    }
  }

  prev() {
    if (this.data.currentIndex > 0) {
      this.data.currentIndex--;
      this.page.emit(this.data);
    }
  }

  endListNumber() {
    const num = this.data.currentIndex * this.data.pageSize + this.data.pageSize;
    if (num > this.data.length) {
      return this.data.length;
    }
    return num;
  }

  changeNumber(e: MatSelectChange) {
    this.data.pageSize = e.value;
    this.data.currentIndex = 0;
    this.page.emit(this.data);
  }

  getLast() {
    if ((this.data.length % this.data.pageSize) === 0) {
      return this.data.currentIndex === Math.floor(this.data.length / this.data.pageSize) - 1;
    } else {
      return this.data.currentIndex === Math.floor(this.data.length / this.data.pageSize);
    }
  }

  lastPage() {
    const divide = this.data.length / this.data.pageSize;
    const remain = this.data.length % this.data.pageSize;
    if (remain !== 0) {
      this.data.currentIndex = Math.floor(divide);
    } else {
      this.data.currentIndex = Math.floor(divide) - 1;
    }
    this.page.emit(this.data);
  }

  firstPage() {
    this.data.currentIndex = 0;
    this.page.emit(this.data);
  }

  getLastPage() {
    const remain = this.data.length % this.data.pageSize;
    if (remain === 0) {
      return Math.floor(this.data.length / this.data.pageSize);
    } else {
      return Math.floor(this.data.length / this.data.pageSize) + 1;
    }
  }

  getPageNumber() {
    return Math.floor((this.data.currentIndex * this.data.pageSize + 1) / this.data.pageSize) + 1;
  }

  changePage() {
    this.changePageListener(this.searchTerm$).subscribe(inputValue => {
      if (inputValue < 1) {
        this.firstPage();
        return;
      }
      if (inputValue > this.getLastPage()) {
        this.lastPage();
        return;
      }
      this.data.currentIndex = inputValue - 1;
      this.page.emit(this.data);
    });
  }

  changePageListener(term: Observable<number>) {
    return term.pipe(debounceTime(1000))
      .pipe(distinctUntilChanged())
      .pipe(switchMap(((value, index) => this.pageChangeSubscriber(value))));
  }

  pageChangeSubscriber(value: number): Observable<number> {
    return new Observable<number>(o => {
      o.next(value);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
}
