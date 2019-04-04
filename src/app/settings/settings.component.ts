import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Setting } from '../setting';
import { AuthService } from '../auth.service';
import { SettingService } from '../setting.service';
import { ApiResponse } from '../api-response';
import { User } from '../user';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  navigationSubscription;

  settings: Setting[];
  errorResponse: ApiResponse;

  user: User;
  username = '';

  constructor(private router: Router, private settingService: SettingService,
    private authService: AuthService) {
      this.navigationSubscription = this.router.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
        }
        this.username = this.authService.getCurrentUser().username;
        this.settingService.index(this.username).then((settings) => this.settings = settings);
      });
  }

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.username = this.user.username; // this.authService.getCurrentUser().username;
    this.settingService.index(this.username).then((settings) => this.settings = settings);
  }

  createSetting() {

    // type, content, username
    const types = ['메뉴분류순서', 'SMS발신폰번호', '모바일주문', '접수문자', '차림문자'];
    const promises = [];

    for (let i = 0; i < types.length; i++) {
      if (this.checkSetting(types[i]) === false) {
        const setting = {} as Setting;
        setting.no = i + 1;
        setting.type = types[i];
        setting.content = '';
        setting.username = this.username;

        promises.push(this.settingService.create(setting));
      }
    }

    Promise.all(promises)
    .then(function(data) {
    })
    .catch(function(err) {
      console.log('5.', err);
      // this.errorResponse = err;
    });
    this.router.navigate(['/settings']);
  }

  checkSetting(type: string) {
    for (let i = 0; i < this.settings.length; i++) {
      if (this.settings[i].type === type) {
        return true;
      }
    }
    return false;
  }

  setContent(setting: Setting, content: string) {
    if (setting.type === 'SMS발신폰번호') {
      setting.content = setting.content.replace(/[^0-9]/g, ''); // 숫자만 추출
    } else if ( setting.type === '모바일주문') {
      setting.content = content;
    }

    this.settingService.update(setting._id, setting)
      .then(data => {
        this.router.navigate(['/', 'settings']);
      })
      .catch(response => {
        this.errorResponse = response;
      });
  }

  deleteSetting(id: string) {
    // 삭제하면 송품장의 수량과 금액을 수정해야 한다.
    const answer = confirm('설정 정보를 삭제하시겠습니까?');
    if (answer) {
      this.settingService.destroy(id)
      .then(setting => {
        alert('삭제하였습니다.');
        this.router.navigate(['/settings']);
      })
      .catch(err => {
        this.errorResponse = err;
      })
      .catch(response => {
        this.errorResponse = response;
      });
    }
  }
}
