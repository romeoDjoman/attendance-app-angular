import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, Observable} from "rxjs";
import {ClassModel, PodFunctionModel, PodnameModel} from "../Models/shared-model";

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private apiClass = 'assets/Data/class.db.json';
  private apiPod = 'assets/Data/podname.db.json';
  private apiPodFunctions = 'assets/Data/podfunction.db.json';
  private apiSubmitForm = '/assets/Data/submitForm.json';
  private apiSubmitRegistrationForm = '/assets/Data/submitRegistrationForm.json';

  constructor(private http: HttpClient) { }

  getClassNames(): Observable<ClassModel[]> {
    return this.http.get<ClassModel[]>(this.apiClass).pipe(
      catchError((error) => {
        console.error('Error fetching class names:', error);
        throw error;
      })
    );
  }

  getPodNames(): Observable<PodnameModel[]> {
    return this.http.get<PodnameModel[]>(this.apiPod).pipe(
      catchError((error) => {
        console.error('Error fetching pod names:', error);
        throw error;
      })
    );
  }

  getPodFunctions(): Observable<PodFunctionModel[]> {
    return this.http.get<PodFunctionModel[]>(this.apiPodFunctions).pipe(
      catchError((error) => {
        console.error('Error fetching pod functions:', error);
        throw error;
      })
    );
  }

  deleteClassName(id_class: number): Observable<any> {
    const url = `${this.apiClass}/${id_class}`;
    return this.http.delete(url).pipe(
      catchError((error) => {
        console.error(`Error deleting class with ID ${id_class}:`, error);
        throw error;
      })
    );
  }

  

  submitLoginForm(formData: any): Observable<any> {
    return this.http.get<any>(this.apiSubmitForm).pipe(
      catchError((error) => {
        console.error('Error submitting form:', error);
        throw error;
      })
    );
  }



  submitRegistrationForm(formData: any): Observable<any> {
    return this.http.post<any>(this.apiSubmitRegistrationForm, formData).pipe(
      catchError((error) => {
        console.error('Error submitting registration form:', error);
        throw error;
      })
    );
  }
}
