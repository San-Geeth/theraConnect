import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiService } from '../../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  therapist: any;
  selectedDate: string = '';
  selectedTime: string = '';
  showModal: boolean = false;
  randomAmount: number = 0;

  // Payment fields
  cardNumber: string = '';
  expiryDate: string = '';
  cvv: string = '';
  email: string = '';

  paymentStatus: string = '';


  constructor(
    private apiService: ApiService,
    private ngxSpinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    const navigation = window.history.state;
    if (navigation && navigation.therapist) {
      this.therapist = navigation.therapist;
    }
    this.randomAmount = this.generateRandomAmount();
  }

  // Function to select the time slot
  selectTime(date: string, time: string) {
    this.selectedDate = date;
    this.selectedTime = time;
  }

  // Function to show the payment modal
  showPaymentModal() {
    if (this.selectedDate && this.selectedTime) {
      this.showModal = true;
    } else {
      alert('Please select a date and time first!');
    }
  }

  // Close the modal
  closeModal() {
    this.showModal = false;
  }

  // Generate random amount to mock payment
  generateRandomAmount() {
    const randomAmount = (Math.random() * (6000 - 2000) + 2000).toFixed(0);
    return parseFloat(randomAmount);
  }

  // Handle payment processing
  processPayment() {
    Swal.fire({
      title: "Are you sure you want to make this payment?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Make Payment!"
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.cardNumber && this.expiryDate && this.cvv && this.email) {
          this.ngxSpinner.show();
          console.log('Processing payment...');
          
          // Mock API call
          const paymentSuccess = this.mockPaymentAPI();

          if (paymentSuccess) {
            this.ngxSpinner.hide();
            this.paymentStatus = 'Payment successful!';
            Swal.fire({
              title: 'Payment Successful!',
              text: `Your payment of $${this.randomAmount} has been processed successfully.`,
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              // After payment is successful, create the meeting
              this.apiService.createMeeting(this.email, 'Therapy Session').subscribe(
                (response) => {
                  if (response && response.meeting && response.meeting.url) {
                    Swal.fire({
                      title: 'Meeting Created!',
                      text: `Your meeting has been scheduled. Join here: ${response.meeting.url}`,
                      icon: 'info',
                      confirmButtonText: 'OK'
                    });
                  } else {
                    Swal.fire({
                      title: 'Error!',
                      text: 'There was an issue creating the meeting.',
                      icon: 'error',
                      confirmButtonText: 'OK'
                    });
                  }
                },
                (error) => {
                  Swal.fire({
                    title: 'Error!',
                    text: 'Failed to create the meeting. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                  });
                }
              );
            });
          } else {
            this.ngxSpinner.hide();
            this.paymentStatus = 'Payment failed. Please try again.';
            Swal.fire({
              title: 'Payment Failed!',
              text: 'There was an issue processing your payment. Please try again.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        } else {
          this.ngxSpinner.hide();
          Swal.fire({
            title: 'Missing Information!',
            text: 'Please fill in all payment details.',
            icon: 'warning',
            confirmButtonText: 'OK'
          });
        }
      }
    });
  }

  // Mock payment API
  mockPaymentAPI(): boolean {
    return Math.random() > 0.5;
  }

  /*
  * This function implemnts with the help of chatGPT
  */
  getAvailableTimes(timeRange: string): string[] {
    const times = timeRange.split('-');
    const startTime = times[0].trim();
    const endTime = times[1].trim();
    const availableTimes: string[] = [];

    // Convert start and end times to Date objects
    const startDate = new Date(`1970-01-01T${startTime}:00`);
    const endDate = new Date(`1970-01-01T${endTime}:00`);

    // Generate available times in hourly intervals
    while (startDate < endDate) {
      const hour = startDate.getHours().toString().padStart(2, '0');
      const minute = startDate.getMinutes().toString().padStart(2, '0');
      availableTimes.push(`${hour}:${minute}`);
      startDate.setMinutes(startDate.getMinutes() + 30); // Add 30 minutes to time
    }

    return availableTimes;
  }
}
