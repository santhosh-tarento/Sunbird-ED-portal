import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserOnboardingComponent, Stage } from './user-onboarding.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SuiModule } from 'ng2-semantic-ui';
import { SharedModule } from '@sunbird/shared';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TelemetryService } from '@sunbird/telemetry';
import { TenantService } from '@sunbird/core';
import { PopupControlService } from '../../../../service/popup-control.service';
import { APP_BASE_HREF } from '@angular/common';

describe('UserOnboardingComponent', () => {
  let component: UserOnboardingComponent;
  let fixture: ComponentFixture<UserOnboardingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserOnboardingComponent],
      imports: [
        SuiModule,
        SharedModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [TelemetryService, TenantService, PopupControlService, {provide: APP_BASE_HREF, useValue: 'test'}],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    const tenantService = TestBed.get(TenantService);
    const tenantData = { 'appLogo': '/appLogo.png', 'favicon': '/favicon.ico', 'logo': '/logo.png', 'titleName': 'SUNBIRD' };
    tenantService._tenantData$.next({ err: null, tenantData: tenantData });
    component.ngOnInit();
    expect(component.tenantInfo.titleName).toEqual('SUNBIRD');
    expect(component.tenantInfo.logo).toEqual('/logo.png');
  });

  it('should call userTypeSubmit', () => {
    component.userTypeSubmit();
    expect(component.stage).toBe(Stage.LOCATION_SELECTION);
  });

  it('should call locationSubmit', () => {
    const popupControlService = TestBed.get(PopupControlService);
    component.onboardingModal = {
      deny: () => { }
    };
    spyOn(popupControlService, 'changePopupStatus');
    spyOn(component.onboardingModal, 'deny');
    spyOn(component.close, 'emit');
    component.locationSubmit();
    expect(popupControlService.changePopupStatus).toHaveBeenCalledWith(true);
    expect(component.onboardingModal.deny).toHaveBeenCalled();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should unsubscribe subject', () => {
    spyOn(component['unsubscribe$'], 'next');
    spyOn(component['unsubscribe$'], 'complete');
    component.ngOnDestroy();
    expect(component['unsubscribe$'].next).toHaveBeenCalled();
    expect(component['unsubscribe$'].complete).toHaveBeenCalled();
  });
});
