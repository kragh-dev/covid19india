import { Delta } from './delta'

export class District {
   "district": string;
   "notes": string;
   "active": number;
   "confirmed": number;
   "deceased": number;
   "recovered": number;
   "delta": Delta
}
