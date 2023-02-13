
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { combineLatest, forkJoin } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import * as _ from 'lodash-es';

import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui-v9';
import { IImpressionEventInput } from '@sunbird/telemetry';
import { SearchService, UserService, ISort, FrameworkService } from '@sunbird/core';
import { ServerResponse, PaginationService, ConfigService, ToasterService, IPagination, ResourceService, ILoaderMessage, INoResultMessage, IContents, NavigationHelperService } from '@sunbird/shared';

import { WorkSpace } from './../../../classes/workspace';
import { WorkSpaceService } from './../../../services';
import { ContentIDParam } from './../../../interfaces/delteparam';

@Component({
    selector: 'app-students-list',
    templateUrl: './students-list.component.html',
    styleUrls: ['./students-list.component.scss']
})

export class StudentsListComponent extends WorkSpace implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('modalTemplate')
    public modalTemplate: ModalTemplate<{ data: string }, string, string>;

    /**
     * state for content editior
    */
    state: string;

    // /**
    //  * To navigate to other pages
    //  */
    // route: Router;

    /**
     * To send activatedRoute.snapshot to router navigation
     * service for redirection to draft  component
    */
    private activatedRoute: ActivatedRoute;

    /**
     * Contains unique contentIds id
    */
    contentIds: string;

    /**
     * Contains list of students
    */
    allStudents: Array<IContents> = [];

    /**
     * To show / hide loader
    */
    showLoader = true;

    /**
     * loader message
    */
    loaderMessage: ILoaderMessage;

    /**
     * To show / hide no result message when no result found
    */
    noResult = false;

    /**
     * lock popup data for locked contents
    */
    lockPopupData: object;

    /**
     * To show content locked modal
    */
    showLockedContentModal = false;

    /**
     * To show / hide error
    */
    showError = false;

    /**
     * no result  message
    */
    noResultMessage: INoResultMessage;

    /**
      * For showing pagination on draft list
    */
    private paginationService: PaginationService;

    /**
    * To get url, app configs
    */
    public config: ConfigService;

    /**
    * Contains page limit of inbox list
    */
    pageLimit: number;

    /**
    * Current page number of inbox list
    */
    pageNumber = 1;

    /**
    * totalCount of the list
    */
    totalCount: Number;

    /**
      status for preselection;
    */
    status: string;

    /**
    route query param;
    */
    queryParams: any;

    /**
    redirectUrl;
    */
    public redirectUrl: string;

    /**
    filterType;
    */
    public filterType: string;

    /**
    sortingOptions ;
    */
    public sortingOptions: Array<ISort>;

    /**
    sortingOptions ;
    */
    sortByOption: string;

    /**
    sort for filter;
    */
    sort: object;

    /**
     * inviewLogs
    */
    inviewLogs = [];

    /**
    * value typed
    */
    query: string;

    /**
    * Contains returned object of the pagination service
    * which is needed to show the pagination on all content view
    */
    pager: IPagination;

    /**
    * To show toaster(error, success etc) after any API calls
    */
    private toasterService: ToasterService;

    /**
     * telemetryImpression
    */
    telemetryImpression: IImpressionEventInput;

    /**
    * To call resource service which helps to use language constant
    */
    public resourceService: ResourceService;

    /**
    * To store all the collection details to be shown in collection modal
    */
    public collectionData: Array<any>;

    /**
    * Flag to show/hide loader on first modal
    */
    private showCollectionLoader: boolean;

    /**
    * To define collection modal table header
    */
    private headers: any;

    /**
    * To store deleting content id
    */
    private currentContentId: ContentIDParam;

    /**
    * To store deleteing content type
    */
    private contentMimeType: string;

    /**
     * To store modal object of first yes/No modal
     */
    private deleteModal: any;

    // location: any;
    assessment: any = {}

    /**
     * To show/hide collection modal
     */
    public collectionListModal = false;
    public isQuestionSetFilterEnabled: boolean;

    /**
      * Constructor to create injected service(s) object
      Default method of Draft Component class
      * @param {SearchService} SearchService Reference of SearchService
      * @param {UserService} UserService Reference of UserService
      * @param {Router} route Reference of Router
      * @param {PaginationService} paginationService Reference of PaginationService
      * @param {ActivatedRoute} activatedRoute Reference of ActivatedRoute
      * @param {ConfigService} config Reference of ConfigService
    */

    constructor(
        public searchService: SearchService,
        public navigationhelperService: NavigationHelperService,
        public workSpaceService: WorkSpaceService,
        public frameworkService: FrameworkService,
        private router: Router,
        private location: Location,
        paginationService: PaginationService,
        activatedRoute: ActivatedRoute,
        userService: UserService,
        toasterService: ToasterService,
        resourceService: ResourceService,
        config: ConfigService,
        public modalService: SuiModalService) {

        super(searchService, workSpaceService, userService);

        console.log('get state - ', this.location.getState());
        const routerStateObj: any = this.location.getState();
        this.assessment = routerStateObj?.assessment;
        console.log('this.assessment - ', this.assessment);

        this.paginationService = paginationService;
        this.activatedRoute = activatedRoute;
        this.toasterService = toasterService;
        this.resourceService = resourceService;
        this.config = config;
        this.state = 'allcontent';
        this.loaderMessage = {
            'loaderMessage': this.resourceService.messages.stmsg.m0110,
        };
        this.sortingOptions = this.config.dropDownConfig.FILTER.RESOURCES.sortingOptions;        
    }

    ngOnInit() {
        this.workSpaceService.questionSetEnabled$
            .subscribe((response: any) => {
                this.isQuestionSetFilterEnabled = response.questionSetEnablement;
            });

        this.filterType = this.config.appConfig.allmycontent.filterType;
        this.redirectUrl = this.config.appConfig.allmycontent.inPageredirectUrl;

        combineLatest([this.activatedRoute.params, this.activatedRoute.queryParams])
            .pipe(
                debounceTime(10),
                map(([params, queryParams]) => ({ params, queryParams }) )
            )
            .subscribe(bothParams => {
                if (bothParams.params.pageNumber) {
                    this.pageNumber = Number(bothParams.params.pageNumber);
                }
                this.queryParams = bothParams.queryParams;
                this.query = this.queryParams['query'];
                this.fecthAllContent(this.config.appConfig.WORKSPACE.PAGE_LIMIT, this.pageNumber, bothParams);
            });
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.telemetryImpression = {
                context: {
                    env: this.activatedRoute.snapshot.data.telemetry.env
                },
                edata: {
                    type: this.activatedRoute.snapshot.data.telemetry.type,
                    pageid: this.activatedRoute.snapshot.data.telemetry.pageid,
                    subtype: this.activatedRoute.snapshot.data.telemetry.subtype,
                    uri: this.activatedRoute.snapshot.data.telemetry.uri + '/' + this.activatedRoute.snapshot.params.pageNumber,
                    visits: this.inviewLogs,
                    duration: this.navigationhelperService.getPageLoadTime()
                }
            };
        });
    }

    /**
    * This method sets the make an api call to get all UpForReviewContent with page No and offset
    */
    fecthAllContent(limit: number, pageNumber: number, bothParams) {
        this.showLoader = true;
        if (bothParams.queryParams.sort_by) {
            const sort_by = bothParams.queryParams.sort_by;
            const sortType = bothParams.queryParams.sortType;
            this.sort = {
                [sort_by]: _.toString(sortType)
            };
        } else {
            this.sort = { lastUpdatedOn: this.config.appConfig.WORKSPACE.lastUpdatedOn };
        }

        const searchParams = {
            filters: {
                "profileUserType.type" : "student"
            },
            limit: limit,
            // offset: (pageNumber - 1) * (limit),
            pageNumber: 1,
            query: _.toString(bothParams.queryParams.query),
            sort_by: this.sort,
            type: 'studentList'
        };

        this.search(searchParams)
            .subscribe((data: ServerResponse) => {
                if (data.result.response.count && !_.isEmpty(data.result.response.content)) {
                    this.allStudents = data.result.response.content;
                    this.totalCount = data.result.response.count;
                    this.pager = this.paginationService.getPager(data.result.response.count, pageNumber, limit);
                    this.showLoader = false;
                    this.noResult = false;
                } else {
                    this.showError = false;
                    this.noResult = true;
                    this.showLoader = false;
                    this.noResultMessage = {
                        'messageText': 'messages.stmsg.m0006'
                    };
                }
            }, (err: ServerResponse) => {
                this.showLoader = false;
                this.noResult = false;
                this.showError = true;
                this.toasterService.error(this.resourceService.messages.fmsg.m0081);
            });
    }

    public deleteConfirmModal(contentIds, mimeType) {
        this.currentContentId = contentIds;
        this.contentMimeType = mimeType;
        this.showCollectionLoader = false;
        const config = new TemplateModalConfig<{ data: string }, string, string>(this.modalTemplate);
        config.isClosable = false;
        config.size = 'small';
        config.transitionDuration = 0;
        config.mustScroll = true;
        this.modalService.open(config);
        setTimeout(() => {
            let element = document.getElementsByTagName('sui-modal');
            if (element && element.length > 0)
                element[0].className = 'sb-modal';
        }, 10);
    }

    /**
    * This method checks whether deleting content is linked to any collections, if linked to collection displays collection list pop modal.
    */
    public checkLinkedCollections(modal) {
        if (!_.isUndefined(modal)) {
            this.deleteModal = modal;
        }
        this.showCollectionLoader = false;
        if (this.contentMimeType === 'application/vnd.ekstep.content-collection') {
            this.deleteContent(this.currentContentId);
            return;
        }

        this.getLinkedCollections(this.currentContentId)
            .subscribe((response) => {
                const count = _.get(response, 'result.count');
                if (!count) {
                    this.deleteContent(this.currentContentId);
                    return;
                }
                this.showCollectionLoader = true;
                const collections = _.get(response, 'result.content', []);

                const channels = _.map(collections, (collection) => {
                    return _.get(collection, 'channel');
                });

                const channelMapping = {};
                forkJoin(_.map(channels, (channel: string) => {
                    return this.getChannelDetails(channel);
                })).subscribe((forkResponse) => {
                    this.collectionData = [];
                    _.forEach(forkResponse, channelResponse => {
                        const channelId = _.get(channelResponse, 'result.channel.code');
                        const channelName = _.get(channelResponse, 'result.channel.name');
                        channelMapping[channelId] = channelName;
                    });

                    _.forEach(collections, collection => {
                        const obj = _.pick(collection, ['contentType', 'board', 'medium', 'name', 'gradeLevel', 'subject', 'channel']);
                        obj['channel'] = channelMapping[obj.channel];
                        this.collectionData.push(obj);
                    });

                    this.headers = {
                        type: 'Type',
                        name: 'Name',
                        subject: 'Subject',
                        grade: 'Grade',
                        medium: 'Medium',
                        board: 'Board',
                        channel: 'Tenant Name'
                    };
                    if (!_.isUndefined(modal)) {
                        this.deleteModal.deny();
                    }
                    this.collectionListModal = true;
                }, (error) => {
                    this.toasterService.error(_.get(this.resourceService, 'messages.emsg.m0014'));
                    console.log(error);
                });
            }, (error) => {
                this.toasterService.error(_.get(this.resourceService, 'messages.emsg.m0015'));
                console.log(error);
            });
    }

    /**
    * This method deletes content using the content id.
    */
    deleteContent(contentId) {
        this.showLoader = true;
        this.loaderMessage = {
            'loaderMessage': this.resourceService.messages.stmsg.m0034,
        };

        this.delete(contentId).subscribe((data: ServerResponse) => {
            this.showLoader = false;
            this.allStudents = this.removeAllMyContent(this.allStudents, contentId);
            if (this.allStudents.length === 0) {
                this.ngOnInit();
            }
            this.toasterService.success(this.resourceService.messages.smsg.m0006);
        }, (err: ServerResponse) => {
            this.showLoader = false;
            this.toasterService.error(this.resourceService.messages.fmsg.m0022);
        });

        if (!_.isUndefined(this.deleteModal)) {
            this.deleteModal.deny();
        }
    }

    /**
     * This method helps to navigate to different pages.
     * If page number is less than 1 or page number is greater than total number
     * of pages is less which is not possible, then it returns.
     *
     * @param {number} page Variable to know which page has been clicked
     *
     * @example navigateToPage(1)
     */
    navigateToPage(page: number): undefined | void {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.pageNumber = page;
        this.router.navigate(['workspace/content/assessments/assign', this.pageNumber], { queryParams: this.queryParams });
    }

    contentClick(content) {
        if (content.originData) {
            const originData = JSON.parse(content.originData);
            if (originData.copyType === 'shallow') {
                const errMsg = (this.resourceService.messages.emsg.m1414).replace('{instance}', originData.organisation[0]);
                this.toasterService.error(errMsg);
                return;
            }
        }
        if (_.size(content.lockInfo) && this.userService.userid !== content.lockInfo.createdBy) {
            this.lockPopupData = content;
            this.showLockedContentModal = true;
        } else {
            const status = content.status.toLowerCase();
            if (status === 'processing') {
                return;
            }
            if (status === 'draft') { // only draft state contents need to be locked
                this.workSpaceService.navigateToContent(content, this.state);
            } else {
                this.workSpaceService.navigateToContent(content, this.state);
            }
        }
    }

    public onCloseLockInfoPopup() {
        this.showLockedContentModal = false;
    }

    inview(event) {
        _.forEach(event.inview, (inview, key) => {
            const obj = _.find(this.inviewLogs, (o) => {
                return o.objid === inview.data.identifier;
            });
            if (obj === undefined) {
                this.inviewLogs.push({
                    objid: inview.data.identifier,
                    objtype: inview.data.contentType,
                    index: inview.id
                });
            }
        });
        this.telemetryImpression.edata.visits = this.inviewLogs;
        this.telemetryImpression.edata.subtype = 'pageexit';
        this.telemetryImpression = Object.assign({}, this.telemetryImpression);
    }

    removeAllMyContent(contentList, requestData) {
        return contentList.filter((content) => {
            return requestData.indexOf(content.identifier) === -1;
        });
    }

    handleAssignStudent(student): void {
        const requestBody = {
            id: this.assessment.batchId || '',
            courseId: this.assessment.identifier || 'do_11372741650354176012',
            name: this.assessment.name,
            description: this.assessment.description,
            enrollmentType: this.assessment.enrollmentType,
            startDate: this.assessment.startDate,
            endDate: this.assessment.endDate || null,
            createdFor: this.assessment.channel,
            // participants: []
        };

        console.log('requestBody - ', requestBody);
    }

    // public updateBatch() {
    //     let participants = [];
    //     const selectedMentors = [];
    //     let mentors = this.batchUpdateForm.value.mentors || [];
    //     if (this.batchUpdateForm.value.enrollmentType !== 'open') {
    //       participants = this.batchUpdateForm.value.users || [];
    //     }
    //     const startDate = dayjs(this.batchUpdateForm.value.startDate).format('YYYY-MM-DD');
    //     const endDate = this.batchUpdateForm.value.endDate && dayjs(this.batchUpdateForm.value.endDate).format('YYYY-MM-DD');
    //     const requestBody = {
    //       id: this.batchId,
    //       courseId: this.courseId,
    //       name: this.batchUpdateForm.value.name,
    //       description: this.batchUpdateForm.value.description,
    //       enrollmentType: this.batchUpdateForm.value.enrollmentType,
    //       startDate: startDate,
    //       endDate: endDate || null,
    //       createdFor: this.userService.userProfile.organisationIds,
    //       mentors: _.compact(mentors)
    //     };
    //     if (this.batchUpdateForm.value.enrollmentType === 'open' && this.batchUpdateForm.value.enrollmentEndDate) {
    //       requestBody['enrollmentEndDate'] = dayjs(this.batchUpdateForm.value.enrollmentEndDate).format('YYYY-MM-DD');
    //     }
    
    //     const requests = [];
    //     requests.push(this.courseBatchService.updateBatch(requestBody));
    //     if (this.removedUsers && this.removedUsers.length > 0) {
    //       requests.push(this.removeParticipantFromBatch(this.batchId, this.removedUsers));
    //     }
    //     if (participants && participants.length > 0) {
    //       requests.push(this.addParticipantToBatch(this.batchId, participants));
    //     }
    
    //     forkJoin(requests).subscribe(results => {
    //       // this.disableSubmitBtn = false;
    //       this.toasterService.success(this.resourceService.messages.smsg.m0034);
    //       this.checkIssueCertificate(this.batchId, this.batchDetails);
    //       this.checkEnableDiscussions(this.batchId);
    //     }, (err) => {
    //       if (err.error && err.error.params && err.error.params.errmsg) {
    //         this.toasterService.error(err.error.params.errmsg);
    //       } else {
    //         this.toasterService.error(this.resourceService.messages.fmsg.m0052);
    //       }
    //     });
    // }

    ngOnDestroy(): void {

    }
}
