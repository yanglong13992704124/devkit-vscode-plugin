import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { I18nService } from '../service/i18n.service';
import { COLOR_THEME, VscodeService } from '../service/vscode.service';

@Component({
    selector: 'app-error-instruction',
    templateUrl: './error-instruction.component.html',
    styleUrls: ['./error-instruction.component.scss']
})
export class ErrorInstructionComponent implements OnInit {

    constructor(
        private route: ActivatedRoute,
        private I18n: I18nService,
        public vscodeService: VscodeService,
    ) {
        this.i18n = this.I18n.I18n();
        // vscode颜色主题
        if (document.body.className.indexOf('vscode-light') !== -1) {
            this.currTheme = COLOR_THEME.Light;
        }

        this.vscodeService.regVscodeMsgHandler('colorTheme', (msg: any) => {
            this.currTheme = msg.colorTheme;
        });
    }
    public i18n: any;
    public currTheme = COLOR_THEME.Dark;
    public serverIp: any;
    public servicePort: any;
    public deployIP: string;
    public isDeployFlag = false;
    public networkErrorTip: any;
    public networkErrorYunTip: any;
    public connIssueTwoDesc: any;
    // 获取主题颜色
    public ColorTheme = {
        Dark: COLOR_THEME.Dark,
        Light: COLOR_THEME.Light
    };

    public pluginUrlCfg: any = {
        error_tipFAQ8: '',
    };

    /**
     * 组件初始化
     */
    ngOnInit() {
        // vscode颜色主题
        if (document.body.className.indexOf('vscode-light') !== -1) {
            this.currTheme = COLOR_THEME.Light;
        }

        this.vscodeService.regVscodeMsgHandler('colorTheme', (msg: any) => {
            this.currTheme = msg.colorTheme;
        });

        // 从Panel创建传参中获取后端服务器IP和端口
        this.route.queryParams.subscribe((data) => {
            this.serverIp = data.ip;
            this.servicePort = data.port;
            this.deployIP = data.deployIP;
        });

        // 获取全局url配置数据
        this.vscodeService.postMessage({ cmd: 'readUrlConfig' }, (resp: any) => {
            this.pluginUrlCfg = {
                error_tipFAQ9: resp.error_tipFAQ9,
                error_tipFAQ8: resp.error_tipFAQ8,
            };

            // 根据deployIP传参是否为空,判定是否为安装场景,为空对应非安装场景
            if (this.deployIP !== undefined) {
                this.isDeployFlag = true;
            }
            const accessCommunity = document.getElementById('access-community');
            const errorLink1 = this.I18n.I18nReplace(this.i18n.plugins_common_message_CommunityTipLink,
                { 0: this.pluginUrlCfg.error_tipFAQ9 });
            if (this.isDeployFlag) {
                this.networkErrorTip =
                 this.I18n.I18nReplace(this.i18n.plugins_common_message_networkErrorTip_deployScenario,
                    { 0: this.deployIP });
                this.networkErrorYunTip = this.i18n.plugins_common_message_networkErrorYunTip_deployScenario;
                accessCommunity.innerHTML = this.I18n.I18nReplace(this.i18n.plugins_common_message_CommunityTip,
                    { 0: '3', 1: errorLink1 });
                this.connIssueTwoDesc = this.i18n.plugins_common_message_connIssue2_deployScenario;
            } else {
                this.networkErrorTip = this.I18n.I18nReplace(this.i18n.plugins_common_message_networkErrorTip,
                    { 0: this.serverIp, 1: this.servicePort });
                this.networkErrorYunTip = this.i18n.plugins_common_message_networkErrorYunTip;
                accessCommunity.innerHTML = this.I18n.I18nReplace(this.i18n.plugins_common_message_CommunityTip,
                    { 0: '4', 1: errorLink1 });
                this.connIssueTwoDesc =
                this.I18n.I18nReplace(this.i18n.plugins_common_message_connIssue2, { 0: this.servicePort });
                const serverErrorNoCase = document.getElementById('server-error');

                const errorLink = this.I18n.I18nReplace(this.i18n.plugins_common_message_serverErrorResult2Link,
                    { 0: this.pluginUrlCfg.error_tipFAQ8 });
                serverErrorNoCase.innerHTML = this.I18n.I18nReplace(this.i18n.plugins_common_message_serverErrorResult2,
                    { 0: errorLink });
            }
        });
    }

}
