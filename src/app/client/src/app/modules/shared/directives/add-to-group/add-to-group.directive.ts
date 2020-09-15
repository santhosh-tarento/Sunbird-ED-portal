import { Directive, OnInit, HostListener, ElementRef, Input, Inject } from '@angular/core';
import { CsGroupAddableBloc } from '@project-sunbird/client-services/blocs';
import { filter } from 'rxjs/operators';
import { ResourceService } from './../../services/resource/resource.service';
import { NavigationHelperService } from '../../services/navigation-helper/navigation-helper.service';
import { ToasterService } from '../../services/toaster/toaster.service';
import * as _ from 'lodash-es';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CsGroupService } from '@project-sunbird/client-services/services/group/interface';
import { CsModule } from '@project-sunbird/client-services';
import { TelemetryService } from '@sunbird/telemetry';


// tslint:disable-next-line:only-arrow-functions
export function csGroupServiceFactory() {
  return CsModule.instance.groupService;
}

@Directive({
  selector: '[appAddToGroup]',
  providers: [{ provide: 'CS_GROUP_SERVICE', useFactory: csGroupServiceFactory}]
})
export class AddToGroupDirective implements OnInit {

  @Input() pageId: string;
  @Input() identifier: string;
  unsubscribe$ = new Subject<void>();
  groupAddableBlocData: any;
  constructor(
    private ref: ElementRef,
    public navigationHelperService: NavigationHelperService,
    public toasterService: ToasterService,
    public resourceService: ResourceService,
    @Inject('CS_GROUP_SERVICE')
    private csGroupService: CsGroupService,
    private telemetryService: TelemetryService ) { }

  @HostListener('click', ['$event'])
  clickEvent(event) {
    this.addActivityToGroup();
  }

  ngOnInit() {
    CsGroupAddableBloc.instance.state$.pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.groupAddableBlocData = data;
    });
    (this.ref.nativeElement as HTMLButtonElement).style.display = 'none';
    if (CsGroupAddableBloc.instance.initialised) {
      CsGroupAddableBloc.instance.state$.pipe(
        filter((state) => state && state.pageIds.includes(this.pageId))
      ).subscribe(data => {
        (this.ref.nativeElement as HTMLButtonElement).style.display = data ? 'block' : 'none';
      });
    }
  }

  addActivityToGroup() {
    this.sendInteractData();
    const isActivityAdded = _.find(_.get(this.groupAddableBlocData, 'params.groupData.activities'), {id: this.identifier});
    if ( _.isEmpty(isActivityAdded)) {
      const request = {
        activities: [{ id: this.identifier, type: _.get(this.groupAddableBlocData, 'params.contentType') }]
      };
        this.csGroupService.addActivities(_.get(this.groupAddableBlocData, 'groupId'), request).subscribe(response => {
        this.goBack();
        _.get(response, 'error.activities[0].errorCode') === 'EXCEEDED_ACTIVITY_MAX_LIMIT' ?
        this.showErrorMsg(this.resourceService.messages.groups.emsg.m003) :
        this.toasterService.success(this.resourceService.messages.imsg.activityAddedSuccess);
      }, error => {
        console.error('Error while adding activity to the group', error);
        this.goBack();
        this.toasterService.error(this.resourceService.messages.stmsg.activityAddFail);
      });
    } else {
      this.goBack();
      isActivityAdded ? this.showErrorMsg(this.resourceService.messages.emsg.activityAddedToGroup) :
      this.showErrorMsg(this.resourceService.messages.emsg.noAdminRole);
    }
  }

  sendInteractData() {
    const data = {
      context: {
        env: 'groups',
        cdata: [{
          type: _.get(this.groupAddableBlocData, 'params.contentType'),
          id: this.identifier
        }]
      },
      edata: {
        id: 'add-to-group-button',
        type: 'CLICK',
        pageid: this.pageId
      }
    };

    this.telemetryService.interact(data);
  }

  showErrorMsg(msg) {
    this.toasterService.error(msg);
  }

  goBack() {
    this.navigationHelperService.navigateToLastUrl();
  }
}