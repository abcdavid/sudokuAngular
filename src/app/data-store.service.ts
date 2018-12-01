import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../environments/environment';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class DataStoreService {

  constructor(private http:HttpClient) { }

  saveData(data: object): Observable<object> {
  	return this.http.post<object>(environment.dataStoreUrl,data,httpOptions); //.pipe(
	  	//catchError(this.handleError)
  	//);
  }
  updateData(id: string,data: object): Observable<object> {
    return this.http.put<object>(environment.dataStoreUrl+id,data,httpOptions); //.pipe(
      //catchError(this.handleError)
    //);
  }
  readData(id: string): Observable<object> {
    return this.http.get<object>(environment.dataStoreUrl+id,httpOptions); //.pipe(
      //catchError(this.handleError)
    //);
  }
  deleteData(id: string): Observable<object> {
    return this.http.delete<object>(environment.dataStoreUrl+id,httpOptions);//.pipe(
      //catchError(this.handleError)
    //);
  }
  queryData(query: object): Observable<object> {
    return this.http.post<object>(environment.queryDataStoreUrl,query,httpOptions);//.pipe(
      //catchError(this.handleError)
    //);
  }
  private handleError(error: HttpErrorResponse) {
  if (error.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error.message);
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,
    console.error(
      `Backend returned code ${error.status}, ` +
      `body was: ${error.error}`);
  }
  // return an observable with a user-facing error message
  return throwError(
    'Something bad happened; please try again later.');
  }
}
