# theraConnect

**TheraConnect** is a platform that allows clients to find and book therapy sessions with licensed professionals. The application provides therapist profiles, a search and booking feature, video sessions, and a payment system.

## Test Steps 
- visit and wait for moment to Google AI Studio return resposne for sample therapists list(loader will be shown)
- Search therapist using filters(specilist and availabilty)
- Click on Book Session
- Select prefered time slot.
- Click on Proceed to Payment.
- Fill payment detials.
- Click on submit payment.


## Features

### 1. **Therapist Profile**
The application uses the Google AI Studio API to generate therapist profiles dynamically. When the app is launched, it fetches a list of therapists, each with their name, specialties, bio, and availability for appointments. The fetched data is then formatted and stored in session storage to be used throughout the session.

**How It Works:**
- On app initiation, the app calls the Google AI Studio API to generate a list of 10 therapists. Each therapist has:
  - Name: Prefixed with "Dr."
  - Speciality: From the list of [anxiety, depression, relationship issues, addiction, personal growth]
  - Bio: A short description of the therapist
  - Availability: Dates and times available for sessions in February 2025 (excluding the current day).
  
- The fetched data is parsed and stored in session storage.

```
syncTherapistProfiles(): Observable<any[]> {
    return this.http
      .post<any>(`${this.GEMINI_BASE_URL}?key=${this.GEMINI_API_KEY}`, {
        contents: [
          {
            parts: [
              {
                text:
                  'Generate a list of 10 therapist profiles with name, specialties, bio, and availability. Name must be string with the title Dr. and ' +
                  'specialty must be one of [anxiety, depression, relationship issues, addiction, personal growth]. ' +
                  'Availability must be an array with dates of the month, available time. The year must be 2025, and the date must be within the current month (February at the moment), but after the current day.',
              },
            ],
          },
        ],
      })
      .pipe(
        map((response) => {
          console.log('Response', response);
          const textData = response?.candidates?.[0]?.content?.parts?.[0]?.text;
          return this.parseTherapistProfiles(textData);
        })
      );
}
```

### 2. **Client Search and Booking** 
Clients can filter therapists based on their specialty and availability directly from the homepage. After applying the desired filters, users can click the search button to see the filtered therapist profiles.

 - Filters include specialties such as anxiety, depression, relationship issues, addiction, and personal growth.
 - Availability is also filtered based on the date and time selected.
Note: The booking flow using AI for selecting time slots and confirming appointments is not implemented at the moment.

### 3. **Video Sessions**
The application integrates with the FreeConferenceCall API to enable video sessions between therapists and clients. The integration is set up successfully, but there is an ongoing issue with the API connection that needs to be addressed. Due to development time constraints, this issue has not been fixed yet.

### 4. **Payments**
To simulate the payment process, a mock function has been implemented that returns a random boolean value. Based on the return value:

- Success: If the payment is successful, the user will see a success message with the payment amount.
- Failure: If the payment fails, an appropriate error message will be shown.

# Getting Started
## Prerequisites
To run this application locally, you will need the following:

1. Node.js
2. Angular CLI (Not Necessary)
3. Access to Google AI Studio API (for generating therapist profiles)
4. FreeConferenceCall API credentials (for video sessions)

## Installation
  1. Clone the repository:

  ```
  git clone https://github.com/your-repository/theraconnect.git
  cd theraconnect
  ```

  2. Install the dependencies:
  ```
  npm install
  ```

### Configure the environment variables:

1. Add your Google AI Studio API Key and FreeConferenceCall API credentials in the appropriate environment files.

```
export const environment = {
    production: true,
    gemini: {
        BaseURL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
        APIKey: 
    },
    freeConference: {
        BaseURL: '/api/v1/meetings',
        APIKey: 
    }
};
```

2. Start the development server:

  - if Angular CLI Installed
    ```ng serve```
  - if Angular CLI not installed
  ```npx ng serve```


Visit http://localhost:4200 to see the app in action.