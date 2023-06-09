import { Component, EventEmitter, OnInit,Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { ResourceService, UtilService, ConfigService } from '@sunbird/shared';
import { Observable } from 'rxjs';
import { TelemetryService } from '@sunbird/telemetry';
import { IStartEventInput, IImpressionEventInput, IInteractEventEdata } from '@sunbird/telemetry';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-signup-basic-info',
  templateUrl: './signup-basic-info.component.html',
  styleUrls: ['./signup-basic-info.component.scss' , '../signup/signup_form.component.scss']
})
export class SignupBasicInfoComponent implements OnInit, OnChanges {

  @Output() subformInitialized: EventEmitter<{}> = new EventEmitter<{}>();
  @Output() triggerIsMinor: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() triggerNext: EventEmitter<boolean> = new EventEmitter<boolean>();
  public personalInfoForm: FormGroup;
  @Input() isIOSDevice;
  @Input() telemetryImpression;
  @Input() submitInteractEdata;
  @Input() telemetryCdata;
  @Input() routeParams;
  @Input() registerFormConfig;
  birthYearOptions: Array<string> = [];
  filteredYOB: Observable<string[]>;
  yearOfBirth: string;
  isMinor: boolean;
  @Input() startingForm: object;
  instance: ''
  
  constructor(
    public resourceService: ResourceService, public telemetryService: TelemetryService,
    public utilService: UtilService, public configService: ConfigService, private _fb: FormBuilder) { }
  

  ngOnInit(): void {
    this.instance = _.upperCase(this.resourceService.instance || 'SUNBIRD');
    this.initializeForm();
    this.initiateYearSelecter();
    // @ts-ignore
    this.getFilteredYOB();
    // console.log('Global Object data => ', this.startingForm); // TODO: log!
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.registerFormConfig?.currentValue?.ageAboveEighteen) {
      let endYear = new Date().getFullYear() - this.configService.constants.SIGN_UP.MINIMUN_AGE;
      const startYear = endYear - this.configService.constants.SIGN_UP.MAX_YEARS;
      if (!this.personalInfoForm) {
        this.initializeForm();
      }
      this.personalInfoForm?.get('yearOfBirth')?.setValidators([Validators.min(startYear), Validators.max(endYear)]);
      this.personalInfoForm?.updateValueAndValidity();
      this.initiateYearSelecter();
      this.getFilteredYOB();
    }
  }

  initializeForm(): void {
    const endYear = new Date().getFullYear();
    const startYear = endYear - this.configService.constants.SIGN_UP.MAX_YEARS;

    this.personalInfoForm = this._fb.group({
      name: ['', Validators.required],
      yearOfBirth: ['', [Validators.required, 
        Validators.pattern(/^-?(0|[1-9]\d*)?$/),
        Validators.min(startYear),
        Validators.max(endYear), 
      ]]
    });
  }

  getFilteredYOB(): void {
    this.filteredYOB = this.personalInfoForm.controls.yearOfBirth.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.birthYearOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  public isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  next() {
    if(this.personalInfoForm.valid) {
      let userDetails;
      if(localStorage.getItem('guestUserDetails')) {
        userDetails = JSON.parse(localStorage.getItem('guestUserDetails'));
      } else {
        userDetails = {name: this.personalInfoForm.controls.name.value}
      }
      userDetails.name = this.personalInfoForm.controls.name.value;
      localStorage.setItem('guestUserDetails', JSON.stringify(userDetails));
      const signupStage1Details = {
        name: userDetails.name,
        yearOfBirth: this.personalInfoForm.controls.yearOfBirth.value,
        isMinor: this.isMinor
      }
      this.subformInitialized.emit(signupStage1Details);
      this.triggerNext.emit();
    } else {
      console.log("Invalid form");
    }
  }

  initiateYearSelecter(newEndYear?: number) {
    this.birthYearOptions = [];
    let endYear = (this.registerFormConfig?.ageAboveEighteen) ? (new Date().getFullYear() - this.configService.constants.SIGN_UP.MINIMUN_AGE) : new Date().getFullYear();
    const startYear = endYear - this.configService.constants.SIGN_UP.MAX_YEARS;
    for (let year = endYear; year > startYear; year--) {
      this.birthYearOptions.push(year.toString());
    }
  }

  changeBirthYear(selectedBirthYear) {
    let _selectedYOB = parseInt(_.get(selectedBirthYear, 'option.value'));
    if (this.isIOSDevice) {
      _selectedYOB = parseInt(selectedBirthYear.target.value);
      this.personalInfoForm.controls.yearOfBirth.setValue(_selectedYOB);
    }
    const currentYear = new Date().getFullYear();
    this.yearOfBirth = `${_selectedYOB}`;
    const userAge = currentYear - _selectedYOB;
    this.isMinor = userAge < this.configService.constants.SIGN_UP.MINIMUN_AGE;
    this.triggerIsMinor.emit(this.isMinor);
  }

}
