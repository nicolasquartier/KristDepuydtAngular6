import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

interface ContactData {
  name: string;
  address: string;
  phone: string;
  mobilePhone: string;
  email: string;
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  contactDetails: ContactData = {
    name: '',
    address: '',
    phone: '',
    mobilePhone: '',
    email: '',
  };

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.http.get<ContactData>('../assets/data/contact.json')
      .subscribe(data => {
        this.contactDetails.name = data.name;
        this.contactDetails.address = data.address;
        this.contactDetails.phone = data.phone;
        this.contactDetails.mobilePhone = data.mobilePhone;
        this.contactDetails.email = data.email;
      });
  }

}
