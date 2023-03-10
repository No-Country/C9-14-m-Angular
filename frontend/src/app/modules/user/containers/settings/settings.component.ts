import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  constructor(private _route: Router) {}
  logOut() {
    localStorage.clear();
    this._route.navigate(['auth']);
  }
}
