import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { ClassModel, PodnameModel } from "../../Models/shared-model";
import {map, Observable, of, startWith} from "rxjs";
import { SharedService } from "../../Services/shared.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  classnames: ClassModel[] = [];
  podnames: PodnameModel[] = [];
  filteredClassnames!: Observable<ClassModel[]>;
  filteredPodnames!: Observable<PodnameModel[]>;

  constructor(private shareService: SharedService, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      podnameControl: ['', Validators.required],
      classnameControl: ['', Validators.required],
      passwordControl: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadClassNames();
    this.loadPodNames();

    this.filteredClassnames = of('').pipe(
      map(value => this._filterClassnames(value || '')),
    );

    this.filteredPodnames = of('').pipe(
      map(value => this._filterPodnames(value || '')),
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
          // Vous pouvez également lancer une exception si nécessaire
          // throw new Error('Aucune donnée de classe chargée.');
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
          // Vous pouvez également lancer une exception si nécessaire
          // throw new Error('Aucune donnée de POD chargée.');
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

  onSubmitLoginForm() {
    if (this.loginForm.invalid) {
      console.log('Formulaire invalide. Veuillez remplir tous les champs correctement.');
      return;
    }

    const formData = this.loginForm.value;
    console.log('Formulaire soumis avec les données :', formData);

    this.shareService.submitLoginForm(formData).subscribe(
      response => {
        console.log('Données envoyées avec succès ! Réponse du serveur :', response);
      },
      error => {
        console.error('Erreur lors de l\'envoi des données au serveur :', error);
      });
    this.loginForm.reset();
  }

}
