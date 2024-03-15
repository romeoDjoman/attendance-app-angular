import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ClassModel, PodFunctionModel, PodnameModel} from "../../Models/shared-model";
import {map, Observable, of} from "rxjs";
import {SharedService} from "../../Services/shared.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  registerForm: FormGroup;
  classnames: ClassModel[] = [];
  podnames: PodnameModel[] = [];
  podfunctionnames: PodFunctionModel[] = [];
  filteredClassnames!: Observable<ClassModel[]>;
  filteredPodnames!: Observable<PodnameModel[]>;
  filteredPodFunctionnames!: Observable<PodFunctionModel[]>;

  constructor(private shareService: SharedService, private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      podnameControl: ['', Validators.required],
      classnameControl: ['', Validators.required],
      podPositionControl: ['', Validators.required],
      passwordControl: ['', [Validators.required, Validators.minLength(6)]],
      passwordValidationControl: ['', Validators.required]
    }, { validators: this.passwordValidator });
  }

  ngOnInit() {
    this.loadClassNames();
    this.loadPodNames();
    this.loadPodfunctionNames();

    this.filteredClassnames = of('').pipe(
      map(value => this._filterClassnames(value || '')),
    );

    this.filteredPodnames = of('').pipe(
      map(value => this._filterPodnames(value || '')),
    );

    this.filteredPodFunctionnames = of('').pipe(
      map(value => this._filterPodFunctionnames(value || '')),
    );
  }



  loadClassNames() {
    this.shareService.getClassNames().subscribe(
      data => {
        if (data && data.length > 0) {
          this.classnames = data;
          this.filteredClassnames = of('').pipe(
            map(value => this._filterClassnames(value || '')),
          );
        } else {
          console.error('Erreur: Aucune donnée de classe chargée.');
        }
      },
      error => {
        console.error('Erreur lors de la récupération de la liste des classes');
      }
    );
  }

  loadPodNames() {
    this.shareService.getPodNames().subscribe(
      data => {
        if (data && data.length > 0) {
          this.podnames = data;
          this.filteredPodnames = of('').pipe(
            map(value => this._filterPodnames(value || '')),
          );
        } else {
          console.error('Erreur: Aucune donnée de POD chargée.');
        }
      },
      error => {
        console.error('Erreur lors de la récupération de la liste des POD');
      }
    );
  }

  loadPodfunctionNames() {
    this.shareService.getPodFunctions().subscribe(
      data => {
        if (data && data.length > 0) {
          this.podfunctionnames = data;
          this.filteredPodFunctionnames = of('').pipe(
            map(value => this._filterPodFunctionnames(value || '')),
          );
        } else {
          console.error('Erreur: Aucune donnée de POD chargée.');
        }
      },
      error => {
        console.error('Erreur lors de la récupération de la liste des POD');
      }
    );
  }

  private _filterClassnames(value: string): ClassModel[] {
    const filterValue = value.toLowerCase();
    return this.classnames.filter(option => option.class_name.toLowerCase().includes(filterValue));
  }

  private _filterPodnames(value: string): PodnameModel[] {
    const filterValue = value.toLowerCase();
    return this.podnames.filter(option => option.pod_name.toLowerCase().includes(filterValue));
  }

  private _filterPodFunctionnames(value: string): PodFunctionModel[] {
    const filterValue = value.toLowerCase();
    return this.podfunctionnames.filter(option => option.pod_function_name.includes(filterValue));
  }


  onSubmitRegistrationForm() {
    if (this.registerForm.invalid) {
      console.log('Invalid form. Please fill in all fields correctly.');
      return;
    }

    const formData = this.registerForm.value;
    console.log('Form submitted with data:', formData);

    this.shareService.submitRegistrationForm(formData).subscribe(
      response => {
        console.log('Data sent successfully! Server response:', response);
      },
      error => {
        console.error('Error sending data to the server:', error);
      });
    this.registerForm.reset();
  }

  passwordValidator(form: FormGroup) {
    const password = form.get('passwordControl')?.value;
    const confirmPassword = form.get('passwordValidationControl')?.value;

    if (password !== confirmPassword) {
      form.get('passwordValidationControl')?.setErrors({ mismatch: true });
    } else {
      form.get('passwordValidationControl')?.setErrors(null);
    }
  }

}
