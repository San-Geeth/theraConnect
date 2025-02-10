import { Component, OnInit } from '@angular/core';
import { STORAGE_KEY } from '../../constants/app.constants';
import { TherapistsService } from '../../services/therapists.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  therapists: any[] = [];
  filteredTherapists: any[] = [];
  selectedSpecialty: string = '';
  selectedAvailabilityDate: string = '';
  specialties: string[] = [];

  constructor(
    private therapistService: TherapistsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to the therapist data stream
    this.therapistService.therapists$.subscribe((data) => {
      this.therapists = data;
      this.filteredTherapists = this.therapists;
      this.specialties = [
        ...new Set(this.therapists.map((therapist) => therapist.specialties)),
      ];
    });

    // Check if therapists data is available in sessionStorage
    const sessionTherapistsData = sessionStorage.getItem(
      STORAGE_KEY.THERAPIST_DATA
    );
    if (sessionTherapistsData) {
      this.therapists = JSON.parse(sessionTherapistsData);
      this.filteredTherapists = this.therapists;
      this.specialties = [
        ...new Set(this.therapists.map((therapist) => therapist.specialties)),
      ];
    }
  }

  ngOnChanges(): void {
    this.filterTherapists();
  }

  bookSession(therapist: any) {
    this.router.navigate(['/checkout'], { state: { therapist: therapist } });
  }

  /*
   * This function implemented with the help of chatGPT
   */
  filterTherapists(): void {
    this.filteredTherapists = this.therapists.filter((therapist) => {
      // Filter by specialty if selected
      const specialtyMatch = this.selectedSpecialty
        ? therapist.specialties === this.selectedSpecialty
        : true;

      // Filter by availability date if selected
      const availabilityMatch = this.selectedAvailabilityDate
        ? therapist.availability.some((avail: any) => {
            // Ensure the availability date is in 'YYYY-MM-DD' format
            const availabilityDate =
              typeof avail.date === 'string'
                ? avail.date
                : new Date(avail.date).toISOString().split('T')[0];

            // Check if availability date matches selected date
            return availabilityDate === this.selectedAvailabilityDate;
          })
        : true;

      return specialtyMatch && availabilityMatch;
    });
  }
}
