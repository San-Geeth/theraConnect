import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly GEMINI_BASE_URL = environment.gemini.BaseURL;
  private readonly GEMINI_API_KEY = environment.gemini.APIKey;

  private readonly FREECONFENRECE_BASE_URL = environment.freeConference.BaseURL;
  private readonly FREECONFENRECE_API_KEY = environment.freeConference.APIKey;

  constructor(private http: HttpClient) {}

  syncTherapistProfiles(): Observable<any[]> {
    return this.http
      .post<any>(`${this.GEMINI_BASE_URL}?key=${this.GEMINI_API_KEY}`, {
        contents: [
          {
            parts: [
              {
                text:
                  'Generate a list of 10 therapist profiles with name, specialties, bio, and availability. Name must be string with the title Dr. and ' +
                  'speciatlity must be one of from [anxiety, depression, relationship issues, addiction, personal growth].' +
                  'Availability must be array with date of month, available time. Year must be 2025 and date must be within current month(feb at the moment), but after current day',
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

  createMeeting(email: string, meetingTitle: string): Observable<any> {
    const body = {
      user: {
        email: email
      },
      meeting: {
        title: meetingTitle,
        startTime: new Date().toISOString(),
        duration: 30,
        timezone: 'Asia/Colombo',
      }
    };

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.FREECONFENRECE_API_KEY}`
    });

    return this.http.post<any>(this.FREECONFENRECE_BASE_URL, body, { headers });
  }

  /*
   * This function is implemnetd with help of chatGPT by providing
   * response returend from the gemini.
   */
  private parseTherapistProfiles(textData: string): any[] {
    let profiles: any[] = [];

    try {
      // Remove the markdown formatting and extra characters before parsing
      const cleanedData = textData.replace(/```json|```/g, '').trim();

      // Parse the cleaned JSON response
      const jsonResponse = JSON.parse(cleanedData);

      // Loop through each profile and extract relevant details
      profiles = jsonResponse.map((profile: any) => {
        const name = profile.name || 'Dr. Unknown'; // Ensure name is defined
        const specialties = profile.specialty || ''; // Ensure specialty is defined
        const bio = profile.bio || 'Bio not available'; // Ensure bio is defined
        const availability = profile.availability || []; // Ensure availability is defined

        // Format availability as an array of objects { date, time }
        const formattedAvailability = availability.map((entry: any) => ({
          date: entry.date || 'Date not specified',
          time: entry.time || 'Time not specified',
        }));

        return { name, specialties, bio, availability: formattedAvailability };
      });
    } catch (error) {
      console.error('Error parsing therapist profiles:', error);
    }

    return profiles;
  }
}
