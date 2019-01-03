import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Setting } from '../setting';
import { SettingService } from '../setting.service';
import { ApiResponse } from '../api-response';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  settings: Setting[];
  errorResponse: ApiResponse;

  constructor(private settingService: SettingService, private router: Router) { }

  ngOnInit() {
    this.settingService.index().then((settings) => this.settings = settings);
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
