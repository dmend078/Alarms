import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Subscription, Observable } from 'rxjs/Rx';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { Events } from 'ionic-angular';
@Component({
  selector: 'page-alarm',
  templateUrl: 'alarm.html'
})
export class AlarmPage implements OnInit {

  public alarmSelector = 0;
  public time = {hr:0,min:0,sec:0}
  public sub:Subscription;
  private timer;
  public actionButtonText = "Start";
  public loader;
  public showMessage = false;
  public alerts= [];
  public data = {alarmName:"",alarms:[
    {time:"00:00:00",title:"",body:""},
    {time:"00:00:00",title:"",body:""},
  ]}
  constructor(public navCtrl: NavController,public alertCtrl: AlertController,private storage: Storage,public loadingCtrl: LoadingController,public events: Events) {
    this.presentLoading();
    this.events.subscribe('tab:changed', (index) => {
          if (index == 0)
          {
            this.loadData();
          }
      });
  }

  public loadData ()
  {

    this.storage.get('alarms').then((val)=> {
      if (val != null)
      {
        if (val.alarms[0]!=null)
        {
          this.data = val.alarms[0];
        }
        else {
          this.data = null;
        }
      }
      else {
        this.data = null;
      }

    });
  }
  ngOnInit (){
    this.loadData();
    this.loader.dismiss();
  }
  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    this.loader.present();
  }

  public startTimer(){
    if (this.actionButtonText == "Start" || this.actionButtonText == "Resume")
    {
      this.showMessage = true;
      this.actionButtonText = "Pause";
      this.timer = Observable.timer(1000,1000);
      this.sub = this.timer.subscribe(t => this.tickerFunc(t));  
    }
    else if (this.actionButtonText == "Pause")
    {
      this.stopTimer();
      this.actionButtonText = "Resume"
    }


  }
  public getTime (val)
  {
    return  Number(val);
  }
  public parseAlarmTime (val,position)
  {
    return val.split(':')[position];
  }
    tickerFunc(tick){
      if (this.time.hr == this.getTime(this.parseAlarmTime(this.data.alarms[this.alarmSelector].time,0)) && 
          this.time.min == this.getTime(this.parseAlarmTime(this.data.alarms[this.alarmSelector].time,1)) && 
          this.time.sec == this.getTime(this.parseAlarmTime(this.data.alarms[this.alarmSelector].time,2)))
      {
        this.action();
      }
      else
      {
        if (this.time.sec < 60)
          {
            this.time.sec++;
          }
          else
          {
            if (this.time.min < 60)
            {
              this.time.sec = 0;
              this.time.min++;
            }
            else
            {
              this.time.min = 0;
              if (this.time.hr < 24)
              {
                this.time.hr++;
              }
              else
              {
                this.time.hr = 0;
              }

            }
          }
      }

  }
  public stopTimer(){
    this.sub.unsubscribe();
  }
  public cancelTimer ()
  {
    this.stopTimer();
    this.resetTimer();
    this.showMessage = false;
    this.actionButtonText = "Start";
  }
  public action()
  {
    if (this.alarmSelector < this.data.alarms.length-1)
    {
      this.alarmSelector++
    }
    else
    {
      this.alarmSelector = 0;
    }
    this.resetTimer();
    this.showAlert();
  }

  public resetTimer()
  {
    this.time.hr = 0;
    this.time.min = 0;
    this.time.sec = 0;
  }
  dismissAlert() {
    if (this.alerts.length) {
        this.alerts.forEach(e => {
            e.dismiss();
        });
    }
    this.alerts = [];
}
  showAlert() {
   this.dismissAlert();
    var alert = this.alertCtrl.create({
      title: this.data.alarms[this.alarmSelector].title,
      subTitle: this.data.alarms[this.alarmSelector].body,
      buttons: ['OK']
    });
    this.alerts.push(alert);
    alert.present();   
  }
}
