import { Component } from '@angular/core';

import { SettingsPage } from '../settings/settings';
import { HistoryPage } from '../history/history';
import { AlarmPage } from '../alarm/alarm';
import {Events} from 'ionic-angular';
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = AlarmPage;
  tab2Root = SettingsPage;
  tab3Root = HistoryPage;

  constructor(public events:Events) {

  }
  alarmClicked ()
  {
    this.events.publish('tab:changed',0);
  }
}
