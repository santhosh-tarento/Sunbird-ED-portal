import { ToasterService } from '../../services/';
import { ResourceService, NavigationHelperService } from '../../services';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html'
})

/**
 * Redirectcomponent is invoked when
 * the route learn/redirect is called
 */
export class RedirectComponent implements OnInit, AfterViewInit {
  /**
   * To get the values of telemetry data
   * from activatedRoute
   */
  private activatedRoute: ActivatedRoute;
  /**
   * telemetryImpression
   */
  telemetryImpression: IImpressionEventInput;
  constructor(public resourceService: ResourceService, activatedRoute: ActivatedRoute, public router: Router,
     public toasterService: ToasterService, public navigationhelperService: NavigationHelperService) {
    this.activatedRoute = activatedRoute;
    this.router = router;
  }
  /**
   * oninit the component opens new window tab with the redirectUrl values in the url
   */
  ngOnInit() {
    this.toasterService.warning(this.resourceService.messages.imsg.m0034);
    this.openWindow();
  }
  openWindow() {
    setTimeout(() => {
      window.open(window.redirectUrl, '_self');
    }, 1500);
  }
  ngAfterViewInit () {
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: 'redirect'
        },
        edata: {
          type: this.activatedRoute.snapshot.data.telemetry.type,
          pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
          uri: window.redirectUrl,
          duration: this.navigationhelperService.getPageLoadTime()
        }
      };
    });
  }
  /**
   * Close the window on click of goBack button
   */
  goBack() {
    window.close();
  }
}
