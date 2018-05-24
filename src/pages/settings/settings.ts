import { Component,OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import {AddAlarmPage} from '../add-alarm/add-alarm';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage implements OnInit {

  public alarms = [];
  constructor(public navCtrl: NavController,public modalCtrl: ModalController,public storage:Storage) {

  }
  public ngOnInit()
  {
    this.storage.get('alarms').then((val) => {
      if(val != null && val!="")
      {
        this.alarms = [];
        val.alarms.forEach(element=> {
          this.alarms.push({alarmName:element.alarmName,selected:false});
        });
      } 
    });
  }
  public addAlarm ()
  {
    let modal = this.modalCtrl.create(AddAlarmPage);
    modal.onDidDismiss(() => {
      this.ngOnInit();
  });
    modal.present();
  }
  public deleteAlarm (index)
  {
    this.storage.get('alarms').then((val)=>{
       val.alarms.splice(index,1);
       this.storage.set('alarms',val);
    });
  }
  public edit(index){
     this.storage.get('alarms').then((val)=> {
        let modal = this.modalCtrl.create(AddAlarmPage,{'alarm':val.alarms[index]});
        modal.onDidDismiss(() => {
          this.ngOnInit();
      });
        modal.present();
     });
  }
  public deleteAlarms()
  {
     for(var i=0;i<this.alarms.length;i++)
     {
       this.deleteAlarm(i);
     }
     this.ngOnInit();
  }
}
