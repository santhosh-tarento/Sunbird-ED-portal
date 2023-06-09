import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceService, ServerResponse, ToasterService, ConnectionService } from '@sunbird/shared';
import { IImpressionEventInput, IInteractEventEdata } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IAppInfo } from './../../interfaces';
import { AppUpdateService } from '../../../../../core/services/app-update/app-update.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit, OnDestroy {
  instance: string;
  appInfo: IAppInfo;
  public unsubscribe$ = new Subject<void>();
  public telemetryImpression: IImpressionEventInput;
  public telemetryInteractButtonEData: IInteractEventEdata;
  public telemetryInteractEData: IInteractEventEdata;
  isConnected;

  constructor(
    private appUpdateService: AppUpdateService,
    private router: Router, public activatedRoute: ActivatedRoute,
    private toasterService: ToasterService,
    private connectionService: ConnectionService,
    public resourceService: ResourceService
  ) { }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);
    this.getAppInfo();
    this.checkOnlineStatus();
  }

  checkOnlineStatus() {
    this.connectionService.monitor().pipe(takeUntil(this.unsubscribe$)).subscribe(isConnected => {
      this.isConnected = isConnected;
    });
  }

  getAppInfo() {
    this.appUpdateService.getAppInfo().pipe(takeUntil(this.unsubscribe$)).subscribe((response: ServerResponse) => {
      this.appInfo = _.get(response, 'result');
      this.setTelemetryData();
    });
  }

  updateApp(url) {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', url);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  setTelemetryData() {
    this.telemetryImpression = {
      context: { env: _.get(this.activatedRoute.snapshot.data.telemetry, 'env') || 'about-us' },
      edata: {
        type: 'view',
        pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid') || 'about-us',
        uri: this.router.url
      }
    };
    this.telemetryInteractButtonEData = {
      id: 'update-app-btn',
      type: 'click',
      pageid: _.get(this.activatedRoute.snapshot.data.telemetry, 'pageid') || 'about-us',
      extra: {
        newVersion: _.get(this.appInfo, 'updateInfo.version')
      }
    };
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
