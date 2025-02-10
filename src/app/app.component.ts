import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { STORAGE_KEY } from './constants/app.constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { TherapistsService } from './services/therapists.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'theraConnect';
  therapists: any[] = [];
  isTherapistsSynced: boolean = false;

  constructor(
    private apiService: ApiService,
    private ngxSpinner: NgxSpinnerService,
    private therapistService: TherapistsService
  ) {}

  ngOnInit(): void {
    if(!sessionStorage.getItem(STORAGE_KEY.THERAPISTS_SYNCED)) {
      this.fetchTherapistProfiles();
    }
  }

  fetchTherapistProfiles() {
    this.ngxSpinner.show();
    this.apiService.syncTherapistProfiles().subscribe(
      response => {
        console.log('Therapist Profiles:', response);
        this.therapists = response; // Store the response
        this.isTherapistsSynced = true;
        sessionStorage.setItem(STORAGE_KEY.THERAPISTS_SYNCED, this.isTherapistsSynced.toString());
        sessionStorage.setItem(STORAGE_KEY.THERAPIST_DATA, JSON.stringify(this.therapists));

        // Update the service to notify other components
        this.therapistService.updateTherapists(this.therapists);
      },
      error => {
        console.error('Error fetching therapist profiles:', error);
      },
      () => {
        this.ngxSpinner.hide();
      }
    );
  }
}
