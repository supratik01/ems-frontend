import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Employee } from '../shared/employee.model';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiURL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /*========================================
    CRUD Methods for EMS RESTful API
  =========================================*/

  // HttpClient API get() method => Fetch employees list
  getEmployeesList(): Observable<Employee> {
    return this.http
      .get<Employee>(this.apiURL + '/employees')
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() method => Fetch employee
  getEmployee(id: any): Observable<Employee> {
    return this.http
      .get<Employee>(this.apiURL + '/employees/' + id)
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API post() method => Create employee
  createEmployee(payload: any): Observable<any> {
    return this.http
      .post(
        this.apiURL + '/add-employee',
        payload
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API put() method => Update employee
  updateEmployee(id: any, payload: any): Observable<any> {
    return this.http
      .put(
        this.apiURL + '/edit-employee/' + id,
        payload
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API delete() method => Delete employee
  deleteEmployee(id: any): Observable<any> {
    return this.http
      .delete(this.apiURL + '/delete-employee/' + id)
      .pipe(retry(1), catchError(this.handleError));
  }

  // Error handling
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
