import {Injectable} from '@angular/core';
import {Specification} from '../models/specification';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends Specification {
  private static customerApi = '';

  constructor(private http: HttpClient) {
    super();
  }

  getAll() {
    const api = CustomerService.customerApi + this.generateSpecificationString();
    return this.http.get(environment.baseUrl + api);
  }
}
