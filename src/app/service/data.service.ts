import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Stats } from '../models/stats';
import { Count } from '../models/count';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  getData() {
    return this.http.get(this.baseUrl+'data.json');
  }

  getStateData() {
    return this.http.get(this.baseUrl+'v3/data.json');
  }

  getStateTestData() {
    return this.http.get(this.baseUrl+'state_test_data.json');
  }

  getDistrictData() {
    return this.http.get(this.baseUrl+'v2/state_district_wise.json');
  }

  getCountDaily() {
    return this.http.get(this.baseUrl+'states_daily.json');
  }

  getTimeSeriesData() {
    return this.http.get(this.baseUrl+'v3/timeseries.json');
  }

  getLatestNews(stateName: string) {
    return this.http.get("https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.google.com%2Frss%2Fsearch%3Fq%3Dcovid-19%2520"+stateName+"%26hl%3Den-IN%26gl%3DIN%26ceid%3DIN%253Aen");
  }
}
