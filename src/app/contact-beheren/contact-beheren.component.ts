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
  selector: 'app-contact-beheren',
  templateUrl: './contact-beheren.component.html',
  styleUrls: ['./contact-beheren.component.css']
})
export class ContactBeherenComponent implements OnInit {

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
    this.http.post<ContactData>('/api/getContactFromDB.php', {})
      .subscribe(data => {
        this.contactDetails.name = data.name;
        this.contactDetails.address = data.address;
        this.contactDetails.phone = data.phone;
        this.contactDetails.mobilePhone = data.mobilePhone;
        this.contactDetails.email = data.email;
      }, (error1 => {
        console.log('error from DB: ' + error1);
      }));

    const spanTexts = document.querySelectorAll('.contactDetailsText');
    for (let i = 0; i < spanTexts.length; i++) {
      const spanText = spanTexts[i];
      spanText.setAttribute('style', 'display: inline');
    }

    const btnEdits = document.querySelectorAll('.edit');
    for (let i = 0; i < btnEdits.length; i++) {
      const btnEdit = btnEdits[i];
      btnEdit.setAttribute('style', 'display: inline');
    }

    const inpuTexts = document.querySelectorAll('.txtContactDetails');
    for (let i = 0; i < inpuTexts.length; i++) {
      const inputText = inpuTexts[i];
      inputText.setAttribute('style', 'display: none');
    }
    const btnSaves = document.querySelectorAll('.save');
    for (let i = 0; i < btnSaves.length; i++) {
      const btnSave = btnSaves[i];
      console.log(btnSave);
      btnSave.setAttribute('style', 'display: none');
    }
  }

  edit(event) {
    event.preventDefault();
    const target = event.target;

    this.save(event);
    this.setAllBtnEditActive();
    this.setAllTextDisabled();
    this.toggleCurrentText(target);
    this.toggleCurrentBtn(target);
  }

  save(event) {
    event.preventDefault();
    const target = event.target;

    this.showText(target);
    this.showEditButtonAfterSave(target);
  }

  private setAllTextDisabled() {
    // show span
    const spanTexts = document.querySelectorAll('.contactDetailsText');
    for (let i = 0; i < spanTexts.length; i++) {
      const spanText = spanTexts[i];
      spanText.setAttribute('style', 'display: inline');
    }

    // disable input texts
    const inpuTexts = document.querySelectorAll('.txtContactDetails');
    for (let i = 0; i < inpuTexts.length; i++) {
      const inpuText = inpuTexts[i];
      inpuText.setAttribute('style', 'display: none');
    }
  }

  private setAllBtnEditActive() {
    // show span
    const btnEdits = document.querySelectorAll('.edit');
    for (let i = 0; i < btnEdits.length; i++) {
      const btnEdit = btnEdits[i];
      btnEdit.setAttribute('style', 'display: inline');
    }

    // disable input texts
    const btnSaves = document.querySelectorAll('.save');
    for (let i = 0; i < btnSaves.length; i++) {
      const btnSave = btnSaves[i];
      btnSave.setAttribute('style', 'display: none');
    }

  }

  private toggleCurrentText(target: any) {
    const name = this.getNameOfElement(target);

    // toggle span
    const spanText = document.querySelector('#span' + name);
    const styleSpanText = spanText.getAttribute('style') === 'display: inline' ? 'none' : 'inline';
    spanText.setAttribute('style', 'display: ' + styleSpanText);

    // toggle input
    const txtInput = document.querySelector('#txt' + name);
    const styleTxtInput = spanText.getAttribute('style') === 'display: inline' ? 'none' : 'inline';
    txtInput.setAttribute('style', 'display: ' + styleTxtInput);
  }

  private toggleCurrentBtn(target: any) {
    const name = this.getNameOfElement(target);

    // toggle span
    const btnEdit = document.querySelector('#btnEdit' + name);
    const stylebtnEdit = btnEdit.getAttribute('style') === 'display: inline' ? 'none' : 'inline';
    btnEdit.setAttribute('style', 'display: ' + stylebtnEdit);

    // toggle input
    const btnSave = document.querySelector('#btnSave' + name);
    const stylebtnSave = btnSave.getAttribute('style') === 'display: inline' ? 'none' : 'inline';
    btnSave.setAttribute('style', 'display: ' + stylebtnSave);
  }

  private getNameOfElement(target: any) {
    const fullElementName = target.id;

    // get name of element
    const kindOfBtn = fullElementName.indexOf('btnEdit') > -1 ? 'btnEdit' : 'btnSave';
    const parts = fullElementName.split(kindOfBtn);
    return parts[parts.length - 1];
  }

  private showText (target) {
    const name = this.getNameOfElement(target);

    // toggle span
    const spanText = document.querySelector('#span' + name);
    spanText.setAttribute('style', 'display: inline');

    // toggle input
    const txtInput = document.querySelector('#txt' + name);
    txtInput.setAttribute('style', 'display: none');
  }

  private showEditButtonAfterSave(target) {
    const name = this.getNameOfElement(target);

    // toggle btnEdit
    const btnEdit = document.querySelector('#btnEdit' + name);
    btnEdit.setAttribute('style', 'display: inline');

    // toggle btnSave
    const btnSave = document.querySelector('#btnSave' + name);
    btnSave.setAttribute('style', 'display: none');
  }
}
